"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
class MenuService {
    async getMenuTree() {
        try {
            const rootMenus = await prisma.menu.findMany({
                where: { parentId: null },
                orderBy: { order: 'asc' }
            });
            const menuTree = await Promise.all(rootMenus.map(menu => this.getMenuWithChildren(menu.id)));
            return menuTree;
        }
        catch (error) {
            logger_1.Logger.error('Error in getMenuTree:', error);
            throw error;
        }
    }
    async getMenuWithChildren(menuId) {
        try {
            const menu = await prisma.menu.findUnique({
                where: { id: menuId },
                include: {
                    form: true,
                    children: {
                        orderBy: { order: 'asc' }
                    }
                }
            });
            if (!menu) {
                throw new Error(`Menu with ID ${menuId} not found`);
            }
            const children = await Promise.all(menu.children.map(child => this.getMenuWithChildren(child.id)));
            return {
                ...menu,
                children
            };
        }
        catch (error) {
            logger_1.Logger.error(`Error in getMenuWithChildren for ID ${menuId}:`, error);
            throw error;
        }
    }
    async createMenu(data) {
        try {
            if (data.parentId) {
                const parentExists = await prisma.menu.findUnique({
                    where: { id: data.parentId }
                });
                if (!parentExists) {
                    throw new Error(`Parent menu with ID ${data.parentId} not found`);
                }
            }
            if (data.type === 'FORM' && data.formId) {
                const formExists = await prisma.form.findUnique({
                    where: { id: data.formId }
                });
                if (!formExists) {
                    throw new Error(`Form with ID ${data.formId} not found`);
                }
            }
            const lastMenu = await prisma.menu.findFirst({
                where: { parentId: data.parentId || null },
                orderBy: { order: 'desc' }
            });
            const order = lastMenu ? lastMenu.order + 1 : 0;
            const menu = await prisma.menu.create({
                data: {
                    ...data,
                    order
                }
            });
            return menu;
        }
        catch (error) {
            logger_1.Logger.error('Error in createMenu:', error);
            throw error;
        }
    }
    async updateMenu(id, data) {
        try {
            const menu = await prisma.menu.update({
                where: { id },
                data
            });
            return menu;
        }
        catch (error) {
            logger_1.Logger.error(`Error in updateMenu for ID ${id}:`, error);
            throw error;
        }
    }
    async deleteMenu(id) {
        try {
            const hasChildren = await prisma.menu.count({
                where: { parentId: id }
            });
            if (hasChildren > 0) {
                throw new Error('Cannot delete menu with children');
            }
            await prisma.menu.delete({
                where: { id }
            });
            return true;
        }
        catch (error) {
            logger_1.Logger.error(`Error in deleteMenu for ID ${id}:`, error);
            throw error;
        }
    }
    async reorderMenus(parentId, menuIds) {
        try {
            await prisma.$transaction(menuIds.map((id, index) => prisma.menu.update({
                where: { id },
                data: { order: index }
            })));
            return true;
        }
        catch (error) {
            logger_1.Logger.error('Error in reorderMenus:', error);
            throw error;
        }
    }
    async moveMenu(id, newParentId) {
        try {
            if (newParentId) {
                const isChild = await this.isChildMenu(newParentId, id);
                if (isChild) {
                    throw new Error('Cannot move menu to one of its children');
                }
            }
            const menu = await prisma.menu.update({
                where: { id },
                data: { parentId: newParentId }
            });
            return menu;
        }
        catch (error) {
            logger_1.Logger.error(`Error in moveMenu for ID ${id}:`, error);
            throw error;
        }
    }
    async isChildMenu(parentId, childId) {
        const parent = await prisma.menu.findUnique({
            where: { id: parentId },
            include: { children: true }
        });
        if (!parent)
            return false;
        for (const child of parent.children) {
            if (child.id === childId)
                return true;
            const isChild = await this.isChildMenu(child.id, childId);
            if (isChild)
                return true;
        }
        return false;
    }
}
exports.MenuService = MenuService;
//# sourceMappingURL=menu.service.js.map
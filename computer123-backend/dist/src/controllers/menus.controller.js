"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuController = void 0;
const menu_service_1 = require("../services/menu.service");
class MenuController {
    constructor() {
        this.menuService = new menu_service_1.MenuService();
    }
    async getMenus(req, res) {
        try {
            const menus = await this.menuService.getMenus();
            res.json({
                success: true,
                data: menus
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'An unknown error occurred'
                });
            }
        }
    }
    async getMenu(req, res) {
        try {
            const { id } = req.params;
            const menu = await this.menuService.getMenu(id);
            res.json({
                success: true,
                data: menu
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(error.message.includes('not found') ? 404 : 500).json({
                    success: false,
                    error: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'An unknown error occurred'
                });
            }
        }
    }
    async createMenu(req, res) {
        try {
            const menuData = {
                order: req.body.order || 0,
                title: req.body.title,
                icon: req.body.icon,
                type: req.body.type,
                config: req.body.config,
                parentId: req.body.parentId,
                formId: req.body.formId,
                permissions: req.body.permissions || [],
                roles: req.body.roles || []
            };
            const menu = await this.menuService.createMenu(menuData);
            res.status(201).json({
                success: true,
                data: menu
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    error: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'An unknown error occurred'
                });
            }
        }
    }
    async updateMenu(req, res) {
        try {
            const { id } = req.params;
            const menuData = {
                order: req.body.order,
                title: req.body.title,
                icon: req.body.icon,
                type: req.body.type,
                config: req.body.config,
                parentId: req.body.parentId,
                formId: req.body.formId,
                permissions: req.body.permissions,
                roles: req.body.roles
            };
            const menu = await this.menuService.updateMenu(id, menuData);
            res.json({
                success: true,
                data: menu
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(error.message.includes('not found') ? 404 : 400).json({
                    success: false,
                    error: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'An unknown error occurred'
                });
            }
        }
    }
    async deleteMenu(req, res) {
        try {
            const { id } = req.params;
            await this.menuService.deleteMenu(id);
            res.json({
                success: true,
                message: 'Menu deleted successfully'
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(error.message.includes('not found') ? 404 : 400).json({
                    success: false,
                    error: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'An unknown error occurred'
                });
            }
        }
    }
    async getMenuTree(req, res) {
        try {
            const tree = await this.menuService.getMenuTree();
            res.json({
                success: true,
                data: tree
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'An unknown error occurred'
                });
            }
        }
    }
    async getMenuWithChildren(req, res) {
        try {
            const { id } = req.params;
            const menu = await this.menuService.getMenuWithChildren(id);
            res.json({
                success: true,
                data: menu
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'An unknown error occurred'
                });
            }
        }
    }
}
exports.MenuController = MenuController;
//# sourceMappingURL=menus.controller.js.map
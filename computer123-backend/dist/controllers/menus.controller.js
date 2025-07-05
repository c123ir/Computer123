"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenusController = void 0;
const menu_service_1 = require("../services/menu.service");
const logger_1 = require("../utils/logger");
class MenusController {
    constructor() {
        this.menuService = new menu_service_1.MenuService();
    }
    async getMenuTree(req, res) {
        try {
            const menuTree = await this.menuService.getMenuTree();
            res.json({
                success: true,
                data: menuTree
            });
        }
        catch (error) {
            logger_1.Logger.error('Error in getMenuTree controller:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get menu tree'
            });
        }
    }
    async getMenuById(req, res) {
        try {
            const { id } = req.params;
            const menu = await this.menuService.getMenuWithChildren(id);
            res.json({
                success: true,
                data: menu
            });
        }
        catch (error) {
            logger_1.Logger.error(`Error in getMenuById controller for ID ${req.params.id}:`, error);
            res.status(error.message.includes('not found') ? 404 : 500).json({
                success: false,
                error: error.message
            });
        }
    }
    async createMenu(req, res) {
        try {
            const menuData = req.body;
            const menu = await this.menuService.createMenu(menuData);
            res.status(201).json({
                success: true,
                data: menu
            });
        }
        catch (error) {
            logger_1.Logger.error('Error in createMenu controller:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async updateMenu(req, res) {
        try {
            const { id } = req.params;
            const menuData = req.body;
            const menu = await this.menuService.updateMenu(id, menuData);
            res.json({
                success: true,
                data: menu
            });
        }
        catch (error) {
            logger_1.Logger.error(`Error in updateMenu controller for ID ${req.params.id}:`, error);
            res.status(error.message.includes('not found') ? 404 : 400).json({
                success: false,
                error: error.message
            });
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
            logger_1.Logger.error(`Error in deleteMenu controller for ID ${req.params.id}:`, error);
            res.status(error.message.includes('not found') ? 404 : 400).json({
                success: false,
                error: error.message
            });
        }
    }
    async reorderMenus(req, res) {
        try {
            const { parentId, menuIds } = req.body;
            await this.menuService.reorderMenus(parentId, menuIds);
            res.json({
                success: true,
                message: 'Menus reordered successfully'
            });
        }
        catch (error) {
            logger_1.Logger.error('Error in reorderMenus controller:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async moveMenu(req, res) {
        try {
            const { id } = req.params;
            const { newParentId } = req.body;
            const menu = await this.menuService.moveMenu(id, newParentId);
            res.json({
                success: true,
                data: menu
            });
        }
        catch (error) {
            logger_1.Logger.error(`Error in moveMenu controller for ID ${req.params.id}:`, error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}
exports.MenusController = MenusController;
//# sourceMappingURL=menus.controller.js.map
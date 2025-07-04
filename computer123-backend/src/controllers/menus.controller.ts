// src/controllers/menus.controller.ts

import { Request, Response } from 'express';
import { MenuService, CreateMenuDto, UpdateMenuDto } from '../services/menu.service';
import { Logger } from '../utils/logger';

export class MenusController {
  private menuService: MenuService;

  constructor() {
    this.menuService = new MenuService();
  }

  // دریافت ساختار درختی منوها
  async getMenuTree(req: Request, res: Response) {
    try {
      const menuTree = await this.menuService.getMenuTree();
      res.json({
        success: true,
        data: menuTree
      });
    } catch (error) {
      Logger.error('Error in getMenuTree controller:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get menu tree'
      });
    }
  }

  // دریافت یک منو با زیرمنوهایش
  async getMenuById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const menu = await this.menuService.getMenuWithChildren(id);
      res.json({
        success: true,
        data: menu
      });
    } catch (error) {
      Logger.error(`Error in getMenuById controller for ID ${req.params.id}:`, error);
      res.status(error.message.includes('not found') ? 404 : 500).json({
        success: false,
        error: error.message
      });
    }
  }

  // ایجاد منوی جدید
  async createMenu(req: Request, res: Response) {
    try {
      const menuData: CreateMenuDto = req.body;
      const menu = await this.menuService.createMenu(menuData);
      res.status(201).json({
        success: true,
        data: menu
      });
    } catch (error) {
      Logger.error('Error in createMenu controller:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // به‌روزرسانی منو
  async updateMenu(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const menuData: UpdateMenuDto = req.body;
      const menu = await this.menuService.updateMenu(id, menuData);
      res.json({
        success: true,
        data: menu
      });
    } catch (error) {
      Logger.error(`Error in updateMenu controller for ID ${req.params.id}:`, error);
      res.status(error.message.includes('not found') ? 404 : 400).json({
        success: false,
        error: error.message
      });
    }
  }

  // حذف منو
  async deleteMenu(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.menuService.deleteMenu(id);
      res.json({
        success: true,
        message: 'Menu deleted successfully'
      });
    } catch (error) {
      Logger.error(`Error in deleteMenu controller for ID ${req.params.id}:`, error);
      res.status(error.message.includes('not found') ? 404 : 400).json({
        success: false,
        error: error.message
      });
    }
  }

  // تغییر ترتیب منوها
  async reorderMenus(req: Request, res: Response) {
    try {
      const { parentId, menuIds } = req.body;
      await this.menuService.reorderMenus(parentId, menuIds);
      res.json({
        success: true,
        message: 'Menus reordered successfully'
      });
    } catch (error) {
      Logger.error('Error in reorderMenus controller:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // انتقال منو
  async moveMenu(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { newParentId } = req.body;
      const menu = await this.menuService.moveMenu(id, newParentId);
      res.json({
        success: true,
        data: menu
      });
    } catch (error) {
      Logger.error(`Error in moveMenu controller for ID ${req.params.id}:`, error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
} 
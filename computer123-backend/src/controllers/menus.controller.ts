// src/controllers/menus.controller.ts

import { Request, Response } from 'express';
import { MenuService } from '../services/menu.service';
import { MenuType, Status } from '@prisma/client';

export class MenuController {
  private menuService: MenuService;

  constructor() {
    this.menuService = new MenuService();
  }

  // Get all menus
  async getMenus(req: Request, res: Response) {
    try {
      const menus = await this.menuService.getMenus();
      res.json({
        success: true,
        data: menus
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'An unknown error occurred'
        });
      }
    }
  }

  // Get menu by ID
  async getMenu(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const menu = await this.menuService.getMenu(id);
      res.json({
        success: true,
        data: menu
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(error.message.includes('not found') ? 404 : 500).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'An unknown error occurred'
        });
      }
    }
  }

  // Create menu
  async createMenu(req: Request, res: Response) {
    try {
      const menuData = {
        order: req.body.order || 0,
        title: req.body.title,
        icon: req.body.icon,
        type: req.body.type as MenuType,
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
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'An unknown error occurred'
        });
      }
    }
  }

  // Update menu
  async updateMenu(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const menuData = {
        order: req.body.order,
        title: req.body.title,
        icon: req.body.icon,
        type: req.body.type as MenuType,
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
    } catch (error) {
      if (error instanceof Error) {
        res.status(error.message.includes('not found') ? 404 : 400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'An unknown error occurred'
        });
      }
    }
  }

  // Delete menu
  async deleteMenu(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.menuService.deleteMenu(id);
      res.json({
        success: true,
        message: 'Menu deleted successfully'
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(error.message.includes('not found') ? 404 : 400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'An unknown error occurred'
        });
      }
    }
  }

  // Get menu tree
  async getMenuTree(req: Request, res: Response) {
    try {
      const tree = await this.menuService.getMenuTree();
      res.json({
        success: true,
        data: tree
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'An unknown error occurred'
        });
      }
    }
  }

  // Get menu with children
  async getMenuWithChildren(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const menu = await this.menuService.getMenuWithChildren(id);
      res.json({
        success: true,
        data: menu
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'An unknown error occurred'
        });
      }
    }
  }
} 
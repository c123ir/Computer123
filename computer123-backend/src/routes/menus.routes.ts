import { Router } from 'express';
import { MenuController } from '../controllers/menus.controller';
import { validateMenu } from '../middleware/validate.middleware';

const router = Router();
const menuController = new MenuController();

// دریافت ساختار درختی منوها
router.get('/tree', menuController.getMenuTree.bind(menuController));

// دریافت یک منو با زیرمنوهایش
router.get('/:id', menuController.getMenu.bind(menuController));

// ایجاد منوی جدید
router.post('/', validateMenu, menuController.createMenu.bind(menuController));

// به‌روزرسانی منو
router.put('/:id', validateMenu, menuController.updateMenu.bind(menuController));

// حذف منو
router.delete('/:id', menuController.deleteMenu.bind(menuController));

// Get all menus
router.get('/', menuController.getMenus.bind(menuController));

// Get menu with children
router.get('/:id/children', menuController.getMenuWithChildren.bind(menuController));

export default router; 
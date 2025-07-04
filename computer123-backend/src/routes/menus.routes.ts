import { Router } from 'express';
import { MenusController } from '../controllers/menus.controller';
import { validateMenu } from '../middleware/validate.middleware';

const router = Router();
const menusController = new MenusController();

// دریافت ساختار درختی منوها
router.get('/tree', menusController.getMenuTree.bind(menusController));

// دریافت یک منو با زیرمنوهایش
router.get('/:id', menusController.getMenuById.bind(menusController));

// ایجاد منوی جدید
router.post('/', validateMenu, menusController.createMenu.bind(menusController));

// به‌روزرسانی منو
router.put('/:id', validateMenu, menusController.updateMenu.bind(menusController));

// حذف منو
router.delete('/:id', menusController.deleteMenu.bind(menusController));

// تغییر ترتیب منوها
router.post('/reorder', menusController.reorderMenus.bind(menusController));

// انتقال منو
router.post('/:id/move', menusController.moveMenu.bind(menusController));

export default router; 
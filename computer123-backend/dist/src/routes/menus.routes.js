"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menus_controller_1 = require("../controllers/menus.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = (0, express_1.Router)();
const menusController = new menus_controller_1.MenusController();
router.get('/tree', menusController.getMenuTree.bind(menusController));
router.get('/:id', menusController.getMenuById.bind(menusController));
router.post('/', validate_middleware_1.validateMenu, menusController.createMenu.bind(menusController));
router.put('/:id', validate_middleware_1.validateMenu, menusController.updateMenu.bind(menusController));
router.delete('/:id', menusController.deleteMenu.bind(menusController));
router.post('/reorder', menusController.reorderMenus.bind(menusController));
router.post('/:id/move', menusController.moveMenu.bind(menusController));
exports.default = router;
//# sourceMappingURL=menus.routes.js.map
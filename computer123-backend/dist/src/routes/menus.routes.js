"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menus_controller_1 = require("../controllers/menus.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = (0, express_1.Router)();
const menuController = new menus_controller_1.MenuController();
router.get('/tree', menuController.getMenuTree.bind(menuController));
router.get('/:id', menuController.getMenu.bind(menuController));
router.post('/', validate_middleware_1.validateMenu, menuController.createMenu.bind(menuController));
router.put('/:id', validate_middleware_1.validateMenu, menuController.updateMenu.bind(menuController));
router.delete('/:id', menuController.deleteMenu.bind(menuController));
router.post('/reorder', menuController.reorderMenus.bind(menuController));
router.post('/:id/move', menuController.moveMenu.bind(menuController));
router.get('/', menuController.getMenus.bind(menuController));
router.get('/:id/children', menuController.getMenuWithChildren.bind(menuController));
exports.default = router;
//# sourceMappingURL=menus.routes.js.map
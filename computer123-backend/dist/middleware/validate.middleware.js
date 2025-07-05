"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMenuMove = exports.validateMenuReorder = exports.validateMenu = exports.validateForm = void 0;
const client_1 = require("@prisma/client");
const validateForm = (req, res, next) => {
    const { name, fields } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Form name is required'
        });
    }
    if (!fields || !Array.isArray(fields)) {
        return res.status(400).json({
            success: false,
            error: 'Form fields must be an array'
        });
    }
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (!field.id || !field.type || !field.label) {
            return res.status(400).json({
                success: false,
                error: `Field at index ${i} is missing required properties (id, type, label)`
            });
        }
    }
    if (name.length > 255) {
        return res.status(400).json({
            success: false,
            error: 'Form name cannot exceed 255 characters'
        });
    }
    return next();
};
exports.validateForm = validateForm;
const validateMenu = (req, res, next) => {
    const { title, type, config, permissions, roles } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Menu title is required'
        });
    }
    if (title.length > 255) {
        return res.status(400).json({
            success: false,
            error: 'Menu title cannot exceed 255 characters'
        });
    }
    if (!type || !Object.values(client_1.MenuType).includes(type)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid menu type'
        });
    }
    if (!config || typeof config !== 'object') {
        return res.status(400).json({
            success: false,
            error: 'Menu config is required and must be an object'
        });
    }
    if (type === client_1.MenuType.FORM && !config.formId) {
        return res.status(400).json({
            success: false,
            error: 'Form ID is required for form-type menus'
        });
    }
    if (!Array.isArray(permissions)) {
        return res.status(400).json({
            success: false,
            error: 'Permissions must be an array'
        });
    }
    if (!Array.isArray(roles)) {
        return res.status(400).json({
            success: false,
            error: 'Roles must be an array'
        });
    }
    return next();
};
exports.validateMenu = validateMenu;
const validateMenuReorder = (req, res, next) => {
    const { parentId, menuIds } = req.body;
    if (!Array.isArray(menuIds) || menuIds.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Menu IDs must be a non-empty array'
        });
    }
    if (parentId && typeof parentId !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'Parent ID must be a string'
        });
    }
    return next();
};
exports.validateMenuReorder = validateMenuReorder;
const validateMenuMove = (req, res, next) => {
    const { newParentId } = req.body;
    if (newParentId && typeof newParentId !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'New parent ID must be a string'
        });
    }
    return next();
};
exports.validateMenuMove = validateMenuMove;
//# sourceMappingURL=validate.middleware.js.map
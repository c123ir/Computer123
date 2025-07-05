import { Request, Response, NextFunction } from 'express';
import { MenuType, Status } from '@prisma/client';

// اعتبارسنجی فرم
export const validateForm = (req: Request, res: Response, next: NextFunction) => {
  const { name, fields } = req.body;

  // Required fields check
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

  // Validate each field
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    
    if (!field.id || !field.type || !field.label) {
      return res.status(400).json({
        success: false,
        error: `Field at index ${i} is missing required properties (id, type, label)`
      });
    }
  }

  // Form name length check
  if (name.length > 255) {
    return res.status(400).json({
      success: false,
      error: 'Form name cannot exceed 255 characters'
    });
  }

  return next();
};

// اعتبارسنجی منو
export const validateMenu = (req: Request, res: Response, next: NextFunction) => {
  const { title, type, config, permissions, roles } = req.body;

  // بررسی عنوان
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

  // بررسی نوع منو
  if (!type || !Object.values(MenuType).includes(type)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid menu type'
    });
  }

  // بررسی پیکربندی
  if (!config || typeof config !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Menu config is required and must be an object'
    });
  }

  // اگر نوع منو FORM است، باید formId داشته باشد
  if (type === MenuType.FORM && !config.formId) {
    return res.status(400).json({
      success: false,
      error: 'Form ID is required for form-type menus'
    });
  }

  // بررسی دسترسی‌ها
  if (!Array.isArray(permissions)) {
    return res.status(400).json({
      success: false,
      error: 'Permissions must be an array'
    });
  }

  // بررسی نقش‌ها
  if (!Array.isArray(roles)) {
    return res.status(400).json({
      success: false,
      error: 'Roles must be an array'
    });
  }

  return next();
};

// اعتبارسنجی تغییر ترتیب منوها
export const validateMenuReorder = (req: Request, res: Response, next: NextFunction) => {
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

// اعتبارسنجی انتقال منو
export const validateMenuMove = (req: Request, res: Response, next: NextFunction) => {
  const { newParentId } = req.body;

  if (newParentId && typeof newParentId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'New parent ID must be a string'
    });
  }

  return next();
}; 
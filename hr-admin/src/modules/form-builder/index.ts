// src/modules/form-builder/index.ts

/**
 * Entry point برای ماژول Form Builder
 * این فایل تمام exports اصلی را مدیریت می‌کند
 */

// Types
export * from './types';

// Components
export * from './components';

// Hooks
export * from './hooks';

// Services
export { FormService } from './services/formService';
export { ValidationService } from './services/validationService';
export { DatabaseFactory } from './services/database/factory';

// Service Types
export type { DatabaseService, RealtimeService, CacheService, StorageService } from './services/database/interface';

// Main Components (for easier import)
export { FormBuilder } from './components/FormBuilder/FormBuilder';
export { useFormBuilder } from './hooks/useFormBuilder';

// Constants
export const FORM_BUILDER_VERSION = '1.0.0';
export const SUPPORTED_FIELD_TYPES = [
  'text', 'textarea', 'number', 'email', 'tel', 'url',
  'select', 'radio', 'checkbox', 
  'date', 'time', 'datetime',
  'file', 'signature', 'rating', 'slider'
] as const;

// Default Configuration
export const DEFAULT_FORM_CONFIG = {
  autoSave: true,
  autoSaveInterval: 30000,
  maxFields: 50,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
  themes: ['default', 'modern', 'dark', 'minimal'],
  languages: ['fa', 'en']
} as const;
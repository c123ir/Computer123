// src/modules/form-builder/types/index.ts

/**
 * Index file برای export کردن تمام types
 * این فایل تمام type definitions را از فایل‌های مختلف جمع‌آوری می‌کند
 */

// Form Types
export * from './form.types';

// Field Types  
export * from './field.types';

// Database Types
export * from './database.types';

// =================================
// Re-export اصلی‌ترین types برای دسترسی آسان
// =================================

// Form related
export type {
  Form,
  FormField,
  FormSettings,
  FormStyling,
  FormMetadata,
  FormResponse,
  FormTemplate,
  CreateFormDto,
  UpdateFormDto,
  FieldType,
  FieldOption,
  ValidationRules,
  MultiStepConfig
} from './form.types';

// Field related
export type {
  FieldPaletteItem,
  FieldState,
  FieldRegistry,
  FieldFactory,
  ValidationResult,
  ValidationErrorType,
  AccessibilityConfig,
  FieldGroup,
  FormSection,
  CustomValidator
} from './field.types';

// Database related
export type {
  DatabaseType,
  DatabaseConfig,
  QueryFilters,
  PaginationOptions,
  PaginatedResult,
  DatabaseStats,
  ExportOptions,
  ImportOptions,
  BatchResult,
  HealthCheckResult
} from './database.types';
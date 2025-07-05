// =====================================================
// 🔧 فایل: src/modules/form-builder/types/database.types.ts
// =====================================================

import { Form, CreateFormDto, UpdateFormDto } from './form.types';

/**
 * نوع پایگاه داده
 */
export type DatabaseType = 'firebase' | 'postgresql' | 'mongodb' | 'sqlite' | 'localstorage';

/**
 * تنظیمات پایگاه داده
 */
export interface DatabaseConfig {
  /** نوع پایگاه */
  type: DatabaseType;
  /** تنظیمات Firebase */
  firebase?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  /** تنظیمات PostgreSQL */
  postgresql?: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl?: boolean;
  };
  /** تنظیمات MongoDB */
  mongodb?: {
    uri: string;
    database: string;
  };
}

/**
 * نتیجه پاسخ API
 */
export interface ApiResponse<T = any> {
  /** موفق */
  success: boolean;
  /** داده */
  data?: T;
  /** پیام خطا */
  error?: string;
  /** پیام */
  message?: string;
}

/**
 * پاسخ صفحه‌بندی شده
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  /** اطلاعات صفحه‌بندی */
  pagination: {
    /** صفحه فعلی */
    page: number;
    /** حد صفحه */
    limit: number;
    /** تعداد کل */
    total: number;
    /** تعداد صفحات */
    totalPages: number;
  };
}

/**
 * فیلترهای جستجو
 */
export interface FormFilters {
  /** جستجو در نام */
  search?: string;
  /** فیلتر وضعیت */
  status?: string;
  /** فیلتر دسته */
  category?: string;
  /** فیلتر تگ‌ها */
  tags?: string[];
  /** ایجاد کننده */
  createdBy?: string;
  /** صفحه */
  page?: number;
  /** تعداد در صفحه */
  limit?: number;
  /** مرتب‌سازی */
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'responses';
  /** ترتیب */
  sortOrder?: 'asc' | 'desc';
}

/**
 * قالب فرم
 */
export interface FormTemplate {
  /** شناسه */
  id: string;
  /** نام */
  name: string;
  /** توضیحات */
  description?: string;
  /** دسته‌بندی */
  category: string;
  /** تگ‌ها */
  tags: string[];
  /** تصویر پیش‌نمایش */
  thumbnail?: string;
  /** محتوای فرم */
  content: any;
  /** متادیتا */
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    popularity: number;
  };
}

/**
 * گزینه‌های صفحه‌بندی
 */
export interface PaginationOptions {
  /** شماره صفحه */
  page?: number;
  /** تعداد در صفحه */
  limit?: number;
}

/**
 * نتیجه صفحه‌بندی شده
 */
export interface PaginatedResult<T> {
  /** داده‌ها */
  data: T[];
  /** اطلاعات صفحه‌بندی */
  pagination: {
    /** صفحه فعلی */
    currentPage: number;
    /** تعداد کل صفحات */
    totalPages: number;
    /** تعداد کل آیتم‌ها */
    totalItems: number;
    /** تعداد آیتم در هر صفحه */
    itemsPerPage: number;
    /** آیا صفحه بعد وجود دارد */
    hasNextPage: boolean;
    /** آیا صفحه قبل وجود دارد */
    hasPreviousPage: boolean;
  };
}

/**
 * گزینه‌های مرتب‌سازی
 */
export interface SortOptions {
  /** فیلد مرتب‌سازی */
  field: string;
  /** جهت مرتب‌سازی */
  order: 'asc' | 'desc';
  /** جهت مرتب‌سازی (alias for Firebase) */
  direction: 'asc' | 'desc';
}

/**
 * گزینه‌های Export
 */
export interface ExportOptions {
  /** فرمت خروجی */
  format: 'json' | 'csv' | 'excel';
  /** شامل پاسخ‌ها */
  includeResponses?: boolean;
  /** شامل متادیتا */
  includeMetadata?: boolean;
}

/**
 * گزینه‌های Import
 */
export interface ImportOptions {
  /** فرمت ورودی */
  format: 'json' | 'csv' | 'excel';
  /** Overwrite موجود */
  overwrite?: boolean;
  /** Validation strict */
  strict?: boolean;
}

/**
 * نتیجه عملیات دسته‌ای
 */
export interface BatchResult {
  /** تعداد موفق */
  successful: number;
  /** تعداد ناموفق */
  failed: number;
  /** خطاها */
  errors: Array<{
    item: any;
    error: string;
  }>;
}

/**
 * آمار پایگاه داده
 */
export interface DatabaseStats {
  /** تعداد فرم‌ها */
  totalForms: number;
  /** تعداد پاسخ‌ها */
  totalResponses: number;
  /** فرم‌های فعال */
  activeForms: number;
  /** اندازه پایگاه */
  databaseSize: number;
  /** اطلاعات عملکرد */
  performance: {
    /** میانگین زمان query */
    averageQueryTime: number;
    /** تعداد query های امروز */
    todayQueries: number;
    /** تعداد خطاهای اخیر */
    recentErrors: number;
  };
}

/**
 * نتیجه بررسی سلامت
 */
export interface HealthCheckResult {
  /** وضعیت */
  status: 'healthy' | 'unhealthy' | 'degraded';
  /** زمان */
  timestamp: string;
  /** زمان پاسخ */
  responseTime: number;
  /** بررسی‌ها */
  checks: Array<{
    name: string;
    status: string;
    message: string;
  }>;
}

/**
 * انواع خطاهای اعتبارسنجی
 */
export type ValidationErrorType = 
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'min'
  | 'max'
  | 'email'
  | 'url'
  | 'tel'
  | 'fileType'
  | 'fileSize'
  | 'custom';

/**
 * قوانین اعتبارسنجی
 */
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  patternMessage?: string;
  fileTypes?: string[];
  maxFileSize?: number;
  customValidators?: CustomValidator[];
}

/**
 * اعتبارسنج سفارشی
 */
export interface CustomValidator {
  name: string;
  validator: (value: any, field: FormField, formData: Record<string, any>) => boolean | string;
  errorMessage: string;
}

/**
 * نتیجه اعتبارسنجی
 */
export interface ValidationResult {
  /** آیا معتبر است؟ */
  isValid: boolean;
  /** خطاها */
  errors: Array<{
    type: ValidationErrorType;
    message: string;
    field: string;
  }>;
  /** هشدارها */
  warnings?: Array<{
    type: string;
    message: string;
    field: string;
  }>;
}

/**
 * فیلد فرم
 */
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  validation: ValidationRules;
  conditions?: FieldCondition[];
  options?: FieldOption[];
  styling: FieldStyling;
  fieldSettings?: {
    rows?: number;
    maxRating?: number;
    min?: number;
    max?: number;
    step?: number;
  };
  metadata?: Record<string, any>;
}

/**
 * نوع فیلد
 */
export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'tel'
  | 'url'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'signature'
  | 'rating'
  | 'slider';

/**
 * گزینه‌های فیلد
 */
export interface FieldOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

/**
 * شرط نمایش فیلد
 */
export interface FieldCondition {
  dependsOn: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater' | 'less';
  value: any;
}

/**
 * استایل فیلد
 */
export interface FieldStyling {
  width?: string;
  height?: string;
  className?: string;
  customCSS?: string;
}

// =====================================================
// 🔧 انواع خطاهای Validation
// =====================================================

// Note: Form type will be imported where needed to avoid circular dependencies

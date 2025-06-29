// =====================================================
// 🔧 فایل: src/modules/form-builder/types/database.types.ts
// =====================================================

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
}

/**
 * نتیجه بررسی سلامت
 */
export interface HealthCheckResult {
  /** وضعیت */
  status: 'healthy' | 'unhealthy' | 'degraded';
  /** زمان */
  timestamp: string;
  /** بررسی‌ها */
  checks: Array<{
    name: string;
    status: string;
    message: string;
  }>;
}

// Import Form type
import { Form } from './form.types';

/**
 * DTO برای ایجاد فرم
 */
export interface CreateFormDto extends Omit<Form, 'id' | 'metadata' | 'createdAt' | 'updatedAt'> {
  // همه فیلدهای Form به جز موارد حذف شده
}

/**
 * DTO برای بروزرسانی فرم
 */
export interface UpdateFormDto extends Partial<Omit<Form, 'id' | 'createdAt'>> {
  // همه فیلدهای Form به صورت اختیاری به جز id و createdAt
}

// =====================================================
// 🔧 انواع خطاهای Validation
// =====================================================

export type ValidationErrorType = 
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'min'
  | 'max'
  | 'email'
  | 'url'
  | 'fileType'
  | 'fileSize'
  | 'custom';

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

// =====================================================
// 🔧 Re-export types from other files
// =====================================================

export type { Form } from './form.types';
export type { FormField, FieldType } from './field.types';
export type { FormResponse } from './response.types';
export type { FormTemplate } from './template.types';
export type { FieldOption, ValidationRules } from './field.types';
export type { FormSettings, FormStyling, FormMetadata } from './form.types';

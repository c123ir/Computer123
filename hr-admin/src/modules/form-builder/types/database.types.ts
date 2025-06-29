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
 * پاسخ فرم
 */
export interface FormResponse {
  /** شناسه */
  id: string;
  /** شناسه فرم */
  formId: string;
  /** پاسخ‌ها */
  answers: Record<string, any>;
  /** متادیتا */
  metadata: {
    submittedAt: string;
    duration?: number;
    status: 'completed' | 'draft';
    formVersion?: number;
  };
  /** تاریخ ایجاد */
  createdAt: string;
  /** تاریخ بروزرسانی */
  updatedAt: string;
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
  /** تعداد کل */
  total: number;
  /** شماره صفحه فعلی */
  page: number;
  /** تعداد کل صفحات */
  totalPages: number;
}

/**
 * گزینه‌های مرتب‌سازی
 */
export interface SortOptions {
  /** فیلد مرتب‌سازی */
  field: string;
  /** جهت مرتب‌سازی */
  order: 'asc' | 'desc';
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

// Forward declaration - Import های دقیق در انتها

/**
 * DTO برای ایجاد فرم (موقت بدون وابستگی به Form)
 */
export interface CreateFormDto {
  name: string;
  description?: string;
  fields: any[];
  settings: any;
  styling: any;
  status?: 'draft' | 'published' | 'archived' | 'paused';
  category?: string;
  tags?: string[];
}

/**
 * DTO برای بروزرسانی فرم (موقت بدون وابستگی به Form)
 */
export interface UpdateFormDto {
  name?: string;
  description?: string;
  fields?: any[];
  settings?: any;
  styling?: any;
  status?: 'draft' | 'published' | 'archived' | 'paused';
  category?: string;
  tags?: string[];
  metadata?: any;
  updatedAt?: string;
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

// Note: Form type will be imported where needed to avoid circular dependencies

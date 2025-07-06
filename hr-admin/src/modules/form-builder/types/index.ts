// =====================================================
// 🔧 فایل: src/modules/form-builder/types/index.ts
// =====================================================

// انواع فیلدهای موجود
export type FieldType = 
  | 'text'          // متن ساده
  | 'textarea'      // متن چندخطی
  | 'number'        // عدد
  | 'email'         // ایمیل
  | 'tel'           // شماره تلفن
  | 'url'           // آدرس وبسایت
  | 'select'        // انتخاب از لیست
  | 'radio'         // انتخاب یکی از چند
  | 'checkbox'      // چک باکس
  | 'date'          // تاریخ
  | 'time'          // زمان
  | 'datetime'      // تاریخ و زمان
  | 'file'          // آپلود فایل
  | 'signature'     // امضا
  | 'rating'        // امتیازدهی
  | 'slider'        // اسلایدر
  | 'panel';        // پنل

// گزینه‌های فیلد
export interface FieldOption {
  id: string;
  label: string;
  value: string;
  selected?: boolean;
  disabled?: boolean;
  description?: string;
  icon?: string;
}

// قوانین اعتبارسنجی
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  min?: number;
  max?: number;
  fileTypes?: string[];
  maxFileSize?: number;
  customValidators?: CustomValidator[];
}

// تنظیمات ظاهری فیلد
export interface FieldStyling {
  width: string;
  height?: string;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  customCSS?: string;
}

// شرایط نمایش فیلد
export interface FieldCondition {
  dependsOn: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater' | 'less';
  value: any;
  action: 'show' | 'hide' | 'require' | 'disable';
}

// تنظیمات پنل
export interface PanelSettings {
  title: string;
  columns: 1 | 2 | 3 | 4 | 5 | 6;
  icon?: string;
  collapsible: boolean;
  defaultCollapsed: boolean;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
  margin?: 'sm' | 'md' | 'lg';
  backgroundImage?: string;
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundOpacity?: number;
}

// تنظیمات خاص هر نوع فیلد
export interface FieldSettings {
  multiple?: boolean;
  maxRating?: number;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  searchable?: boolean;
  minDate?: string;
  maxDate?: string;
  panelSettings?: PanelSettings;
  [key: string]: any;
}

// اعتبارسنج سفارشی
export interface CustomValidator {
  id: string;
  name: string;
  validator: (value: any, field: FormField, formData: Record<string, any>) => boolean | string;
  errorMessage: string;
  priority?: number;
}

// فیلد فرم
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  description?: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  validation: ValidationRules;
  conditions?: FieldCondition[];
  options?: FieldOption[];
  styling: FieldStyling;
  fieldSettings?: FieldSettings;
  metadata?: Record<string, any>;
  parentId?: string;
  order: number;
}

// تنظیمات فرم
export interface FormSettings {
  submitButtonText: string;
  resetButtonText?: string;
  showResetButton: boolean;
  layout: 'vertical' | 'horizontal';
  spacing: 'sm' | 'md' | 'lg';
  theme: 'light' | 'dark';
  direction: 'rtl' | 'ltr';
  showProgressBar?: boolean;
  showFieldNumbers?: boolean;
  formWidth?: 'small' | 'medium' | 'large' | 'full';
  allowSaveDraft?: boolean;
}

// استایل فرم
export interface FormStyling {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number;
  padding?: 'sm' | 'md' | 'lg';
  margin?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  width?: string;
  maxWidth?: string;
  customCSS?: string;
}

// فرم
export interface Form {
  id: string;
  name: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  styling: FormStyling;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  version?: number;
  status?: 'draft' | 'published' | 'archived' | 'paused';
  category?: string;
  tags?: string[];
}

// DTO ایجاد فرم
export interface CreateFormDto {
  name: string;
  title: string;
  description?: string;
  fields?: FormField[];
  settings?: Partial<FormSettings>;
  styling?: Partial<FormStyling>;
  metadata?: Record<string, any>;
  status?: 'draft' | 'published' | 'archived' | 'paused';
  tags?: string[];
}

// DTO بروزرسانی فرم
export interface UpdateFormDto {
  name?: string;
  title?: string;
  description?: string;
  fields?: FormField[];
  settings?: Partial<FormSettings>;
  styling?: Partial<FormStyling>;
  metadata?: Record<string, any>;
  status?: 'draft' | 'published' | 'archived' | 'paused';
  tags?: string[];
}

// الگوی فرم
export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  styling: FormStyling;
  category?: string;
  tags?: string[];
}

// تنظیمات صفحه‌بندی
export interface PaginationOptions {
  page: number;
  limit: number;
}

// نتیجه صفحه‌بندی شده
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// گزینه‌های مرتب‌سازی
export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

// فیلترهای فرم
export interface FormFilters {
  search?: string;
  status?: 'draft' | 'published' | 'archived' | 'paused';
  category?: string;
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// آمار دیتابیس
export interface DatabaseStats {
  totalForms: number;
  totalFields: number;
  totalResponses: number;
  avgFieldsPerForm: number;
  avgResponsesPerForm: number;
  storage: {
    used: number;
    total: number;
    unit: 'MB' | 'GB';
  };
}

// گزینه‌های خروجی
export interface ExportOptions {
  format: 'json' | 'csv' | 'excel';
  includeMetadata?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// گزینه‌های ورودی
export interface ImportOptions {
  format: 'json' | 'csv' | 'excel';
  overwrite?: boolean;
  validateData?: boolean;
}

// نتیجه عملیات دسته‌ای
export interface BatchResult {
  success: boolean;
  total: number;
  processed: number;
  failed: number;
  errors?: Array<{
    item: any;
    error: string;
  }>;
}

// نتیجه اعتبارسنجی
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// خطای اعتبارسنجی
export interface ValidationError {
  field: string;
  type: ValidationErrorType;
  message: string;
}

// نوع خطای اعتبارسنجی
export type ValidationErrorType = 
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'min'
  | 'max'
  | 'fileType'
  | 'fileSize'
  | 'custom';

// نتیجه بررسی سلامت
export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  database: {
    status: 'connected' | 'disconnected';
    latency: number;
  };
  storage: {
    status: 'available' | 'unavailable';
    freeSpace: number;
  };
  cache: {
    status: 'active' | 'inactive';
    hitRate: number;
  };
  timestamp: Date;
}

// پاسخ API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// پاسخ صفحه‌بندی شده
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// پاسخ فرم
export interface FormResponse {
  data: Form[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
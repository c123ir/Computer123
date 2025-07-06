// =====================================================
// 🔧 فایل: src/modules/form-builder/types/index.ts
// =====================================================

// Database types
export type {
  DatabaseType,
  DatabaseConfig,
  ApiResponse,
  PaginatedResponse,
  FormFilters,
  PaginationOptions,
  PaginatedResult,
  SortOptions,
  ExportOptions,
  ImportOptions,
  BatchResult,
  DatabaseStats,
  HealthCheckResult,
  ValidationResult,
  ValidationErrorType
} from './database.types';

// Field types
export type {
  FormField,
  FieldType,
  FieldOption,
  FieldCondition,
  FieldStyling,
  ValidationRules,
  CustomValidator
} from './field.types';

// Form model
export type {
  Form,
  FormResponse,
  FormTemplate
} from './form.model';

// Form DTOs
export type {
  CreateFormDto,
  UpdateFormDto
} from './form.types';

// Re-export all types from field.types
export * from './field.types';

// Re-export all types from form.types
export * from './form.types';

// Re-export all types from database.types
export * from './database.types';

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
  allowSaveDraft?: boolean;
  showFieldNumbers?: boolean;
  formWidth?: 'small' | 'medium' | 'large' | 'full';
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
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  tags?: string[];
}

// DTO برای ایجاد فرم
export interface CreateFormDto {
  name: string;
  title: string;
  description?: string;
  fields?: FormField[];
  settings?: Partial<FormSettings>;
  styling?: Partial<FormStyling>;
  metadata?: Record<string, any>;
}

// DTO برای بروزرسانی فرم
export interface UpdateFormDto {
  name?: string;
  title?: string;
  description?: string;
  fields?: FormField[];
  settings?: Partial<FormSettings>;
  styling?: Partial<FormStyling>;
  metadata?: Record<string, any>;
  status?: 'draft' | 'published' | 'archived';
}

// انواع پایگاه داده
export type DatabaseType = 'postgresql' | 'firebase';

// تنظیمات پایگاه داده
export interface DatabaseConfig {
  type: DatabaseType;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  apiKey?: string;
  projectId?: string;
}

// فیلترهای جستجوی فرم
export interface FormFilters {
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// پاسخ API فرم
export interface FormResponse {
  data: Form[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
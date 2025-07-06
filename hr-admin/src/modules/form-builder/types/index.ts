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

export * from './field.types';
export * from './form.types';
export * from './form.model';

// نوع فیلدهای موجود
export type FieldType = 
  | 'panel'
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
  | 'file'
  | 'signature'
  | 'rating'
  | 'slider';

// تنظیمات اعتبارسنجی
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  email?: boolean;
  url?: boolean;
  tel?: boolean;
  customMessage?: string;
}

// تنظیمات ظاهری
export interface FieldStyling {
  width?: 'full' | '1/2' | '1/3' | '1/4';
  labelPosition?: 'top' | 'left' | 'right';
  labelWidth?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  hidden?: boolean;
}

// تنظیمات پنل
export interface PanelSettings {
  title: string;
  columns: 1 | 2 | 3 | 4;
  collapsible: boolean;
  defaultCollapsed: boolean;
  padding: 'sm' | 'md' | 'lg';
  margin: 'sm' | 'md' | 'lg';
  shadow: 'none' | 'sm' | 'md' | 'lg';
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
  backgroundOpacity: number;
}

// تنظیمات فیلد
export interface FieldSettings {
  panelSettings?: PanelSettings;
  validation?: ValidationRules;
  styling?: FieldStyling;
  options?: FieldOption[];
  defaultValue?: any;
  placeholder?: string;
  description?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

// گزینه‌های فیلدهای انتخابی
export interface FieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// فیلد فرم
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  parentId?: string;
  order: number;
  required?: boolean;
  description?: string;
  fieldSettings?: FieldSettings;
}

// فرم
export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings?: {
    submitButtonText?: string;
    resetButtonText?: string;
    showResetButton?: boolean;
    layout?: 'vertical' | 'horizontal';
    spacing?: 'sm' | 'md' | 'lg';
  };
  createdAt: string;
  updatedAt: string;
}
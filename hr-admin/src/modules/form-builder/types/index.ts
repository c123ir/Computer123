// =====================================================
// 🔧 فایل: src/modules/form-builder/types/index.ts
// =====================================================

// Form related types
export type { 
  Form, 
  FormSettings, 
  FormStyling, 
  FormMetadata,
  FormResponse,
  FormTemplate
} from './form.types';

// Field types
export type { 
  FormField, 
  FieldType, 
  FieldOption, 
  ValidationRules, 
  FieldStyling,
  CustomValidator
} from './field.types';

// Database types - specific exports to avoid conflicts
export type { 
  DatabaseType, 
  DatabaseConfig, 
  ApiResponse, 
  PaginatedResponse, 
  FormFilters, 
  PaginationOptions, 
  PaginatedResult, 
  DatabaseStats, 
  HealthCheckResult, 
  CreateFormDto, 
  UpdateFormDto, 
  ValidationResult, 
  ValidationErrorType,
  SortOptions,
  ExportOptions,
  ImportOptions,
  BatchResult
} from './database.types';

export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  defaultValue?: any;
  disabled: boolean;
  readonly: boolean;
  validation: Record<string, any>;
  styling: {
    width?: string;
    [key: string]: any;
  };
  options?: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  fieldSettings?: Record<string, any>;
}

export interface FormSettings {
  direction: 'rtl' | 'ltr';
  theme: 'light' | 'dark';
  submitButtonText: string;
  showProgressBar?: boolean;
  allowSaveDraft?: boolean;
  showFieldNumbers?: boolean;
  formWidth?: 'small' | 'medium' | 'large' | 'full';
  redirectAfterSubmit?: string;
  thankYouMessage?: string;
  multiStep?: {
    enabled: boolean;
    showStepIndicator: boolean;
    allowBackNavigation: boolean;
    steps: {
      id: string;
      title: string;
      fieldIds: string[];
    }[];
  };
}

export interface FormStyling {
  theme: 'default' | 'modern' | 'dark' | 'minimal';
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  fontFamily: string;
  fontSize: number;
  borderRadius: number;
  spacing: 'compact' | 'normal' | 'relaxed';
}

export interface FormMetadata {
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  status: 'draft' | 'published' | 'archived' | 'paused';
  version: number;
  tags?: string[];
  category?: string;
  stats?: {
    views: number;
    submissions: number;
    averageCompletionTime: number;
    conversionRate: number;
  };
}

export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  styling: FormStyling;
  metadata: FormMetadata;
  status: 'draft' | 'published' | 'archived' | 'paused';
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateFormDto {
  name: string;
  description?: string;
  fields?: FormField[];
  settings?: Partial<FormSettings>;
  styling?: Partial<FormStyling>;
  metadata?: Partial<FormMetadata>;
  category?: string;
  tags?: string[];
}

export interface UpdateFormDto {
  name?: string;
  description?: string;
  fields?: FormField[];
  settings?: Partial<FormSettings>;
  styling?: Partial<FormStyling>;
  metadata?: Partial<FormMetadata>;
  category?: string;
  tags?: string[];
}
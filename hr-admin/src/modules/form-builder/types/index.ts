// =====================================================
// 🔧 فایل: src/modules/form-builder/types/index.ts
// =====================================================

// Field types
export * from './field.types';

// Form types
export * from './form.types';

// Database types
export type {
  DatabaseType,
  DatabaseConfig,
  ApiResponse,
  PaginatedResponse,
  FormFilters,
  FormTemplate,
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
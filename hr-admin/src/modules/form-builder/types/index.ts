// src/modules/form-builder/types/index.ts

// Field Types
export type FieldType = 
  | 'text' | 'textarea' | 'number' | 'email' | 'url' | 'tel' | 'password'
  | 'select' | 'radio' | 'checkbox' | 'multiselect'
  | 'date' | 'time' | 'datetime' | 'daterange'
  | 'file' | 'signature' | 'rating' | 'slider'
  | 'section' | 'html' | 'spacer';

// Validation Rules
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  email?: boolean;
  url?: boolean;
  phoneNumber?: boolean;
  nationalId?: boolean;
  bankCard?: boolean;
  postalCode?: boolean;
  customRegex?: string;
  customMessage?: string;
  fileTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
}

// Field Option for select/radio/checkbox
export interface FieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Field Styling
export interface FieldStyling {
  width?: string;
  height?: string;
  className?: string;
  style?: Record<string, any>;
  labelPosition?: 'top' | 'left' | 'right' | 'floating';
  showBorder?: boolean;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
}

// Form Field Definition
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  validation: ValidationRules;
  styling: FieldStyling;
  options?: FieldOption[];
  defaultValue?: any;
  disabled?: boolean;
  readonly?: boolean;
  fieldSettings?: {
    rows?: number;
    maxRating?: number;
    multiple?: boolean;
    min?: number;
    max?: number;
    step?: number;
    [key: string]: any;
  };
  conditions?: Array<{
    dependsOn: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
    value: any;
  }>;
}

// Form Settings
export interface FormSettings {
  submitButtonText: string;
  showProgressBar: boolean;
  allowSaveDraft: boolean;
  redirectAfterSubmit?: string;
  multiStep?: {
    enabled: boolean;
    showProgress: boolean;
    allowPreviousStep: boolean;
    validateOnStep: boolean;
  };
  notifications?: {
    email?: {
      enabled: boolean;
      recipients: string[];
      template?: string;
    };
    webhook?: {
      enabled: boolean;
      url: string;
      method: 'POST' | 'PUT';
    };
  };
  showFieldNumbers?: boolean;
  formWidth?: 'small' | 'medium' | 'large' | 'full';
  autoSave?: boolean;
  captcha?: {
    enabled: boolean;
    type: 'recaptcha' | 'hcaptcha';
  };
}

// Form Styling
export interface FormStyling {
  theme: string;
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  fontFamily?: string;
  fontSize?: number;
  borderRadius?: number;
  spacing?: 'compact' | 'normal' | 'relaxed';
  customCSS?: string;
}

// Form Metadata
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
    totalViews: number;
    totalSubmissions: number;
    completionRate: number;
    averageTime?: number;
  };
}

// Form Definition
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

// Form Response
export interface FormResponse {
  id: string;
  formId: string;
  answers: Record<string, any>;
  submitterInfo?: {
    name?: string;
    email?: string;
    ip?: string;
    userAgent?: string;
  };
  metadata: {
    submittedAt: string;
    duration?: number;
    status: 'completed' | 'draft' | 'partial';
    formVersion: number;
  };
}

// Form Template
export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  formData: Omit<Form, 'id' | 'metadata'>;
  preview?: string;
  tags: string[];
  popularity: number;
  isActive: boolean;
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query & Filter Types
export interface FormFilters {
  search?: string;
  status?: string;
  category?: string;
  createdBy?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'responses';
  sortOrder?: 'asc' | 'desc';
}

export interface QueryFilters {
  [key: string]: any;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field?: string;
  message: string;
  type: ValidationErrorType;
}

export type ValidationErrorType = 
  | 'required' | 'minLength' | 'maxLength' | 'pattern' 
  | 'email' | 'url' | 'number' | 'custom';

export interface CustomValidator {
  name: string;
  validator: (value: any, field: FormField, allData?: Record<string, any>) => ValidationResult;
  message?: string;
}

// Database Types
export type DatabaseType = 'firebase' | 'postgresql' | 'mongodb' | 'mysql' | 'localStorage' | 'memory';

export interface DatabaseConfig {
  type: DatabaseType;
  connectionString?: string;
  options?: Record<string, any>;
}

export interface DatabaseStats {
  totalForms: number;
  totalResponses: number;
  activeForms: number;
  databaseSize: number;
  lastBackup?: string;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'excel' | 'pdf';
  includeMetadata?: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface ImportOptions {
  format: 'json' | 'csv' | 'excel';
  overwrite?: boolean;
  validation?: boolean;
}

export interface BatchResult {
  success: number;
  failed: number;
  errors: string[];
}

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  details: Record<string, any>;
}

// DTO Types
export type CreateFormDto = Omit<Form, 'id' | 'createdAt' | 'updatedAt' | 'metadata'> & {
  metadata?: Partial<FormMetadata>;
};

export type UpdateFormDto = Partial<Omit<Form, 'id' | 'createdAt' | 'updatedAt'>> & {
  metadata?: Partial<FormMetadata>;
};
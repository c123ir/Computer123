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
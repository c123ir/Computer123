// =====================================================
// 🔧 فایل: src/modules/form-builder/types/index.ts
// =====================================================

import { FormField } from './field.types';

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

// Form types
export type {
  CreateFormDto,
  UpdateFormDto
} from './form.types';

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

export type Form = {
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
};

export type FormModel = Form;

export type FormModelWithoutId = Omit<Form, 'id'>;

export type FormModelWithoutFields = Omit<Form, 'fields'>;

export type FormModelWithoutSettings = Omit<Form, 'settings'>;

export type FormModelWithoutStyling = Omit<Form, 'styling'>;

export type FormModelWithoutMetadata = Omit<Form, 'metadata'>;

export type FormModelWithoutStatus = Omit<Form, 'status'>;

export type FormModelWithoutCategory = Omit<Form, 'category'>;

export type FormModelWithoutTags = Omit<Form, 'tags'>;

export type FormModelWithoutCreatedAt = Omit<Form, 'createdAt'>;

export type FormModelWithoutUpdatedAt = Omit<Form, 'updatedAt'>;

export type FormModelWithoutIdAndFields = Omit<Form, 'id' | 'fields'>;

export type FormModelWithoutIdAndSettings = Omit<Form, 'id' | 'settings'>;

export type FormModelWithoutIdAndStyling = Omit<Form, 'id' | 'styling'>;

export type FormModelWithoutIdAndMetadata = Omit<Form, 'id' | 'metadata'>;

export type FormModelWithoutIdAndStatus = Omit<Form, 'id' | 'status'>;

export type FormModelWithoutIdAndCategory = Omit<Form, 'id' | 'category'>;

export type FormModelWithoutIdAndTags = Omit<Form, 'id' | 'tags'>;

export type FormModelWithoutIdAndCreatedAt = Omit<Form, 'id' | 'createdAt'>;

export type FormModelWithoutIdAndUpdatedAt = Omit<Form, 'id' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettings = Omit<Form, 'id' | 'fields' | 'settings'>;

export type FormModelWithoutIdAndFieldsAndStyling = Omit<Form, 'id' | 'fields' | 'styling'>;

export type FormModelWithoutIdAndFieldsAndMetadata = Omit<Form, 'id' | 'fields' | 'metadata'>;

export type FormModelWithoutIdAndFieldsAndStatus = Omit<Form, 'id' | 'fields' | 'status'>;

export type FormModelWithoutIdAndFieldsAndCategory = Omit<Form, 'id' | 'fields' | 'category'>;

export type FormModelWithoutIdAndFieldsAndTags = Omit<Form, 'id' | 'fields' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatus = Omit<Form, 'id' | 'fields' | 'settings' | 'status'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndCategory = Omit<Form, 'id' | 'fields' | 'settings' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategory = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatus = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategory = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatus = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategory = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatus = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategory = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatus = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategory = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatus = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategory = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatus = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategory = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatus = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategory = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatus = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategory = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatus = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategory = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatus = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategory = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatus = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategory = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatus = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategory = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTags = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt'>;

export type FormModelWithoutIdAndFieldsAndSettingsAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndCreatedAtAndUpdatedAtAndStatusAndCategoryAndTagsAndUpdatedAt = Omit<Form, 'id' | 'fields' | 'settings' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'tags' | 'updatedAt'>;
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
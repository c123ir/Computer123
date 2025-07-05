import { FormStatus } from '@prisma/client';

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  defaultValue?: any;
  disabled?: boolean;
  readonly?: boolean;
  validation: Record<string, any>;
  styling: Record<string, any>;
  options?: Array<{
    id: string;
    label: string;
    value: string;
    selected?: boolean;
    disabled?: boolean;
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
    steps: Array<{
      id: string;
      title: string;
      fieldIds: string[];
    }>;
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
  status: FormStatus;
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
  status: FormStatus;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  answers: Record<string, any>;
  submitterInfo?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
    userId?: string;
    email?: string;
    name?: string;
  };
  metadata: {
    submittedAt: string;
    duration?: number;
    status: 'draft' | 'completed' | 'partial';
    formVersion: number;
  };
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview?: string;
  tags: string[];
  popularity: number;
  isActive: boolean;
  form: Omit<Form, 'id' | 'metadata' | 'createdAt' | 'updatedAt'>;
}

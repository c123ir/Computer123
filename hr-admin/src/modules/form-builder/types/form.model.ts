import { FormField } from './field.types';
import { FormSettings, FormStyling, FormMetadata } from './form.types';

/**
 * فرم
 */
export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  styling: FormStyling;
  metadata: FormMetadata;
  category?: string;
  tags?: string[];
}

/**
 * پاسخ فرم
 */
export interface FormResponse {
  id: string;
  formId: string;
  answers: Record<string, any>;
  metadata: {
    createdAt: string;
    createdBy: string;
    ip?: string;
    userAgent?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

/**
 * قالب فرم
 */
export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  content: {
    fields: FormField[];
    settings: Form['settings'];
    styling: Form['styling'];
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    popularity: number;
  };
} 
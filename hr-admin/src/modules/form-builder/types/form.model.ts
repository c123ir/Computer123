import { FormField } from './field.types';

/**
 * فرم
 */
export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  settings: {
    submitButtonText?: string;
    successMessage?: string;
    errorMessage?: string;
    redirectUrl?: string;
    showProgressBar?: boolean;
    allowSave?: boolean;
    allowPrint?: boolean;
    allowShare?: boolean;
    requireLogin?: boolean;
    limitSubmissions?: number;
    expiryDate?: string;
    notificationEmails?: string[];
  };
  styling: {
    theme?: string;
    primaryColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    customCSS?: string;
  };
  metadata: {
    status: 'draft' | 'published' | 'archived' | 'paused';
    version: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy?: string;
  };
  category?: string;
  tags?: string[];
} 
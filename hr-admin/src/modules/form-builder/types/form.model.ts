import { FormField } from './field.types';
import { FormSettings, FormStyling, FormMetadata } from './form.types';

/**
 * فرم
 */
export interface Form {
  /** شناسه یکتا */
  id: string;
  /** نام فرم */
  name: string;
  /** توضیح */
  description?: string;
  /** فیلدهای فرم */
  fields: FormField[];
  /** تنظیمات */
  settings: FormSettings;
  /** ظاهر */
  styling: FormStyling;
  /** متادیتا */
  metadata: FormMetadata;
  /** وضعیت */
  status: 'draft' | 'published' | 'archived' | 'paused';
  /** دسته‌بندی */
  category?: string;
  /** برچسب‌ها */
  tags?: string[];
  /** تاریخ ایجاد */
  createdAt: string;
  /** تاریخ بروزرسانی */
  updatedAt: string;
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
    settings: FormSettings;
    styling: FormStyling;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    popularity: number;
  };
} 
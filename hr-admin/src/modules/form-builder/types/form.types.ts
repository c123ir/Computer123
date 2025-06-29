// =====================================================
// 🔧 فایل: src/modules/form-builder/types/form.types.ts
// =====================================================

import type { FormField } from './field.types';

/**
 * تنظیمات فرم
 */
export interface FormSettings {
  /** متن دکمه ارسال */
  submitButtonText: string;
  /** نمایش progress bar */
  showProgressBar: boolean;
  /** امکان ذخیره draft */
  allowSaveDraft: boolean;
  /** نمایش شماره فیلدها */
  showFieldNumbers: boolean;
  /** عرض فرم */
  formWidth: 'small' | 'medium' | 'large' | 'full';
  /** redirect پس از ارسال */
  redirectAfterSubmit?: string;
  /** پیام تشکر */
  thankYouMessage?: string;
  /** تنظیمات چندمرحله‌ای */
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

/**
 * تنظیمات ظاهری فرم
 */
export interface FormStyling {
  /** تم کلی */
  theme: 'default' | 'modern' | 'dark' | 'minimal';
  /** رنگ پس‌زمینه */
  backgroundColor: string;
  /** رنگ متن */
  textColor: string;
  /** رنگ اصلی */
  primaryColor: string;
  /** فونت */
  fontFamily: string;
  /** اندازه فونت */
  fontSize: number;
  /** شعاع گوشه‌ها */
  borderRadius: number;
  /** فاصله‌گذاری */
  spacing: 'compact' | 'normal' | 'relaxed';
}

/**
 * متادیتای فرم
 */
export interface FormMetadata {
  /** ایجاد کننده */
  createdBy: string;
  /** تاریخ ایجاد */
  createdAt: string;
  /** آخرین ویرایش */
  updatedAt: string;
  /** ویرایش کننده */
  updatedBy?: string;
  /** وضعیت فرم */
  status: 'draft' | 'published' | 'archived' | 'paused';
  /** نسخه */
  version: number;
  /** برچسب‌ها */
  tags?: string[];
  /** دسته‌بندی */
  category?: string;
  /** آمار */
  stats?: {
    views: number;
    submissions: number;
    averageCompletionTime: number;
    conversionRate: number;
  };
}

/**
 * فرم کامل
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
  /** شناسه یکتا */
  id: string;
  /** شناسه فرم */
  formId: string;
  /** پاسخ‌ها */
  answers: Record<string, any>;
  /** اطلاعات ارسال کننده */
  submitterInfo?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
    userId?: string;
    email?: string;
    name?: string;
  };
  /** متادیتا */
  metadata: {
    /** تاریخ ارسال */
    submittedAt: string;
    /** مدت زمان پر کردن */
    duration?: number;
    /** وضعیت */
    status: 'draft' | 'completed' | 'partial';
    /** نسخه فرم */
    formVersion: number;
  };
}

/**
 * قالب فرم
 */
export interface FormTemplate {
  /** شناسه یکتا */
  id: string;
  /** نام قالب */
  name: string;
  /** توضیح */
  description: string;
  /** دسته‌بندی */
  category: string;
  /** پیش‌نمایش */
  preview?: string;
  /** برچسب‌ها */
  tags: string[];
  /** میزان محبوبیت */
  popularity: number;
  /** فعال */
  isActive: boolean;
  /** داده‌های فرم */
  form: Omit<Form, 'id' | 'metadata' | 'createdAt' | 'updatedAt'>;
}

// =====================================================
// 🔧 فایل: src/modules/form-builder/constants/defaults.ts
// =====================================================

import { FormSettings, FormStyling } from '../types/form.types';

/**
 * تنظیمات پیش‌فرض فرم
 */
export const DEFAULT_FORM_SETTINGS: FormSettings = {
  direction: 'rtl',
  theme: 'light',
  submitButtonText: 'ارسال',
  showProgressBar: false,
  allowSaveDraft: true,
  showFieldNumbers: false,
  formWidth: 'medium'
};

/**
 * تنظیمات ظاهری پیش‌فرض فرم
 */
export const DEFAULT_FORM_STYLING: FormStyling = {
  theme: 'default',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  primaryColor: '#3b82f6',
  fontFamily: 'Vazirmatn',
  fontSize: 14,
  borderRadius: 8,
  spacing: 'normal'
}; 
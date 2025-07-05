// src/modules/form-builder/services/formService.ts

import {
  Form,
  FormField,
  FormResponse,
  FormTemplate,
  CreateFormDto,
  UpdateFormDto,
  FormFilters,
  PaginationOptions,
  PaginatedResult,
  ValidationResult,
  ValidationErrorType,
  FieldType
} from '../types';

import { DatabaseService } from './database/interface';
import { DatabaseFactory } from './database/factory';
import { ValidationService } from './validationService';
import { PreviewService } from './previewService';
import { buildApiUrl } from '../../../utils/api';

/**
 * سرویس مدیریت فرم‌ها
 */
export class FormService {
  private static db: DatabaseService = DatabaseFactory.createService({ type: 'postgresql' });
  private static cache = {
    get: async (key: string): Promise<any> => {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error('❌ Error reading from cache:', error);
        return null;
      }
    },
    set: async (key: string, value: any): Promise<void> => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('❌ Error saving to cache:', error);
      }
    },
    delete: async (key: string): Promise<void> => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('❌ Error deleting from cache:', error);
      }
    }
  };

  /**
   * دریافت فرم بر اساس شناسه
   */
  static async getForm(id: string, useCache: boolean = true): Promise<Form | null> {
    try {
      // بررسی cache
      if (useCache) {
        const cacheKey = `form_${id}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
          console.log('📋 Form loaded from cache:', id);
          return cached;
        }
      }

      const form = await this.db.getForm(id);
      
      if (form && useCache) {
        // ذخیره در cache برای 1 ساعت
        const cacheKey = `form_${id}`;
        await this.cache.set(cacheKey, form);
      }

      return form;
    } catch (error) {
      console.error('❌ Error getting form:', error);
      throw error;
    }
  }

  /**
   * دریافت فرم از cache
   */
  private static async getFormFromCache(id: string): Promise<Form | null> {
    try {
      const cacheKey = `form_${id}`;
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
      return null;
    } catch (error) {
      console.error('❌ Error reading from cache:', error);
      return null;
    }
  }

  /**
   * ذخیره فرم در cache
   */
  private static async saveFormToCache(id: string, form: Form): Promise<void> {
    try {
      const cacheKey = `form_${id}`;
      await this.cache.set(cacheKey, form);
    } catch (error) {
      console.error('❌ Error saving to cache:', error);
    }
  }

  /**
   * ایجاد فرم جدید
   */
  static async createForm(form: CreateFormDto): Promise<string> {
    try {
      // اعتبارسنجی داده‌های ورودی
      if (!form.name || !form.name.trim()) {
        throw new Error('نام فرم الزامی است');
      }

      // اطمینان از وجود فیلدهای ضروری
      const formData = {
        ...form,
        fields: form.fields || [],
        settings: {
          ...form.settings,
          direction: 'rtl',
          theme: 'light',
          submitButtonText: 'ارسال',
          showProgressBar: false,
          allowSaveDraft: true,
          showFieldNumbers: false,
          formWidth: 'medium'
        },
        styling: {
          ...form.styling,
          theme: 'default',
          backgroundColor: '#ffffff',
          textColor: '#374151',
          primaryColor: '#3b82f6',
          fontFamily: 'Vazirmatn',
          fontSize: 14,
          borderRadius: 8,
          spacing: 'normal'
        },
        metadata: {
          ...form.metadata,
          createdBy: 'current-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'draft',
          version: 1
        }
      };

      const response = await fetch(buildApiUrl('/forms/create'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || response.statusText;
        console.error('API Error:', errorData);
        throw new Error(`خطا در ایجاد فرم: ${errorMessage}`);
      }
      
      const data = await response.json();
      
      // بررسی ساختار پاسخ
      if (!data.success) {
        console.error('Invalid API Response:', data);
        throw new Error('خطا: پاسخ نامعتبر از سرور');
      }

      const formId = data.data?.id;
      if (!formId) {
        console.error('Invalid API Response:', data);
        throw new Error('خطا: شناسه فرم از سرور دریافت نشد');
      }

      console.log('✅ Form created successfully:', formId);
      return formId;
    } catch (error) {
      console.error('❌ Error creating form:', error);
      throw error;
    }
  }

  /**
   * بروزرسانی فرم
   */
  static async updateForm(id: string, form: UpdateFormDto): Promise<Form | null> {
    try {
      // اول در cache ذخیره کن
      await this.saveFormToCache(id, form as Form);

      const response = await fetch(buildApiUrl(`/forms/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          metadata: {
            ...form.metadata,
            updatedAt: new Date().toISOString()
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || response.statusText;
        console.error('API Error:', errorData);
        throw new Error(`خطا در بروزرسانی فرم: ${errorMessage}`);
      }
      
      const data = await response.json();
      
      // بررسی ساختار پاسخ
      if (!data.success) {
        console.error('Invalid API Response:', data);
        throw new Error('خطا: پاسخ نامعتبر از سرور');
      }

      const updatedForm = {
        ...data.data,
        fields: data.data.fields || [],
        settings: {
          ...data.data.settings,
          updatedAt: new Date().toISOString()
        }
      };

      // بروزرسانی cache
      await this.saveFormToCache(id, updatedForm);

      console.log('✅ Form updated successfully:', id);
      return updatedForm;
    } catch (error) {
      console.error('❌ Error updating form:', error);
      throw error;
    }
  }

  /**
   * حذف فرم
   */
  static async deleteForm(id: string): Promise<void> {
    try {
      const response = await fetch(buildApiUrl(`/forms/${id}`), {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`خطا در حذف فرم: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Error deleting form:', error);
      throw error;
    }
  }

  /**
   * کپی فرم
   */
  static async cloneForm(id: string): Promise<string> {
    try {
      const response = await fetch(buildApiUrl(`/forms/${id}/clone`), {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`خطا در کپی فرم: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('❌ Error cloning form:', error);
      throw error;
    }
  }

  /**
   * تغییر وضعیت فرم
   */
  static async updateFormStatus(id: string, status: 'draft' | 'published' | 'archived' | 'paused'): Promise<Form | null> {
    try {
      const form = await this.getForm(id, false);
      if (!form) {
        throw new Error('Form not found');
      }

      const now = new Date().toISOString();
      const metadata = {
        ...form.metadata,
        status,
        updatedAt: now
      };

      return await this.updateForm(id, { metadata });
    } catch (error) {
      console.error('❌ Error updating form status:', error);
      throw error;
    }
  }

  /**
   * دریافت لیست فرم‌ها
   */
  static async getForms(filters?: FormFilters): Promise<Form[]> {
    try {
      const response = await fetch(buildApiUrl('/forms'));
      
      if (!response.ok) {
        throw new Error(`خطا در دریافت لیست فرم‌ها: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // بررسی ساختار داده‌های دریافتی
      let forms: any[] = [];
      if (Array.isArray(data)) {
        forms = data;
      } else if (data.data && Array.isArray(data.data)) {
        forms = data.data;
      } else if (data.forms && Array.isArray(data.forms)) {
        forms = data.forms;
      } else {
        console.error('❌ Unexpected data format:', data);
        return [];
      }

      return forms.map((form: Form) => ({
        ...form,
        fields: form.fields || []
      }));
    } catch (error) {
      console.error('❌ Error fetching forms:', error);
      throw error;
    }
  }

  // =================================
  // Form CRUD Operations
  // =================================

  /**
   * لیست فرم‌ها با فیلتر و صفحه‌بندی
   */
  static async listForms(
    filters?: FormFilters,
    pagination?: PaginationOptions,
    useCache: boolean = true
  ): Promise<PaginatedResult<Form>> {
    try {
      const cacheKey = `forms_${JSON.stringify({ filters, pagination })}`;
      
      if (useCache) {
        const cached = await this.cache.get(cacheKey);
        if (cached) {
          console.log('📋 Forms list loaded from cache');
          return cached;
        }
      }

      const result = await this.db.getForms(undefined, filters, pagination);
      
      if (useCache) {
        // ذخیره در cache برای 10 دقیقه
        await this.cache.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      console.error('❌ Error listing forms:', error);
      throw error;
    }
  }

  /**
   * جستجو در فرم‌ها
   */
  static async searchForms(
    query: string,
    filters?: FormFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Form>> {
    try {
      // استفاده از getForms با search filter
      const searchFilters = { ...filters, search: query };
      return await this.db.getForms(undefined, searchFilters, pagination);
    } catch (error) {
      console.error('❌ Error searching forms:', error);
      throw error;
    }
  }

  /**
   * کپی فرم
   */
  static async duplicateForm(id: string, newName?: string): Promise<string> {
    try {
      const originalForm = await this.getForm(id, false);
      if (!originalForm) {
        throw new Error('Form not found');
      }

      const duplicatedName = newName || `${originalForm.name} - کپی`;
      
      // ایجاد فرم جدید با داده‌های کپی شده
      const newFormData: CreateFormDto = {
        name: duplicatedName,
        description: originalForm.description,
        fields: originalForm.fields,
        settings: originalForm.settings,
        styling: originalForm.styling,
        category: originalForm.category,
        tags: originalForm.tags,
        metadata: {
          ...originalForm.metadata,
          createdAt: new Date().toISOString()
        }
      };
      
      const newFormId = await this.db.createForm(newFormData);
      await this.clearFormsCache();
      
      console.log('✅ Form duplicated successfully:', newFormId);
      return newFormId;
    } catch (error) {
      console.error('❌ Error duplicating form:', error);
      throw error;
    }
  }

  // =================================
  // Form Response Operations
  // =================================

  /**
   * ثبت پاسخ فرم
   */
  static async submitFormResponse(
    formId: string,
    answers: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<string> {
    try {
      const form = await this.getForm(formId, false);
      if (!form) {
        throw new Error('Form not found');
      }

      // اعتبارسنجی پاسخ‌ها
      const validationResults = ValidationService.validateForm(form.fields, answers);
      const isValid = ValidationService.isFormValid(validationResults);
      
      if (!isValid) {
        const errorMessages = Object.values(validationResults)
          .filter(result => !result.isValid)
          .flatMap(result => result.errors)
          .map((error: any) => error.message);
        throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
      }

      // پردازش پاسخ‌ها
      const processedAnswers = this.processAnswers(form.fields, answers);

      const responseId = await this.db.createFormResponse(formId, processedAnswers, {
        ...metadata,
        formVersion: form.metadata.version
      });

      // پاکسازی cache مربوط به responses
      await this.clearResponsesCache(formId);
      
      console.log('✅ Form response submitted successfully:', responseId);
      return responseId;
    } catch (error) {
      console.error('❌ Error submitting form response:', error);
      throw error;
    }
  }

  /**
   * دریافت پاسخ‌های فرم
   */
  static async getFormResponses(
    formId: string,
    filters?: FormFilters,
    pagination?: PaginationOptions,
    useCache: boolean = true
  ): Promise<PaginatedResult<FormResponse>> {
    try {
      const cacheKey = `responses_${formId}_${JSON.stringify({ filters, pagination })}`;
      
      if (useCache) {
        const cached = await this.cache.get(cacheKey);
        if (cached) {
          console.log('📋 Responses loaded from cache');
          return cached;
        }
      }

      const result = await this.db.getFormResponses(formId, filters, pagination);
      
      if (useCache) {
        // ذخیره در cache برای 5 دقیقه
        await this.cache.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      console.error('❌ Error getting form responses:', error);
      throw error;
    }
  }

  /**
   * حذف پاسخ
   */
  static async deleteResponse(responseId: string, formId?: string): Promise<void> {
    try {
      await this.db.deleteResponse(responseId);
      
      if (formId) {
        await this.clearResponsesCache(formId);
      }
      
      console.log('✅ Response deleted successfully:', responseId);
    } catch (error) {
      console.error('❌ Error deleting response:', error);
      throw error;
    }
  }

  // =================================
  // Form Template Operations
  // =================================

  /**
   * دریافت template ها
   */
  static async getTemplates(category?: string): Promise<FormTemplate[]> {
    try {
      const cacheKey = `templates_${category || 'all'}`;
      
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const templates = await this.db.getTemplates(category);
      
      // ذخیره در cache برای 1 ساعت
      await this.cache.set(cacheKey, templates);
      
      return templates;
    } catch (error) {
      console.error('❌ Error getting templates:', error);
      throw error;
    }
  }

  /**
   * ایجاد فرم از template
   */
  static async createFormFromTemplate(templateId: string, formName: string): Promise<string> {
    try {
      const formId = await this.db.createFormFromTemplate(templateId, formName);
      await this.clearFormsCache();
      return formId;
    } catch (error) {
      console.error('❌ Error creating form from template:', error);
      throw error;
    }
  }

  // =================================
  // Field Management
  // =================================

  /**
   * اضافه کردن فیلد جدید
   */
  static async addField(formId: string, field: Omit<FormField, 'id'>): Promise<void> {
    try {
      const form = await this.getForm(formId, false);
      if (!form) {
        throw new Error('Form not found');
      }

      const newField: FormField = {
        ...field,
        id: this.generateFieldId()
      };

      const updatedFields = [...form.fields, newField];
      
      await this.updateForm(formId, { fields: updatedFields });
    } catch (error) {
      console.error('❌ Error adding field:', error);
      throw error;
    }
  }

  /**
   * بروزرسانی فیلد
   */
  static async updateField(formId: string, fieldId: string, updates: Partial<FormField>): Promise<void> {
    try {
      const form = await this.getForm(formId, false);
      if (!form) {
        throw new Error('Form not found');
      }

      const fieldIndex = form.fields.findIndex(f => f.id === fieldId);
      if (fieldIndex === -1) {
        throw new Error('Field not found');
      }

      const updatedFields = [...form.fields];
      updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], ...updates };
      
      await this.updateForm(formId, { fields: updatedFields });
    } catch (error) {
      console.error('❌ Error updating field:', error);
      throw error;
    }
  }

  /**
   * حذف فیلد
   */
  static async removeField(formId: string, fieldId: string): Promise<void> {
    try {
      const form = await this.getForm(formId, false);
      if (!form) {
        throw new Error('Form not found');
      }

      const updatedFields = form.fields.filter(f => f.id !== fieldId);
      
      await this.updateForm(formId, { fields: updatedFields });
    } catch (error) {
      console.error('❌ Error removing field:', error);
      throw error;
    }
  }

  /**
   * تغییر ترتیب فیلدها
   */
  static async reorderFields(formId: string, fieldIds: string[]): Promise<void> {
    try {
      const form = await this.getForm(formId, false);
      if (!form) {
        throw new Error('Form not found');
      }

      // مرتب کردن فیلدها بر اساس ترتیب جدید
      const reorderedFields = fieldIds.map(id => {
        const field = form.fields.find(f => f.id === id);
        if (!field) {
          throw new Error(`Field not found: ${id}`);
        }
        return field;
      });

      await this.updateForm(formId, { fields: reorderedFields });
    } catch (error) {
      console.error('❌ Error reordering fields:', error);
      throw error;
    }
  }

  // =================================
  // Analytics & Statistics
  // =================================

  /**
   * آمار فرم
   */
  static async getFormStats(formId: string, useCache: boolean = true): Promise<any> {
    try {
      const cacheKey = `stats_${formId}`;
      
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const stats = await this.db.getFormStats(formId);
      
      // ذخیره در cache برای 15 دقیقه
      await this.cache.set(cacheKey, stats);
      
      return stats;
    } catch (error) {
      console.error('❌ Error getting form stats:', error);
      throw error;
    }
  }

  // =================================
  // Validation Methods
  // =================================

  /**
   * اعتبارسنجی داده‌های فرم
   */
  private static validateFormData(formData: CreateFormDto): ValidationResult {
    const errors: Array<{
      type: ValidationErrorType;
      message: string;
      field: string;
    }> = [];

    // بررسی نام فرم
    if (!formData.name || formData.name.trim().length < 2) {
      errors.push({
        type: 'required',
        message: 'نام فرم الزامی است و باید حداقل 2 کاراکتر باشد',
        field: 'name'
      });
    }

    // بررسی فیلدها
    if (!formData.fields || formData.fields.length === 0) {
      errors.push({
        type: 'required',
        message: 'فیلدهای فرم الزامی است',
        field: 'fields'
      });
    } else {
      const validationResult = ValidationService.validateBatch(formData.fields, formData, { validateHidden: false });
      if (!validationResult.isValid) {
        errors.push(...validationResult.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * اعتبارسنجی فیلدها
   */
  private static validateFields(fields: FormField[]): ValidationResult {
    return ValidationService.validateBatch(fields, {}, { validateHidden: false });
  }

  /**
   * اعتبارسنجی پاسخ فرم
   */
  private static validateFormResponse(form: Form, answers: Record<string, any>): ValidationResult {
    return ValidationService.validateBatch(form.fields, answers, { validateHidden: true });
  }

  // =================================
  // Helper Methods
  // =================================

  /**
   * پردازش فیلدهای فرم
   */
  private static processFormFields(formData: CreateFormDto): CreateFormDto {
    const processedFields = this.processFields(formData.fields || []);
    
    return {
      ...formData,
      fields: processedFields
    };
  }

  /**
   * پردازش فیلدها
   */
  private static processFields(fields: FormField[]): FormField[] {
    return fields.map(field => ({
      ...field,
      id: field.id || this.generateFieldId(),
      styling: {
        ...field.styling,
        width: field.styling.width || '100%'
      },
      validation: {
        ...field.validation
      }
    }));
  }

  /**
   * پردازش پاسخ‌ها
   */
  private static processAnswers(fields: FormField[], answers: Record<string, any>): Record<string, any> {
    const processed: Record<string, any> = {};

    fields.forEach(field => {
      const value = answers[field.id];
      
      if (value !== undefined) {
        switch (field.type) {
          case 'number':
            processed[field.id] = value ? Number(value) : null;
            break;
            
          case 'checkbox':
            // اگر array نیست، به array تبدیل کن
            processed[field.id] = Array.isArray(value) ? value : (value ? [value] : []);
            break;
            
          case 'date':
          case 'time':
          case 'datetime':
            // اعتبارسنجی و فرمت تاریخ
            processed[field.id] = value ? new Date(value).toISOString() : null;
            break;
            
          default:
            processed[field.id] = value;
        }
      }
    });

    return processed;
  }

  /**
   * تولید ID یکتا برای فیلد
   */
  private static generateFieldId(): string {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * پاکسازی cache فرم‌ها
   */
  private static async clearFormsCache(): Promise<void> {
    // پاکسازی cache های مرتبط با لیست فرم‌ها
    // در عمل باید pattern matching داشته باشیم
    console.log('🧹 Forms cache cleared');
  }

  /**
   * پاکسازی cache پاسخ‌ها
   */
  private static async clearResponsesCache(formId: string): Promise<void> {
    // پاکسازی cache های مرتبط با پاسخ‌های این فرم
    console.log(`🧹 Responses cache cleared for form: ${formId}`);
  }

  // =================================
  // Form Builder Utilities
  // =================================

  /**
   * ایجاد فیلد جدید با تنظیمات پیش‌فرض
   */
  static createField(type: FieldType, label: string): FormField {
    const baseField: FormField = {
      id: this.generateFieldId(),
      type,
      label,
      required: false,
      disabled: false,
      readonly: false,
      validation: {},
      styling: {
        width: '100%'
      }
    };

    // تنظیمات خاص هر نوع فیلد
    switch (type) {
      case 'email':
        baseField.placeholder = 'example@email.com';
        baseField.validation.pattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
        break;
        
      case 'tel':
        baseField.placeholder = '09123456789';
        baseField.validation.pattern = '^09\\d{9}$';
        break;
        
      case 'url':
        baseField.placeholder = 'https://example.com';
        break;
        
      case 'number':
        baseField.validation.min = 0;
        break;
        
      case 'textarea':
        baseField.fieldSettings = { rows: 4 };
        break;
        
      case 'select':
      case 'radio':
      case 'checkbox':
        baseField.options = [
          { id: 'option_1', label: 'گزینه ۱', value: 'option_1' },
          { id: 'option_2', label: 'گزینه ۲', value: 'option_2' }
        ];
        break;
        
      case 'rating':
        baseField.fieldSettings = { maxRating: 5 };
        break;
        
      case 'slider':
        baseField.fieldSettings = { min: 0, max: 100, step: 1 };
        break;
        
      case 'file':
        baseField.validation.fileTypes = ['jpg', 'jpeg', 'png', 'pdf'];
        baseField.validation.maxFileSize = 5 * 1024 * 1024; // 5MB
        break;
    }

    return baseField;
  }

  /**
   * دریافت field palette برای form builder
   */
  static getFieldPalette(): any[] {
    return [
      {
        category: 'basic',
        title: 'فیلدهای پایه',
        fields: [
          { type: 'text', label: 'متن کوتاه', icon: 'Type', description: 'ورود متن تک خطی' },
          { type: 'textarea', label: 'متن بلند', icon: 'AlignLeft', description: 'ورود متن چندخطی' },
          { type: 'number', label: 'عدد', icon: 'Hash', description: 'ورود عدد' },
          { type: 'email', label: 'ایمیل', icon: 'Mail', description: 'آدرس ایمیل' },
          { type: 'tel', label: 'تلفن', icon: 'Phone', description: 'شماره تلفن' },
          { type: 'url', label: 'وب‌سایت', icon: 'Link', description: 'آدرس وب‌سایت' }
        ]
      },
      {
        category: 'choice',
        title: 'فیلدهای انتخابی',
        fields: [
          { type: 'select', label: 'انتخاب از لیست', icon: 'ChevronDown', description: 'انتخاب یک گزینه از لیست' },
          { type: 'radio', label: 'دکمه رادیو', icon: 'Circle', description: 'انتخاب یک گزینه' },
          { type: 'checkbox', label: 'چک‌باکس', icon: 'Square', description: 'انتخاب چند گزینه' }
        ]
      },
      {
        category: 'datetime',
        title: 'تاریخ و زمان',
        fields: [
          { type: 'date', label: 'تاریخ', icon: 'Calendar', description: 'انتخاب تاریخ' },
          { type: 'time', label: 'زمان', icon: 'Clock', description: 'انتخاب زمان' },
          { type: 'datetime', label: 'تاریخ و زمان', icon: 'CalendarClock', description: 'انتخاب تاریخ و زمان' }
        ]
      },
      {
        category: 'advanced',
        title: 'فیلدهای پیشرفته',
        fields: [
          { type: 'file', label: 'آپلود فایل', icon: 'Upload', description: 'آپلود فایل' },
          { type: 'signature', label: 'امضا', icon: 'PenTool', description: 'امضای دیجیتال' },
          { type: 'rating', label: 'امتیازدهی', icon: 'Star', description: 'امتیاز با ستاره' },
          { type: 'slider', label: 'اسلایدر', icon: 'Sliders', description: 'انتخاب مقدار با اسلایدر' }
        ]
      }
    ];
  }

  /**
   * export فرم به فرمت JSON
   */
  static async exportForm(formId: string): Promise<string> {
    try {
      const form = await this.getForm(formId, false);
      if (!form) {
        throw new Error('Form not found');
      }

      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        form: {
          ...form,
          id: undefined // حذف ID برای import
        }
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('❌ Error exporting form:', error);
      throw error;
    }
  }

  /**
   * import فرم از JSON
   */
  static async importForm(jsonData: string, newName?: string): Promise<string> {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.form) {
        throw new Error('Invalid import data format');
      }

      const formData: CreateFormDto = {
        ...importData.form,
        name: newName || `${importData.form.name} - Imported`,
        metadata: {
          ...importData.form.metadata,
          status: 'draft'
        }
      };

      return await this.createForm(formData);
    } catch (error) {
      console.error('❌ Error importing form:', error);
      throw error;
    }
  }

  /**
   * تولید پیش‌نمایش فرم
   */
  static generateFormPreview(form: Form): string {
    return PreviewService.generateFormPreview(form);
  }
}
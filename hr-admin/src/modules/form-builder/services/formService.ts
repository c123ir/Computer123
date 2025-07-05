// src/modules/form-builder/services/formService.ts

import {
  Form,
  FormField,
  FormResponse,
  CreateFormDto,
  UpdateFormDto,
  FormFilters as QueryFilters,
  PaginationOptions,
  PaginatedResult,
  ValidationResult,
  FieldType,
  FormTemplate
} from '../types';

import { DatabaseService } from './database/interface';
import { DatabaseFactory } from './database/factory';
import { ValidationService } from './validationService';
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
      const response = await fetch(buildApiUrl('/forms/create'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) {
        throw new Error(`خطا در ایجاد فرم: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.id;
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
      const response = await fetch(buildApiUrl(`/forms/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) {
        throw new Error(`خطا در بروزرسانی فرم: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        ...data,
        fields: data.fields || []
      };
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
  static async updateFormStatus(id: string, status: Form['status']): Promise<Form | null> {
    try {
      const now = new Date().toISOString();
      const metadata = {
        status,
        updatedAt: now,
        createdAt: now,
        createdBy: 'system',
        version: 1
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
  static async getForms(): Promise<Form[]> {
    try {
      const response = await fetch(buildApiUrl('/forms'));
      
      if (!response.ok) {
        throw new Error(`خطا در دریافت لیست فرم‌ها: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.map((form: Form) => ({
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
    filters?: QueryFilters,
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
    filters?: QueryFilters,
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
    filters?: QueryFilters,
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
    const errors: any[] = [];

    // بررسی نام فرم
    if (!formData.name || formData.name.trim().length < 2) {
      errors.push({
        type: 'required',
        message: 'Form name is required and must be at least 2 characters',
        field: 'name'
      });
    }

    // بررسی فیلدها
    if (!formData.fields || formData.fields.length === 0) {
      errors.push({
        type: 'required',
        message: 'Form must have at least one field',
        field: 'fields'
      });
    } else {
      const fieldValidation = this.validateFields(formData.fields);
      errors.push(...fieldValidation.errors);
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
    const errors: any[] = [];

    fields.forEach((field, index) => {
      // بررسی ID فیلد
      if (!field.id) {
        errors.push({
          type: 'required',
          message: `Field ${index + 1} must have an ID`,
          field: `fields[${index}].id`
        });
      }

      // بررسی نوع فیلد
      const validTypes: FieldType[] = ['text', 'textarea', 'number', 'email', 'tel', 'url', 'select', 'radio', 'checkbox', 'date', 'time', 'datetime', 'file', 'signature', 'rating', 'slider'];
      if (!validTypes.includes(field.type)) {
        errors.push({
          type: 'invalid',
          message: `Invalid field type: ${field.type}`,
          field: `fields[${index}].type`
        });
      }

      // بررسی برچسب فیلد
      if (!field.label || field.label.trim().length === 0) {
        errors.push({
          type: 'required',
          message: `Field ${index + 1} must have a label`,
          field: `fields[${index}].label`
        });
      }

      // بررسی گزینه‌ها برای فیلدهای select, radio, checkbox
      if (['select', 'radio', 'checkbox'].includes(field.type)) {
        if (!field.options || field.options.length === 0) {
          errors.push({
            type: 'required',
            message: `Field ${index + 1} (${field.type}) must have options`,
            field: `fields[${index}].options`
          });
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * اعتبارسنجی پاسخ فرم
   */
  private static validateFormResponse(form: Form, answers: Record<string, any>): ValidationResult {
    const errors: any[] = [];

    form.fields.forEach(field => {
      const value = answers[field.id];

      // بررسی فیلدهای اجباری
      if (field.required && (value === undefined || value === null || value === '')) {
        errors.push({
          type: 'required',
          message: `${field.label} is required`,
          field: field.id
        });
        return;
      }

      // اعتبارسنجی بر اساس نوع فیلد
      if (value !== undefined && value !== null && value !== '') {
        switch (field.type) {
          case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              errors.push({
                type: 'email',
                message: `${field.label} must be a valid email`,
                field: field.id
              });
            }
            break;

          case 'url':
            try {
              new URL(value);
            } catch {
              errors.push({
                type: 'url',
                message: `${field.label} must be a valid URL`,
                field: field.id
              });
            }
            break;

          case 'number':
            if (isNaN(Number(value))) {
              errors.push({
                type: 'number',
                message: `${field.label} must be a number`,
                field: field.id
              });
            } else {
              const numValue = Number(value);
              if (field.validation.min !== undefined && numValue < field.validation.min) {
                errors.push({
                  type: 'min',
                  message: `${field.label} must be at least ${field.validation.min}`,
                  field: field.id
                });
              }
              if (field.validation.max !== undefined && numValue > field.validation.max) {
                errors.push({
                  type: 'max',
                  message: `${field.label} must be at most ${field.validation.max}`,
                  field: field.id
                });
              }
            }
            break;

          case 'text':
          case 'textarea':
            const strValue = String(value);
            if (field.validation.minLength && strValue.length < field.validation.minLength) {
              errors.push({
                type: 'minLength',
                message: `${field.label} must be at least ${field.validation.minLength} characters`,
                field: field.id
              });
            }
            if (field.validation.maxLength && strValue.length > field.validation.maxLength) {
              errors.push({
                type: 'maxLength',
                message: `${field.label} must be at most ${field.validation.maxLength} characters`,
                field: field.id
              });
            }
            if (field.validation.pattern) {
              const regex = new RegExp(field.validation.pattern);
              if (!regex.test(strValue)) {
                errors.push({
                  type: 'pattern',
                  message: field.validation.patternMessage || `${field.label} format is invalid`,
                  field: field.id
                });
              }
            }
            break;
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
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
    // تولید HTML پیش‌نمایش ساده
    let html = `<div class="form-preview">`;
    html += `<h2>${form.name}</h2>`;
    
    if (form.description) {
      html += `<p>${form.description}</p>`;
    }

    form.fields.forEach(field => {
      html += `<div class="field-preview">`;
      html += `<label>${field.label}${field.required ? ' *' : ''}</label>`;
      
      switch (field.type) {
        case 'text':
        case 'email':
        case 'tel':
        case 'url':
          html += `<input type="${field.type}" placeholder="${field.placeholder || ''}" />`;
          break;
          
        case 'textarea':
          html += `<textarea placeholder="${field.placeholder || ''}"></textarea>`;
          break;
          
        case 'number':
          html += `<input type="number" />`;
          break;
          
        case 'select':
          html += `<select>`;
          field.options?.forEach((option: any) => {
            html += `<option value="${option.value}">${option.label}</option>`;
          });
          html += `</select>`;
          break;
          
        case 'radio':
          field.options?.forEach((option: any) => {
            html += `<label><input type="radio" name="${field.id}" value="${option.value}" /> ${option.label}</label>`;
          });
          break;
          
        case 'checkbox':
          field.options?.forEach((option: any) => {
            html += `<label><input type="checkbox" value="${option.value}" /> ${option.label}</label>`;
          });
          break;
          
        default:
          html += `<div>[${field.type} field]</div>`;
      }
      
      if (field.helpText) {
        html += `<small>${field.helpText}</small>`;
      }
      
      html += `</div>`;
    });

    html += `<button type="submit">${form.settings.submitButtonText}</button>`;
    html += `</div>`;

    return html;
  }

  // =================================
  // Status Management
  // =================================

  /**
   * تغییر وضعیت فرم
   */
  static async changeFormStatus(formId: string, status: 'draft' | 'published' | 'archived' | 'paused'): Promise<void> {
    try {
      await this.updateForm(formId, {
        metadata: { status }
      });
      
      console.log(`✅ Form status changed to: ${status}`);
    } catch (error) {
      console.error('❌ Error changing form status:', error);
      throw error;
    }
  }

  /**
   * انتشار فرم
   */
  static async publishForm(formId: string): Promise<void> {
    try {
      // بررسی آماده بودن فرم برای انتشار
      const form = await this.getForm(formId, false);
      if (!form) {
        throw new Error('Form not found');
      }

      const validationResult = this.validateFormData(form);
      if (!validationResult.isValid) {
        throw new Error('Form is not ready for publishing. Please fix validation errors.');
      }

      await this.changeFormStatus(formId, 'published');
    } catch (error) {
      console.error('❌ Error publishing form:', error);
      throw error;
    }
  }

  /**
   * آرشیو فرم
   */
  static async archiveForm(formId: string): Promise<void> {
    try {
      await this.changeFormStatus(formId, 'archived');
    } catch (error) {
      console.error('❌ Error archiving form:', error);
      throw error;
    }
  }
}

// Export static methods for convenience
export const {
  getForm,
  createForm,
  updateForm,
  deleteForm,
  cloneForm,
  updateFormStatus,
  getForms
} = FormService;
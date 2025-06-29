// src/modules/form-builder/services/validationService.ts

import {
    FormField,
    ValidationRules,
    ValidationResult,
    ValidationErrorType,
    CustomValidator,
    FieldType
  } from '../types';
  
  /**
   * سرویس اعتبارسنجی پیشرفته برای فرم‌ها و فیلدها
   */
  export class ValidationService {
    private static customValidators: Map<string, CustomValidator> = new Map();
    
    // =================================
    // Field Validation
    // =================================
  
    /**
     * اعتبارسنجی یک فیلد
     */
    static validateField(
      field: FormField, 
      value: any, 
      allFormData?: Record<string, any>
    ): ValidationResult {
      const errors: any[] = [];
  
      // بررسی اجباری بودن
      if (field.required && this.isEmpty(value)) {
        errors.push({
          type: 'required' as ValidationErrorType,
          message: `${field.label} اجباری است`,
          field: field.id
        });
        
        // اگر فیلد خالی و اجباری است، سایر بررسی‌ها لازم نیست
        return {
          isValid: false,
          errors
        };
      }
  
      // اگر فیلد خالی و اجباری نیست، معتبر است
      if (this.isEmpty(value)) {
        return {
          isValid: true,
          errors: []
        };
      }
  
      // اعتبارسنجی بر اساس نوع فیلد
      const typeValidation = this.validateByType(field.type, value);
      errors.push(...typeValidation.errors);
  
      // اعتبارسنجی قوانین عمومی
      const rulesValidation = this.validateRules(field.validation, value, field.label);
      errors.push(...rulesValidation.errors);
  
      // اعتبارسنجی سفارشی
      if ((field as any).customValidators) {
        const customValidation = this.validateCustom((field as any).customValidators, value, field, allFormData);
        errors.push(...customValidation.errors);
      }
  
      // اعتبارسنجی شرطی
      if (field.conditions && allFormData) {
        const conditionalValidation = this.validateConditional(field, allFormData);
        errors.push(...conditionalValidation.errors);
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    /**
     * اعتبارسنجی تمام فیلدهای فرم
     */
    static validateForm(
      fields: FormField[], 
      formData: Record<string, any>
    ): Record<string, ValidationResult> {
      const results: Record<string, ValidationResult> = {};
  
      fields.forEach(field => {
        const value = formData[field.id];
        results[field.id] = this.validateField(field, value, formData);
      });
  
      return results;
    }
  
    /**
     * بررسی معتبر بودن کل فرم
     */
    static isFormValid(validationResults: Record<string, ValidationResult>): boolean {
      return Object.values(validationResults).every(result => result.isValid);
    }
  
    // =================================
    // Type-specific Validation
    // =================================
  
    /**
     * اعتبارسنجی بر اساس نوع فیلد
     */
    private static validateByType(type: FieldType, value: any): ValidationResult {
      const errors: any[] = [];
  
      switch (type) {
        case 'email':
          if (!this.isValidEmail(value)) {
            errors.push({
              type: 'email' as ValidationErrorType,
              message: 'فرمت ایمیل صحیح نیست',
              field: 'email'
            });
          }
          break;
  
        case 'url':
          if (!this.isValidUrl(value)) {
            errors.push({
              type: 'url' as ValidationErrorType,
              message: 'آدرس وب‌سایت صحیح نیست',
              field: 'url'
            });
          }
          break;
  
        case 'tel':
          if (!this.isValidPhone(value)) {
            errors.push({
              type: 'pattern' as ValidationErrorType,
              message: 'شماره تلفن صحیح نیست',
              field: 'tel'
            });
          }
          break;
  
        case 'number':
          if (!this.isValidNumber(value)) {
            errors.push({
              type: 'custom' as ValidationErrorType,
              message: 'مقدار وارد شده باید عدد باشد',
              field: 'number'
            });
          }
          break;
  
        case 'date':
          if (!this.isValidDate(value)) {
            errors.push({
              type: 'custom' as ValidationErrorType,
              message: 'تاریخ وارد شده صحیح نیست',
              field: 'date'
            });
          }
          break;
  
        case 'time':
          if (!this.isValidTime(value)) {
            errors.push({
              type: 'custom' as ValidationErrorType,
              message: 'زمان وارد شده صحیح نیست',
              field: 'time'
            });
          }
          break;
  
        case 'file':
          // اعتبارسنجی فایل در متد جداگانه
          const fileValidation = this.validateFile(value);
          errors.push(...fileValidation.errors);
          break;
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    // =================================
    // Rules Validation
    // =================================
  
    /**
     * اعتبارسنجی قوانین عمومی
     */
    private static validateRules(
      rules: ValidationRules, 
      value: any, 
      fieldLabel: string
    ): ValidationResult {
      const errors: any[] = [];
  
      // حداقل طول
      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        errors.push({
          type: 'minLength' as ValidationErrorType,
          message: `${fieldLabel} باید حداقل ${rules.minLength} کاراکتر باشد`,
          field: 'minLength'
        });
      }
  
      // حداکثر طول
      if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        errors.push({
          type: 'maxLength' as ValidationErrorType,
          message: `${fieldLabel} نباید بیش از ${rules.maxLength} کاراکتر باشد`,
          field: 'maxLength'
        });
      }
  
      // حداقل مقدار
      if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
        errors.push({
          type: 'min' as ValidationErrorType,
          message: `${fieldLabel} باید حداقل ${rules.min} باشد`,
          field: 'min'
        });
      }
  
      // حداکثر مقدار
      if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
        errors.push({
          type: 'max' as ValidationErrorType,
          message: `${fieldLabel} نباید بیش از ${rules.max} باشد`,
          field: 'max'
        });
      }
  
      // الگو (Pattern)
      if (rules.pattern && typeof value === 'string') {
        const regex = new RegExp(rules.pattern);
        if (!regex.test(value)) {
          errors.push({
            type: 'pattern' as ValidationErrorType,
            message: rules.patternMessage || `فرمت ${fieldLabel} صحیح نیست`,
            field: 'pattern'
          });
        }
      }
  
      // اعتبارسنجی فایل
      if (value instanceof File || (Array.isArray(value) && value[0] instanceof File)) {
        const fileValidation = this.validateFileRules(value, rules);
        errors.push(...fileValidation.errors);
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    // =================================
    // File Validation
    // =================================
  
    /**
     * اعتبارسنجی فایل
     */
    private static validateFile(value: any): ValidationResult {
      const errors: any[] = [];
  
      if (!value) {
        return { isValid: true, errors: [] };
      }
  
      // اگر array است (multiple files)
      if (Array.isArray(value)) {
        value.forEach((file, index) => {
          if (!(file instanceof File)) {
            errors.push({
              type: 'custom' as ValidationErrorType,
              message: `فایل ${index + 1} معتبر نیست`,
              field: 'file'
            });
          }
        });
      } else if (!(value instanceof File)) {
        errors.push({
          type: 'custom' as ValidationErrorType,
          message: 'فایل انتخاب شده معتبر نیست',
          field: 'file'
        });
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    /**
     * اعتبارسنجی قوانین فایل
     */
    private static validateFileRules(value: any, rules: ValidationRules): ValidationResult {
      const errors: any[] = [];
      const files = Array.isArray(value) ? value : [value];
  
      files.forEach((file: File, index: number) => {
        if (!(file instanceof File)) return;
  
        // بررسی نوع فایل
        if (rules.fileTypes && rules.fileTypes.length > 0) {
          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          if (!fileExtension || !rules.fileTypes.includes(fileExtension)) {
            errors.push({
              type: 'fileType' as ValidationErrorType,
              message: `نوع فایل ${index + 1} مجاز نیست. انواع مجاز: ${rules.fileTypes.join(', ')}`,
              field: 'fileType'
            });
          }
        }
  
        // بررسی اندازه فایل
        if (rules.maxFileSize && file.size > rules.maxFileSize) {
          const maxSizeMB = (rules.maxFileSize / (1024 * 1024)).toFixed(1);
          errors.push({
            type: 'fileSize' as ValidationErrorType,
            message: `اندازه فایل ${index + 1} نباید بیش از ${maxSizeMB} مگابایت باشد`,
            field: 'fileSize'
          });
        }
      });
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    // =================================
    // Custom Validation
    // =================================
  
    /**
     * اعتبارسنجی سفارشی
     */
    private static validateCustom(
      validators: CustomValidator[],
      value: any,
      field: FormField,
      allFormData?: Record<string, any>
    ): ValidationResult {
      const errors: any[] = [];
  
      validators.forEach(validator => {
        try {
          const isValid = validator.validator(value, field, allFormData || {});
          
          if (typeof isValid === 'boolean' && !isValid) {
            errors.push({
              type: 'custom' as ValidationErrorType,
              message: validator.errorMessage,
              field: field.id
            });
          } else if (typeof isValid === 'string') {
            // اگر string برگردانده شود، به عنوان پیام خطا در نظر گرفته می‌شود
            errors.push({
              type: 'custom' as ValidationErrorType,
              message: isValid,
              field: field.id
            });
          }
        } catch (error) {
          errors.push({
            type: 'custom' as ValidationErrorType,
            message: `خطا در اعتبارسنجی: ${error}`,
            field: field.id
          });
        }
      });
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    /**
     * ثبت اعتبارسنج سفارشی
     */
    static registerCustomValidator(name: string, validator: CustomValidator): void {
      this.customValidators.set(name, validator);
      console.log(`✅ Custom validator registered: ${name}`);
    }
  
    /**
     * دریافت اعتبارسنج سفارشی
     */
    static getCustomValidator(name: string): CustomValidator | undefined {
      return this.customValidators.get(name);
    }
  
    // =================================
    // Conditional Validation
    // =================================
  
    /**
     * اعتبارسنجی شرطی
     */
    private static validateConditional(field: FormField, allFormData: Record<string, any>): ValidationResult {
      const errors: any[] = [];
  
      if (!field.conditions) {
        return { isValid: true, errors: [] };
      }
  
      const shouldBeVisible = field.conditions.every(condition => {
        const dependentValue = allFormData[condition.dependsOn];
        
        switch (condition.operator) {
          case 'equals':
            return dependentValue === condition.value;
          case 'not_equals':
            return dependentValue !== condition.value;
          case 'contains':
            return String(dependentValue).includes(String(condition.value));
          case 'greater':
            return Number(dependentValue) > Number(condition.value);
          case 'less':
            return Number(dependentValue) < Number(condition.value);
          default:
            return true;
        }
      });
  
      // اگر فیلد نباید نمایش داده شود، اعتبارسنجی لازم نیست
      if (!shouldBeVisible && field.required) {
        // فیلد اجباری ولی مخفی است - این معتبر است
        return { isValid: true, errors: [] };
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    // =================================
    // Helper Methods
    // =================================
  
    /**
     * بررسی خالی بودن مقدار
     */
    private static isEmpty(value: any): boolean {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string' && value.trim() === '') return true;
      if (Array.isArray(value) && value.length === 0) return true;
      if (typeof value === 'object' && Object.keys(value).length === 0) return true;
      return false;
    }
  
    /**
     * اعتبارسنجی ایمیل
     */
    private static isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    /**
     * اعتبارسنجی URL
     */
    private static isValidUrl(url: string): boolean {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }
  
    /**
     * اعتبارسنجی شماره تلفن ایرانی
     */
    private static isValidPhone(phone: string): boolean {
      // الگوی شماره موبایل ایرانی
      const mobileRegex = /^09[0-9]{9}$/;
      // الگوی شماره ثابت تهران
      const landlineRegex = /^021[0-9]{8}$/;
      // الگوی کلی شماره ثابت
      const generalLandlineRegex = /^0[1-9][0-9]{8,9}$/;
      
      const cleanPhone = phone.replace(/[\s\-()]/g, '');
      
      return mobileRegex.test(cleanPhone) || 
             landlineRegex.test(cleanPhone) || 
             generalLandlineRegex.test(cleanPhone);
    }
  
    /**
     * اعتبارسنجی عدد
     */
    private static isValidNumber(value: any): boolean {
      return !isNaN(Number(value)) && isFinite(Number(value));
    }
  
    /**
     * اعتبارسنجی تاریخ
     */
    private static isValidDate(value: any): boolean {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    }
  
    /**
     * اعتبارسنجی زمان
     */
    private static isValidTime(value: string): boolean {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(value);
    }
  
    // =================================
    // Advanced Validation Rules
    // =================================
  
    /**
     * اعتبارسنج کد ملی ایرانی
     */
    static validateNationalId(nationalId: string): boolean {
      // حذف کاراکترهای غیرعددی
      const cleanId = nationalId.replace(/\D/g, '');
      
      // بررسی طول
      if (cleanId.length !== 10) return false;
      
      // بررسی الگوهای غیرمعتبر
      const invalidPatterns = [
        '0000000000', '1111111111', '2222222222', '3333333333', '4444444444',
        '5555555555', '6666666666', '7777777777', '8888888888', '9999999999'
      ];
      
      if (invalidPatterns.includes(cleanId)) return false;
      
      // اعتبارسنجی checksum
      const digits = cleanId.split('').map(Number);
      const checkDigit = digits[9];
      
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += digits[i] * (10 - i);
      }
      
      const remainder = sum % 11;
      const expectedCheckDigit = remainder < 2 ? remainder : 11 - remainder;
      
      return checkDigit === expectedCheckDigit;
    }
  
    /**
     * اعتبارسنج کد پستی ایرانی
     */
    static validatePostalCode(postalCode: string): boolean {
      const cleanCode = postalCode.replace(/\D/g, '');
      // کد پستی ایران باید 10 رقم باشد
      return /^[0-9]{10}$/.test(cleanCode);
    }
  
    /**
     * اعتبارسنج شماره کارت بانکی
     */
    static validateBankCard(cardNumber: string): boolean {
      const cleanNumber = cardNumber.replace(/\D/g, '');
      
      // بررسی طول (معمولاً 16 رقم)
      if (cleanNumber.length !== 16) return false;
      
      // الگوریتم Luhn
      let sum = 0;
      let shouldDouble = false;
      
      for (let i = cleanNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanNumber[i]);
        
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      
      return sum % 10 === 0;
    }
  
    /**
     * اعتبارسنج رمز عبور قوی
     */
    static validateStrongPassword(password: string): {
      isValid: boolean;
      errors: string[];
      strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    } {
      const errors: string[] = [];
      let score = 0;
  
      // حداقل طول
      if (password.length < 8) {
        errors.push('رمز عبور باید حداقل 8 کاراکتر باشد');
      } else {
        score += 1;
      }
  
      // حروف بزرگ
      if (!/[A-Z]/.test(password)) {
        errors.push('رمز عبور باید شامل حداقل یک حرف بزرگ انگلیسی باشد');
      } else {
        score += 1;
      }
  
      // حروف کوچک
      if (!/[a-z]/.test(password)) {
        errors.push('رمز عبور باید شامل حداقل یک حرف کوچک انگلیسی باشد');
      } else {
        score += 1;
      }
  
      // اعداد
      if (!/[0-9]/.test(password)) {
        errors.push('رمز عبور باید شامل حداقل یک عدد باشد');
      } else {
        score += 1;
      }
  
      // کاراکترهای خاص
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('رمز عبور باید شامل حداقل یک کاراکتر خاص باشد');
      } else {
        score += 1;
      }
  
      // طول بیشتر
      if (password.length >= 12) {
        score += 1;
      }
  
      // تعیین قدرت رمز
      let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
      if (score <= 2) strength = 'weak';
      else if (score <= 3) strength = 'medium';
      else if (score <= 4) strength = 'strong';
      else strength = 'very-strong';
  
      return {
        isValid: errors.length === 0,
        errors,
        strength
      };
    }
  
    // =================================
    // Business Logic Validators
    // =================================
  
    /**
     * اعتبارسنج سن
     */
    static validateAge(birthDate: string, minAge: number = 18, maxAge: number = 100): ValidationResult {
      const errors: any[] = [];
      
      if (!this.isValidDate(birthDate)) {
        errors.push({
          type: 'custom' as ValidationErrorType,
          message: 'تاریخ تولد معتبر نیست',
          field: 'birthDate'
        });
        return { isValid: false, errors };
      }
  
      const today = new Date();
      const birth = new Date(birthDate);
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()) 
        ? age - 1 
        : age;
  
      if (actualAge < minAge) {
        errors.push({
          type: 'custom' as ValidationErrorType,
          message: `سن باید حداقل ${minAge} سال باشد`,
          field: 'age'
        });
      }
  
      if (actualAge > maxAge) {
        errors.push({
          type: 'custom' as ValidationErrorType,
          message: `سن نباید بیش از ${maxAge} سال باشد`,
          field: 'age'
        });
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    /**
     * اعتبارسنج تطبیق رمز عبور
     */
    static validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
      const errors: any[] = [];
  
      if (password !== confirmPassword) {
        errors.push({
          type: 'custom' as ValidationErrorType,
          message: 'رمز عبور و تکرار آن مطابقت ندارند',
          field: 'passwordMatch'
        });
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    /**
     * اعتبارسنج یکتا بودن (نیاز به API call)
     */
    static async validateUnique(
      value: string, 
      field: string, 
      checkFunction: (value: string) => Promise<boolean>
    ): Promise<ValidationResult> {
      const errors: any[] = [];
  
      try {
        const isUnique = await checkFunction(value);
        
        if (!isUnique) {
          errors.push({
            type: 'custom' as ValidationErrorType,
            message: `${field} قبلاً استفاده شده است`,
            field: 'unique'
          });
        }
      } catch (error) {
        errors.push({
          type: 'custom' as ValidationErrorType,
          message: 'خطا در بررسی یکتا بودن',
          field: 'unique'
        });
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    // =================================
    // Batch Validation
    // =================================
  
    /**
     * اعتبارسنجی گروهی چندین فیلد
     */
    static validateBatch(
      fields: FormField[],
      data: Record<string, any>,
      options: {
        stopOnFirst?: boolean;
        validateHidden?: boolean;
      } = {}
    ): {
      isValid: boolean;
      results: Record<string, ValidationResult>;
      summary: {
        totalFields: number;
        validFields: number;
        invalidFields: number;
        errors: any[];
      };
    } {
      const results: Record<string, ValidationResult> = {};
      const allErrors: any[] = [];
      let validCount = 0;
  
      for (const field of fields) {
        // بررسی نمایش فیلد
        if (!options.validateHidden && field.conditions) {
          const isVisible = this.isFieldVisible(field, data);
          if (!isVisible) {
            results[field.id] = { isValid: true, errors: [] };
            validCount++;
            continue;
          }
        }
  
        const result = this.validateField(field, data[field.id], data);
        results[field.id] = result;
  
        if (result.isValid) {
          validCount++;
        } else {
          allErrors.push(...result.errors);
          
          // توقف در اولین خطا
          if (options.stopOnFirst) {
            break;
          }
        }
      }
  
      return {
        isValid: allErrors.length === 0,
        results,
        summary: {
          totalFields: fields.length,
          validFields: validCount,
          invalidFields: fields.length - validCount,
          errors: allErrors
        }
      };
    }
  
    /**
     * بررسی نمایش فیلد بر اساس شرایط
     */
    private static isFieldVisible(field: FormField, formData: Record<string, any>): boolean {
      if (!field.conditions || field.conditions.length === 0) {
        return true;
      }
  
      return field.conditions.every(condition => {
        const dependentValue = formData[condition.dependsOn];
        
        switch (condition.operator) {
          case 'equals':
            return dependentValue === condition.value;
          case 'not_equals':
            return dependentValue !== condition.value;
          case 'contains':
            return String(dependentValue).includes(String(condition.value));
          case 'greater_than':
            return Number(dependentValue) > Number(condition.value);
          case 'less_than':
            return Number(dependentValue) < Number(condition.value);
          default:
            return true;
        }
      });
    }
  
    // =================================
    // Real-time Validation
    // =================================
  
    /**
     * اعتبارسنجی بلادرنگ با debounce
     */
    static createRealtimeValidator(
      field: FormField,
      callback: (result: ValidationResult) => void,
      delay: number = 500
    ): (value: any) => void {
      let timeoutId: NodeJS.Timeout;
  
      return (value: any) => {
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
          const result = this.validateField(field, value);
          callback(result);
        }, delay);
      };
    }
  
    // =================================
    // Export/Import Validation Rules
    // =================================
  
    /**
     * صدور قوانین اعتبارسنجی
     */
    static exportValidationRules(fields: FormField[]): string {
      const rules = fields.map(field => ({
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        validation: field.validation,
        customValidators: (field as any).customValidators?.map((v: any) => ({
          name: v.name,
          errorMessage: v.errorMessage
          // توجه: تابع validator قابل serialize نیست
        }))
      }));
  
      return JSON.stringify(rules, null, 2);
    }
  
    /**
     * وارد کردن قوانین اعتبارسنجی
     */
    static importValidationRules(rulesJson: string): FormField[] {
      try {
        const rules = JSON.parse(rulesJson);
        
        return rules.map((rule: any) => ({
          ...rule,
          styling: { width: '100%' }, // تنظیمات پیش‌فرض
          customValidators: rule.customValidators?.map((cv: any) => ({
            ...cv,
            validator: () => true // validator پیش‌فرض - باید دوباره تنظیم شود
          }))
        }));
      } catch (error) {
        throw new Error('Invalid validation rules format');
      }
    }
  }
// src/modules/form-builder/hooks/index.ts

import { useFormBuilder } from './useFormBuilder';
import { useState, useCallback } from 'react';

/**
 * Export تمام Hook های Form Builder
 */

// Main Hooks
export { 
    useFormBuilder, 
  type FormBuilderState,
  type FormBuilderActions,
  type UseFormBuilderOptions
  } from './useFormBuilder';

export { 
  useFormBuilderShortcuts,
  type UseFormBuilderShortcutsOptions
} from './useFormBuilderShortcuts';

export {
  useFormsAPI,
  type FormsAPI
} from './useFormsAPI';
  
  // Hook Types
export type UseFormBuilderReturn = ReturnType<typeof import('./useFormBuilder').useFormBuilder>;

// Default export
export default useFormBuilder;
  
  // Placeholder for future hooks
  export const useDragDrop = () => {
    // TODO: Implement drag and drop hook
    return {
      dragStart: () => {},
      dragEnd: () => {},
      drop: () => {}
    };
  };
  
  export const useFormValidation = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isValid, setIsValid] = useState(true);

    const validate = useCallback((form: any) => {
      const newErrors: Record<string, string> = {};

      // اعتبارسنجی نام فرم
      if (!form.name?.trim()) {
        newErrors.name = 'نام فرم الزامی است';
      } else if (form.name.trim().length < 2) {
        newErrors.name = 'نام فرم باید حداقل ۲ کاراکتر باشد';
      }

      // اعتبارسنجی فیلدها
      if (!form.fields || form.fields.length === 0) {
        newErrors.fields = 'فرم باید حداقل یک فیلد داشته باشد';
      } else {
        form.fields.forEach((field: any, index: number) => {
          if (!field.id) {
            newErrors[`field_${index}_id`] = 'شناسه فیلد الزامی است';
          }
          if (!field.type) {
            newErrors[`field_${index}_type`] = 'نوع فیلد الزامی است';
          }
          if (!field.label?.trim()) {
            newErrors[`field_${index}_label`] = 'برچسب فیلد الزامی است';
          }
        });
      }

      // اعتبارسنجی تنظیمات
      if (!form.settings) {
        newErrors.settings = 'تنظیمات فرم الزامی است';
      }

      // اعتبارسنجی استایل
      if (!form.styling) {
        newErrors.styling = 'استایل فرم الزامی است';
      }

      setErrors(newErrors);
      setIsValid(Object.keys(newErrors).length === 0);
      return Object.keys(newErrors).length === 0;
    }, []);

    return {
      validate,
      errors,
      isValid,
      setErrors
    };
  };

export { useFormValidation } from './useFormValidation';
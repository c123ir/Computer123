import { useState, useCallback } from 'react';
import { ValidationService } from '../services/validationService';
import { Form, FormField, ValidationResult } from '../types';

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);

  const validate = useCallback((form: Form) => {
    const validationResult = ValidationService.validateBatch(form.fields, {}, { validateHidden: false });
    
    const newErrors: Record<string, string> = {};
    
    if (!validationResult.isValid) {
      validationResult.errors.forEach(error => {
        newErrors[error.field] = error.message;
      });
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  }, []);

  const validateField = useCallback((field: FormField, value: any, formData?: Record<string, any>) => {
    const validationResult = ValidationService.validateField(field, value, formData);
    
    const newErrors = { ...errors };
    
    if (!validationResult.isValid) {
      validationResult.errors.forEach(error => {
        newErrors[error.field] = error.message;
      });
    } else {
      delete newErrors[field.id];
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return validationResult.isValid;
  }, [errors]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(true);
  }, []);

  const setFieldError = useCallback((fieldId: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldId]: message
    }));
    setIsValid(false);
  }, []);

  return {
    validate,
    validateField,
    clearErrors,
    setFieldError,
    errors,
    isValid
  };
};
// src/modules/form-builder/hooks/useFormBuilder.ts

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Form, 
  FormField, 
  FieldType, 
  FormSettings,
  FormStyling,
  FormMetadata 
} from '../types';
import { getForm } from '../services/form.service';

export interface FormBuilderState {
  /** فرم فعلی */
  form: Form;
  /** فیلد انتخاب شده */
  selectedField: FormField | null;
  /** حالت ویرایش */
  isEditing: boolean;
  /** تغییرات ذخیره نشده */
  hasUnsavedChanges: boolean;
  /** وضعیت بارگذاری */
  isLoading: boolean;
  /** خطاها */
  errors: Record<string, string>;
  /** تاریخچه تغییرات برای undo/redo */
  history: Form[];
  /** موقعیت فعلی در تاریخچه */
  historyIndex: number;
}

export interface FormBuilderActions {
  // Form Management
  /** ایجاد فرم جدید */
  createNewForm: (initial?: Partial<Form>) => void;
  /** بارگذاری فرم */
  loadForm: (form: Form) => void;
  /** ذخیره فرم */
  saveForm: () => Promise<void>;
  /** reset فرم */
  resetForm: () => void;
  
  // Field Management
  /** اضافه کردن فیلد */
  addField: (type: FieldType, index?: number) => string;
  /** حذف فیلد */
  removeField: (fieldId: string) => void;
  /** کپی فیلد */
  duplicateField: (fieldId: string) => void;
  /** جابجایی فیلد */
  moveField: (fieldId: string, newIndex: number) => void;
  /** مرتب‌سازی مجدد فیلدها */
  reorderFields: (fields: FormField[]) => void;
  /** انتخاب فیلد */
  selectField: (fieldId: string | null) => void;
  /** بروزرسانی فیلد */
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  
  // Form Settings
  /** بروزرسانی تنظیمات */
  updateSettings: (updates: Partial<FormSettings>) => void;
  /** بروزرسانی ظاهر */
  updateStyling: (updates: Partial<FormStyling>) => void;
  /** بروزرسانی متادیتا */
  updateMetadata: (updates: Partial<FormMetadata>) => void;
  
  // History Management
  /** undo */
  undo: () => void;
  /** redo */
  redo: () => void;
  /** آیا undo امکان‌پذیر است */
  canUndo: boolean;
  /** آیا redo امکان‌پذیر است */
  canRedo: boolean;
  
  // Validation
  /** اعتبارسنجی فرم */
  validateForm: () => boolean;
  /** اعتبارسنجی فیلد */
  validateField: (fieldId: string) => boolean;
  
  // Utils
  /** تمیز کردن خطاها */
  clearErrors: () => void;
  /** تنظیم خطا */
  setError: (key: string, message: string) => void;
}

export interface UseFormBuilderOptions {
  /** شناسه فرم برای ویرایش */
  formId?: string;
  /** فرم اولیه */
  initialForm?: Form;
  /** فعال‌سازی auto-save */
  autoSave?: boolean;
  /** فاصله auto-save (میلی‌ثانیه) */
  autoSaveInterval?: number;
  /** callback ذخیره */
  onSave?: (form: Form) => Promise<void>;
  /** callback خطا */
  onError?: (error: string) => void;
  /** حداکثر تعداد history */
  maxHistorySize?: number;
}

/**
 * Hook اصلی برای مدیریت فرم‌ساز
 */
export const useFormBuilder = (options: UseFormBuilderOptions = {}) => {
  const {
    formId,
    initialForm,
    autoSave = false,
    autoSaveInterval = 30000, // 30 seconds
    onSave,
    onError,
    maxHistorySize = 50
  } = options;

  // =====================================================
  // States
  // =====================================================
  
  const [state, setState] = useState<FormBuilderState>(() => ({
    form: initialForm || createEmptyForm(),
    selectedField: null,
    isEditing: false,
    hasUnsavedChanges: false,
    isLoading: false,
    errors: {},
    history: [initialForm || createEmptyForm()],
    historyIndex: 0
  }));

  // Additional States
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Refs
  const autoSaveTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastSavedFormRef = useRef<Form>(state.form);

  // =====================================================
  // Helper Functions
  // =====================================================

  /**
   * ایجاد فرم خالی
   */
  function createEmptyForm(initial?: Partial<Form>): Form {
    const now = new Date().toISOString();
    
    return {
      id: '',
      name: initial?.name || 'فرم جدید',
      description: initial?.description || '',
      fields: initial?.fields || [],
      settings: {
        direction: 'rtl',
        theme: 'light',
        submitButtonText: 'ارسال',
        showProgressBar: false,
        allowSaveDraft: true,
        showFieldNumbers: false,
        formWidth: 'medium',
        ...initial?.settings
      },
      styling: {
        theme: 'default',
        backgroundColor: '#ffffff',
        textColor: '#374151',
        primaryColor: '#3b82f6',
        fontFamily: 'Vazirmatn',
        fontSize: 14,
        borderRadius: 8,
        spacing: 'normal',
        ...initial?.styling
      },
      metadata: {
        createdBy: 'current-user', // TODO: Get from context
        createdAt: now,
        updatedAt: now,
        status: 'draft',
        version: 1,
        ...initial?.metadata
      },
      status: initial?.status || 'draft',
      category: initial?.category,
      tags: initial?.tags || [],
      createdAt: now,
      updatedAt: now,
      ...initial
    };
  }

  /**
   * تولید ID یکتا برای فیلد
   */
  const generateFieldId = (): string => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * اضافه کردن به تاریخچه
   */
  const addToHistory = useCallback((newForm: Form) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newForm);
      
      // محدود کردن اندازه تاریخچه
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
      }
      
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  }, [maxHistorySize]);

  /**
   * بروزرسانی فرم و اضافه کردن به تاریخچه
   */
  const updateForm = useCallback((updates: Partial<Form> | ((prev: Form) => Form)) => {
    setState(prev => {
      const newForm = typeof updates === 'function' 
        ? updates(prev.form)
        : { ...prev.form, ...updates, updatedAt: new Date().toISOString() };
      
      // بررسی تغییرات
      const hasChanges = JSON.stringify(newForm) !== JSON.stringify(lastSavedFormRef.current);
      
      return {
        ...prev,
        form: newForm,
        hasUnsavedChanges: hasChanges
      };
    });
    
    // اضافه کردن به تاریخچه (با debounce)
    setTimeout(() => {
      setState(current => {
        addToHistory(current.form);
        return current;
      });
    }, 100);
  }, [addToHistory]);

  // =====================================================
  // Form Management Actions
  // =====================================================

  const createNewForm = useCallback((initial?: Partial<Form>) => {
    const newForm = createEmptyForm(initial);
    setState(prev => ({
      ...prev,
      form: newForm,
      selectedField: null,
      isEditing: true,
      hasUnsavedChanges: false,
      errors: {},
      history: [newForm],
      historyIndex: 0
    }));
    lastSavedFormRef.current = newForm;
  }, []);

  const loadForm = useCallback((form: Form) => {
    setState(prev => ({
      ...prev,
      form,
      selectedField: null,
      isEditing: false,
      hasUnsavedChanges: false,
      errors: {},
      history: [form],
      historyIndex: 0
    }));
    lastSavedFormRef.current = form;
  }, []);

  const saveForm = useCallback(async (): Promise<void> => {
    if (!state.hasUnsavedChanges || !onSave) return;

    setState(prev => ({ ...prev, isLoading: true, errors: {} }));

    try {
      await onSave(state.form);
      lastSavedFormRef.current = state.form;
      setLastSaved(new Date());
      setState(prev => ({ 
        ...prev, 
        hasUnsavedChanges: false, 
        isLoading: false 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطا در ذخیره فرم';
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        errors: { ...prev.errors, save: errorMessage }
      }));
      onError?.(errorMessage);
    }
  }, [state.form, state.hasUnsavedChanges, onSave, onError]);

  const resetForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      form: lastSavedFormRef.current,
      selectedField: null,
      hasUnsavedChanges: false,
      errors: {}
    }));
  }, []);

  // =====================================================
  // Field Management Actions
  // =====================================================

  const addField = useCallback((type: FieldType, index?: number): string => {
    const newField: FormField = {
      id: generateFieldId(),
      type,
      label: `فیلد ${type}`,
      placeholder: '',
      helpText: '',
      required: false,
      defaultValue: '',
      disabled: false,
      readonly: false,
      validation: {},
      styling: {
        width: '100%'
      },
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? [
        { id: 'option_1', label: 'گزینه ۱', value: 'option_1' },
        { id: 'option_2', label: 'گزینه ۲', value: 'option_2' }
      ] : undefined,
      fieldSettings: getDefaultFieldSettings(type)
    };

    updateForm(prev => {
      const newFields = [...prev.fields];
      const insertIndex = index !== undefined ? index : newFields.length;
      newFields.splice(insertIndex, 0, newField);
      
      return {
        ...prev,
        fields: newFields
      };
    });

    // انتخاب فیلد جدید
    setState(prev => ({ ...prev, selectedField: newField }));
    
    return newField.id;
  }, [updateForm]);

  const removeField = useCallback((fieldId: string) => {
    updateForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));

    // اگر فیلد انتخاب شده حذف شد، انتخاب را پاک کن
    setState(prev => ({
      ...prev,
      selectedField: prev.selectedField?.id === fieldId ? null : prev.selectedField
    }));
  }, [updateForm]);

  const duplicateField = useCallback((fieldId: string) => {
    const fieldToDuplicate = state.form.fields.find(f => f.id === fieldId);
    if (!fieldToDuplicate) return;

    const newField: FormField = {
      ...fieldToDuplicate,
      id: generateFieldId(),
      label: `${fieldToDuplicate.label} (کپی)`
    };

    updateForm(prev => {
      const fieldIndex = prev.fields.findIndex(f => f.id === fieldId);
      const newFields = [...prev.fields];
      newFields.splice(fieldIndex + 1, 0, newField);
      
      return {
        ...prev,
        fields: newFields
      };
    });
  }, [state.form.fields, updateForm]);

  const moveField = useCallback((fieldId: string, newIndex: number) => {
    updateForm(prev => {
      const fields = [...prev.fields];
      const currentIndex = fields.findIndex(f => f.id === fieldId);
      
      if (currentIndex === -1 || newIndex < 0 || newIndex >= fields.length) {
        return prev;
      }

      const [movedField] = fields.splice(currentIndex, 1);
      fields.splice(newIndex, 0, movedField);

      return {
        ...prev,
        fields
      };
    });
  }, [updateForm]);

  const reorderFields = useCallback((reorderedFields: FormField[]) => {
    updateForm(prev => ({
      ...prev,
      fields: reorderedFields
    }));
  }, [updateForm]);

  const selectField = useCallback((fieldId: string | null) => {
    const selectedField = fieldId 
      ? state.form.fields.find(f => f.id === fieldId) || null
      : null;
    
    setState(prev => ({ ...prev, selectedField }));
  }, [state.form.fields]);

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    updateForm(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));

    // بروزرسانی فیلد انتخاب شده
    setState(prev => ({
      ...prev,
      selectedField: prev.selectedField?.id === fieldId 
        ? { ...prev.selectedField, ...updates }
        : prev.selectedField
    }));
  }, [updateForm]);

  // =====================================================
  // Settings Actions
  // =====================================================

  const updateSettings = useCallback((updates: Partial<FormSettings>) => {
    updateForm(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  }, [updateForm]);

  const updateStyling = useCallback((updates: Partial<FormStyling>) => {
    updateForm(prev => ({
      ...prev,
      styling: { ...prev.styling, ...updates }
    }));
  }, [updateForm]);

  const updateMetadata = useCallback((updates: Partial<FormMetadata>) => {
    updateForm(prev => ({
      ...prev,
      metadata: { ...prev.metadata, ...updates }
    }));
  }, [updateForm]);

  // =====================================================
  // History Actions
  // =====================================================

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex <= 0) return prev;
      
      const newIndex = prev.historyIndex - 1;
      const formToRestore = prev.history[newIndex];
      
      return {
        ...prev,
        form: formToRestore,
        historyIndex: newIndex,
        hasUnsavedChanges: JSON.stringify(formToRestore) !== JSON.stringify(lastSavedFormRef.current)
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;
      
      const newIndex = prev.historyIndex + 1;
      const formToRestore = prev.history[newIndex];
      
      return {
        ...prev,
        form: formToRestore,
        historyIndex: newIndex,
        hasUnsavedChanges: JSON.stringify(formToRestore) !== JSON.stringify(lastSavedFormRef.current)
      };
    });
  }, []);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  // =====================================================
  // Validation
  // =====================================================

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    // بررسی نام فرم
    if (!state.form.name.trim()) {
      errors.name = 'نام فرم الزامی است';
    }

    // بررسی فیلدها
    if (state.form.fields.length === 0) {
      errors.fields = 'حداقل یک فیلد باید وجود داشته باشد';
    }

    // بررسی فیلدهای تکراری
    const fieldIds = state.form.fields.map(f => f.id);
    const duplicateIds = fieldIds.filter((id, index) => fieldIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.duplicateFields = 'شناسه فیلدهای تکراری یافت شد';
    }

    setState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [state.form]);

  const validateField = useCallback((fieldId: string): boolean => {
    const field = state.form.fields.find(f => f.id === fieldId);
    if (!field) return false;

    const errors: Record<string, string> = {};

    if (!field.label.trim()) {
      errors[`field_${fieldId}_label`] = 'برچسب فیلد الزامی است';
    }

    setState(prev => ({ ...prev, errors: { ...prev.errors, ...errors } }));
    return Object.keys(errors).length === 0;
  }, [state.form.fields]);

  // =====================================================
  // Utils
  // =====================================================

  const clearErrors = useCallback(() => {
    setState(prev => ({ ...prev, errors: {} }));
  }, []);

  const setError = useCallback((key: string, message: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [key]: message }
    }));
  }, []);

  // =====================================================
  // Effects
  // =====================================================

  // Auto-save
  useEffect(() => {
    if (!autoSave || !state.hasUnsavedChanges || !onSave) return;

    setIsAutoSaving(true);
    autoSaveTimerRef.current = setTimeout(async () => {
      await saveForm();
      setIsAutoSaving(false);
    }, autoSaveInterval);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        setIsAutoSaving(false);
      }
    };
  }, [autoSave, state.hasUnsavedChanges, autoSaveInterval, saveForm, onSave]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Load form when formId changes
  useEffect(() => {
    const loadFormById = async () => {
      if (!formId) return;

      setState(prev => ({ ...prev, isLoading: true }));

      try {
        const form = await getForm(formId);
        if (form) {
          setState(prev => ({
            ...prev,
            form,
            isLoading: false,
            history: [form],
            historyIndex: 0
          }));
          lastSavedFormRef.current = form;
        } else {
          throw new Error('Form not found');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load form';
        setState(prev => ({
          ...prev,
          isLoading: false,
          errors: { ...prev.errors, load: errorMessage }
        }));
        onError?.(errorMessage);
      }
    };

    loadFormById();
  }, [formId, onError]);

  // =====================================================
  // Return
  // =====================================================

  const actions: FormBuilderActions = {
    // Form Management
    createNewForm,
    loadForm,
    saveForm,
    resetForm,
    
    // Field Management
    addField,
    removeField,
    duplicateField,
    moveField,
    reorderFields,
    selectField,
    updateField,
    
    // Settings
    updateSettings,
    updateStyling,
    updateMetadata,
    
    // History
    undo,
    redo,
    canUndo,
    canRedo,
    
    // Validation
    validateForm,
    validateField,
    
    // Utils
    clearErrors,
    setError
  };

  return {
    ...state,
    ...actions,
    // Additional properties needed by FormBuilder component
    fields: state.form.fields,
    isSaving: state.isLoading,
    isAutoSaving,
    lastSaved,
    isFormValid: Object.keys(state.errors).length === 0,
    validationErrors: state.errors
  };
};

/**
 * تنظیمات پیش‌فرض برای انواع فیلد
 */
function getDefaultFieldSettings(type: FieldType): FormField['fieldSettings'] {
  switch (type) {
    case 'textarea':
      return { rows: 3 };
    case 'rating':
      return { maxRating: 5 };
    case 'slider':
      return { min: 0, max: 100, step: 1 };
    case 'file':
      return { multiple: false };
    case 'select':
      return { searchable: false };
    default:
      return {};
  }
}

export default useFormBuilder;
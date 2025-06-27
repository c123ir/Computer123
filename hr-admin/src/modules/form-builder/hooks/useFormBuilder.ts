// src/modules/form-builder/hooks/useFormBuilder.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { Form, FormField, FieldType, CreateFormDto } from '../types';
import { FormService } from '../services/formService';
import { ValidationService } from '../services/validationService';

/**
 * Hook اصلی برای مدیریت Form Builder
 * شامل مدیریت state، CRUD operations، و validation
 */

interface UseFormBuilderOptions {
  /** شناسه فرم برای ویرایش */
  formId?: string;
  /** فرم پیش‌فرض */
  initialForm?: Partial<Form>;
  /** ذخیره خودکار */
  autoSave?: boolean;
  /** فاصله ذخیره خودکار (میلی‌ثانیه) */
  autoSaveInterval?: number;
  /** callback پس از ذخیره */
  onSave?: (form: Form) => void;
  /** callback پس از خطا */
  onError?: (error: string) => void;
}

interface UseFormBuilderReturn {
  // Form State
  form: Form | null;
  fields: FormField[];
  selectedFieldId: string | null;
  selectedField: FormField | null;
  
  // Loading States
  isLoading: boolean;
  isSaving: boolean;
  isValidating: boolean;
  
  // Validation
  validationErrors: Record<string, string[]>;
  isFormValid: boolean;
  
  // Actions
  updateForm: (updates: Partial<Form>) => void;
  addField: (fieldType: FieldType, index?: number) => string;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  removeField: (fieldId: string) => void;
  duplicateField: (fieldId: string) => string;
  moveField: (fieldId: string, direction: 'up' | 'down') => void;
  reorderFields: (fieldIds: string[]) => void;
  selectField: (fieldId: string | null) => void;
  
  // Form Operations
  saveForm: () => Promise<string | null>;
  loadForm: (formId: string) => Promise<void>;
  resetForm: () => void;
  validateForm: () => boolean;
  
  // Undo/Redo
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  
  // Auto Save
  isAutoSaving: boolean;
  lastSaved: Date | null;
}

export const useFormBuilder = (options: UseFormBuilderOptions = {}): UseFormBuilderReturn => {
  const {
    formId,
    initialForm,
    autoSave = false,
    autoSaveInterval = 30000, // 30 seconds
    onSave,
    onError
  } = options;

  // State Management
  const [form, setForm] = useState<Form | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  // History Management for Undo/Redo
  const [history, setHistory] = useState<Form[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUpdatingFromHistory = useRef(false);

  // Auto Save Timer
  const autoSaveTimer = useRef<NodeJS.Timeout>();

  // Initialize form
  useEffect(() => {
    const initializeForm = async () => {
      if (formId) {
        await loadForm(formId);
      } else if (initialForm) {
        const newForm = createDefaultForm(initialForm);
        setForm(newForm);
        addToHistory(newForm);
      } else {
        const newForm = createDefaultForm();
        setForm(newForm);
        addToHistory(newForm);
      }
    };

    initializeForm();
  }, [formId]);

  // Auto Save Effect
  useEffect(() => {
    if (autoSave && form && !isUpdatingFromHistory.current) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }

      autoSaveTimer.current = setTimeout(() => {
        performAutoSave();
      }, autoSaveInterval);
    }

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [form, autoSave, autoSaveInterval]);

  // Computed Properties
  const fields = form?.fields || [];
  const selectedField = selectedFieldId ? fields.find(f => f.id === selectedFieldId) || null : null;
  const isFormValid = Object.keys(validationErrors).length === 0;
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Helper Functions
  const createDefaultForm = (initial?: Partial<Form>): Form => {
    const now = new Date().toISOString();
    
    return {
      id: '',
      name: initial?.name || 'فرم جدید',
      description: initial?.description || '',
      fields: initial?.fields || [],
      settings: {
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
      ...initial
    };
  };

  const generateFieldId = (): string => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addToHistory = (newForm: Form) => {
    if (isUpdatingFromHistory.current) return;

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ ...newForm });
      return newHistory.slice(-50); // Keep last 50 states
    });
    
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  };

  // Form Operations
  const updateForm = useCallback((updates: Partial<Form>) => {
    if (!form) return;

    const updatedForm = {
      ...form,
      ...updates,
      metadata: {
        ...form.metadata,
        updatedAt: new Date().toISOString(),
        ...updates.metadata
      }
    };

    setForm(updatedForm);
    addToHistory(updatedForm);
  }, [form]);

  const addField = useCallback((fieldType: FieldType, index?: number): string => {
    if (!form) return '';

    const newField = FormService.createField(fieldType, `فیلد ${fieldType}`);
    const newFields = [...fields];
    
    if (index !== undefined) {
      newFields.splice(index, 0, newField);
    } else {
      newFields.push(newField);
    }

    updateForm({ fields: newFields });
    setSelectedFieldId(newField.id);
    
    return newField.id;
  }, [form, fields, updateForm]);

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    if (!form) return;

    const updatedFields = fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );

    updateForm({ fields: updatedFields });
  }, [form, fields, updateForm]);

  const removeField = useCallback((fieldId: string) => {
    if (!form) return;

    const updatedFields = fields.filter(field => field.id !== fieldId);
    updateForm({ fields: updatedFields });

    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  }, [form, fields, selectedFieldId, updateForm]);

  const duplicateField = useCallback((fieldId: string): string => {
    if (!form) return '';

    const originalField = fields.find(f => f.id === fieldId);
    if (!originalField) return '';

    const duplicatedField: FormField = {
      ...originalField,
      id: generateFieldId(),
      label: `${originalField.label} - کپی`
    };

    const originalIndex = fields.findIndex(f => f.id === fieldId);
    const newFields = [...fields];
    newFields.splice(originalIndex + 1, 0, duplicatedField);

    updateForm({ fields: newFields });
    setSelectedFieldId(duplicatedField.id);

    return duplicatedField.id;
  }, [form, fields, updateForm]);

  const moveField = useCallback((fieldId: string, direction: 'up' | 'down') => {
    if (!form) return;

    const currentIndex = fields.findIndex(f => f.id === fieldId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    const newFields = [...fields];
    const [movedField] = newFields.splice(currentIndex, 1);
    newFields.splice(newIndex, 0, movedField);

    updateForm({ fields: newFields });
  }, [form, fields, updateForm]);

  const reorderFields = useCallback((fieldIds: string[]) => {
    if (!form || fieldIds.length !== fields.length) return;

    const reorderedFields = fieldIds.map(id => {
      const field = fields.find(f => f.id === id);
      if (!field) throw new Error(`Field not found: ${id}`);
      return field;
    });

    updateForm({ fields: reorderedFields });
  }, [form, fields, updateForm]);

  const selectField = useCallback((fieldId: string | null) => {
    setSelectedFieldId(fieldId);
  }, []);

  // Form CRUD Operations
  const saveForm = useCallback(async (): Promise<string | null> => {
    if (!form) return null;

    setIsSaving(true);
    
    try {
      let savedFormId: string;

      if (form.id) {
        // Update existing form
        await FormService.updateForm(form.id, form);
        savedFormId = form.id;
      } else {
        // Create new form
        const createDto: CreateFormDto = {
          name: form.name,
          description: form.description,
          fields: form.fields,
          settings: form.settings,
          styling: form.styling,
          metadata: form.metadata
        };
        
        savedFormId = await FormService.createForm(createDto);
        
        // Update form with new ID
        const updatedForm = { ...form, id: savedFormId };
        setForm(updatedForm);
      }

      setLastSaved(new Date());
      onSave?.(form);
      
      return savedFormId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطا در ذخیره فرم';
      onError?.(errorMessage);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [form, onSave, onError]);

  const loadForm = useCallback(async (formId: string) => {
    setIsLoading(true);
    
    try {
      const loadedForm = await FormService.getForm(formId);
      
      if (loadedForm) {
        setForm(loadedForm);
        setHistory([loadedForm]);
        setHistoryIndex(0);
        setSelectedFieldId(null);
        setValidationErrors({});
      } else {
        onError?.('فرم یافت نشد');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطا در بارگذاری فرم';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const resetForm = useCallback(() => {
    const newForm = createDefaultForm();
    setForm(newForm);
    setHistory([newForm]);
    setHistoryIndex(0);
    setSelectedFieldId(null);
    setValidationErrors({});
    setLastSaved(null);
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!form) return false;

    setIsValidating(true);

    try {
      const errors: Record<string, string[]> = {};
      
      // Validate form basic info
      if (!form.name.trim()) {
        errors.formName = ['نام فرم الزامی است'];
      }

      if (form.fields.length === 0) {
        errors.formFields = ['فرم باید حداقل یک فیلد داشته باشد'];
      }

      // Validate each field
      form.fields.forEach(field => {
        const fieldValidation = ValidationService.validateField(field, null);
        if (!fieldValidation.isValid) {
          errors[field.id] = fieldValidation.errors.map(e => e.message);
        }
      });

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    } catch (error) {
      onError?.('خطا در اعتبارسنجی فرم');
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [form, onError]);

  // Auto Save Function
  const performAutoSave = useCallback(async () => {
    if (!form || !form.id) return; // Only auto-save existing forms

    setIsAutoSaving(true);
    
    try {
      await FormService.updateForm(form.id, form);
      setLastSaved(new Date());
    } catch (error) {
      console.warn('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [form]);

  // Undo/Redo Functions
  const undo = useCallback(() => {
    if (!canUndo) return;

    const newIndex = historyIndex - 1;
    const previousForm = history[newIndex];
    
    if (previousForm) {
      isUpdatingFromHistory.current = true;
      setForm(previousForm);
      setHistoryIndex(newIndex);
      
      // Reset field selection if field no longer exists
      if (selectedFieldId && !previousForm.fields.find(f => f.id === selectedFieldId)) {
        setSelectedFieldId(null);
      }
      
      setTimeout(() => {
        isUpdatingFromHistory.current = false;
      }, 0);
    }
  }, [canUndo, historyIndex, history, selectedFieldId]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const newIndex = historyIndex + 1;
    const nextForm = history[newIndex];
    
    if (nextForm) {
      isUpdatingFromHistory.current = true;
      setForm(nextForm);
      setHistoryIndex(newIndex);
      
      // Reset field selection if field no longer exists
      if (selectedFieldId && !nextForm.fields.find(f => f.id === selectedFieldId)) {
        setSelectedFieldId(null);
      }
      
      setTimeout(() => {
        isUpdatingFromHistory.current = false;
      }, 0);
    }
  }, [canRedo, historyIndex, history, selectedFieldId]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, []);

  return {
    // Form State
    form,
    fields,
    selectedFieldId,
    selectedField,
    
    // Loading States
    isLoading,
    isSaving,
    isValidating,
    
    // Validation
    validationErrors,
    isFormValid,
    
    // Actions
    updateForm,
    addField,
    updateField,
    removeField,
    duplicateField,
    moveField,
    reorderFields,
    selectField,
    
    // Form Operations
    saveForm,
    loadForm,
    resetForm,
    validateForm,
    
    // Undo/Redo
    canUndo,
    canRedo,
    undo,
    redo,
    
    // Auto Save
    isAutoSaving,
    lastSaved
  };
};

/**
 * Hook برای مدیریت form data و submission
 */
export const useFormData = (formId: string) => {
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const loadResponses = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await FormService.getFormResponses(formId);
      setResponses(result.data);
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formId]);

  const loadStats = useCallback(async () => {
    try {
      const formStats = await FormService.getFormStats(formId);
      setStats(formStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, [formId]);

  useEffect(() => {
    if (formId) {
      loadResponses();
      loadStats();
    }
  }, [formId, loadResponses, loadStats]);

  const exportData = useCallback(async (format: 'json' | 'csv' | 'xlsx' = 'json') => {
    try {
      // TODO: Implement export functionality
      console.log(`Exporting data in ${format} format...`);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  }, []);

  const deleteResponse = useCallback(async (responseId: string) => {
    try {
      await FormService.deleteResponse(responseId, formId);
      await loadResponses(); // Reload responses
    } catch (error) {
      console.error('Error deleting response:', error);
    }
  }, [formId, loadResponses]);

  return {
    responses,
    stats,
    isLoading,
    loadResponses,
    loadStats,
    exportData,
    deleteResponse
  };
};

/**
 * Hook برای مدیریت form templates
 */
export const useFormTemplates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const loadTemplates = useCallback(async (category?: string) => {
    setIsLoading(true);
    try {
      const templateList = await FormService.getTemplates(category);
      setTemplates(templateList);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFromTemplate = useCallback(async (templateId: string, formName: string) => {
    try {
      const newFormId = await FormService.createFormFromTemplate(templateId, formName);
      return newFormId;
    } catch (error) {
      console.error('Error creating form from template:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    loadTemplates(selectedCategory);
  }, [selectedCategory, loadTemplates]);

  return {
    templates,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    loadTemplates,
    createFromTemplate
  };
};

/**
 * Hook برای مدیریت keyboard shortcuts
 */
export const useFormBuilderShortcuts = (
  actions: {
    save: () => void;
    undo: () => void;
    redo: () => void;
    copy: () => void;
    paste: () => void;
    delete: () => void;
  }
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const isInputField = (e.target as HTMLElement)?.tagName?.toLowerCase() === 'input' ||
                          (e.target as HTMLElement)?.tagName?.toLowerCase() === 'textarea';
      
      if (isInputField) return;

      // Ctrl/Cmd + S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        actions.save();
      }
      
      // Ctrl/Cmd + Z (Undo)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        actions.undo();
      }
      
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y (Redo)
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') ||
          ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        actions.redo();
      }
      
      // Ctrl/Cmd + C (Copy)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        actions.copy();
      }
      
      // Ctrl/Cmd + V (Paste)
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        actions.paste();
      }
      
      // Delete key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        actions.delete();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [actions]);
};

export default useFormBuilder;
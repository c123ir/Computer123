// src/modules/form-builder/components/FormBuilder/FormBuilder.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Save, X, RotateCcw, Eye, Settings as SettingsIcon } from 'lucide-react';
import { useFormBuilder, useFormBuilderShortcuts } from '../../hooks';
import { FormService } from '../../services/formService';
import SidePanel from './SidePanel';
import PreviewPanel from './PreviewPanel';
import { FieldType, FormField, Form, CreateFormDto, UpdateFormDto, FormSettings, FormStyling } from '../../types';
import { nanoid } from 'nanoid';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FieldsPanel from './FieldsPanel';
import SettingsPanel from './SettingsPanel';

/**
 * کامپوننت اصلی Form Builder
 */

interface FormBuilderProps {
  /** فرم برای ویرایش */
  form: Form;
  /** شناسه فرم برای ویرایش (اختیاری) */
  formId?: string;
  /** callback پس از ذخیره فرم */
  onSave?: (form: Form) => Promise<void>;
  /** callback پس از لغو */
  onCancel?: () => void;
  /** حالت فقط خواندنی */
  readonly?: boolean;
  initialForm?: Form;
}

const defaultSettings: FormSettings = {
  direction: 'rtl',
  theme: 'light',
  submitButtonText: 'ارسال',
  resetButtonText: 'پاک کردن',
  showResetButton: false,
  layout: 'vertical',
  spacing: 'md',
  showProgressBar: false,
  allowSaveDraft: true,
  showFieldNumbers: false,
  formWidth: 'medium'
};

const defaultStyling: FormStyling = {
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  borderColor: '#e5e7eb',
  borderRadius: 8,
  padding: 'md',
  margin: 'md',
  shadow: 'sm'
};

const defaultMetadata = {
  status: 'draft',
  version: 1
};

export const FormBuilder: React.FC<FormBuilderProps> = ({
  form,
  formId,
  onSave,
  onCancel,
  readonly = false,
  initialForm
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [selectedField, setSelectedField] = useState<string | undefined>();
  
  // Memoize callbacks
  const handleFormSave = useCallback(async (form: Form) => {
    try {
      // اگر فرم جدید است
      if (!form.id) {
        const createDto: CreateFormDto = {
          name: form.name || 'فرم جدید',
          title: form.title || 'فرم جدید',
          description: form.description || '',
          fields: form.fields || [],
          settings: { ...defaultSettings, ...form.settings },
          styling: { ...defaultStyling, ...form.styling },
          metadata: { ...defaultMetadata, ...form.metadata }
        };
        const newFormId = await FormService.createForm(createDto);
        const newForm = {
          ...form,
          id: newFormId
        };
        onSave?.(newForm);
        return;
      }
      
      // بروزرسانی فرم موجود
      const updateDto: UpdateFormDto = {
        name: form.name,
        description: form.description,
        fields: form.fields || [],
        settings: form.settings,
        styling: form.styling,
        metadata: {
          ...form.metadata,
          updatedAt: new Date().toISOString()
        }
      };
      const updatedForm = await FormService.updateForm(form.id, updateDto);
      if (updatedForm) {
        onSave?.(form);
      }
    } catch (error) {
      console.error('Error saving form:', error);
      throw error;
    }
  }, [onSave]);

  const handleFormError = useCallback((error: Error | string) => {
    console.error('Form builder error:', error);
  }, []);
  
  // استفاده از hook اصلی
  const {
    fields,
    isLoading,
    isSaving,
    isAutoSaving,
    lastSaved,
    isFormValid,
    validationErrors,
    canUndo,
    canRedo,
    addField,
    updateField,
    removeField,
    duplicateField,
    moveField,
    reorderFields,
    selectField,
    saveForm,
    resetForm,
    validateForm,
    undo,
    redo,
    handleFieldDrop
  } = useFormBuilder({
    formId,
    autoSave: true,
    autoSaveInterval: 30000,
    onSave: handleFormSave,
    onError: handleFormError
  });

  // ایجاد پنل پیش‌فرض برای فرم جدید
  useEffect(() => {
    if (!formId && !form.id && fields.length === 0) {
      console.log('Creating default panel for new form');
      const defaultPanelId = addField('panel');
      selectField(defaultPanelId);
    }
  }, [formId, form.id]);

  // اضافه کردن فیلد جدید
  const handleAddField = useCallback((type: FieldType, parentId?: string): string => {
    const newField: FormField = {
      id: nanoid(),
      type,
      label: `فیلد ${type}`,
      name: `field_${nanoid(6)}`,
      order: form.fields.length + 1,
      required: false,
      disabled: false,
      readonly: false,
      validation: {
        required: false
      },
      styling: {
        width: '100%'
      },
      parentId,
      fieldSettings: type === 'panel' ? {
        panelSettings: {
          title: 'پنل جدید',
          columns: 1,
          collapsible: true,
          defaultCollapsed: false,
          padding: 'md',
          margin: 'md',
          shadow: 'md',
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
          borderRadius: 8,
          backgroundOpacity: 1
        }
      } : undefined
    };

    const updatedForm = {
      ...form,
      fields: [...form.fields, newField]
    };

    addField(type, parentId);
    setSelectedField(newField.id);
    return newField.id;
  }, [form, addField, setSelectedField]);

  // حذف فیلد
  const handleDeleteField = useCallback((fieldId: string) => {
    const updatedFields = form.fields.filter(field => {
      // حذف فیلد و تمام فیلدهای داخل آن (اگر پنل باشد)
      if (field.id === fieldId || field.parentId === fieldId) {
        return false;
      }
      return true;
    });

    const updatedForm = {
      ...form,
      fields: updatedFields
    };

    removeField(fieldId);
    if (selectedField === fieldId) {
      setSelectedField(undefined);
    }
  }, [form, removeField, selectedField]);

  // کپی فیلد
  const handleDuplicateField = useCallback((fieldId: string) => {
    const field = form.fields.find(f => f.id === fieldId);
    if (!field) return;

    const newField: FormField = {
      ...field,
      id: nanoid(),
      name: `${field.name}_copy`,
      label: `${field.label} (کپی)`,
      order: form.fields.length + 1
    };

    const updatedForm = {
      ...form,
      fields: [...form.fields, newField]
    };

    duplicateField(fieldId);
    setSelectedField(newField.id);
  }, [form, duplicateField, selectedField]);

  // جابجایی فیلد
  const handleMoveField = useCallback((fieldId: string, direction: 'up' | 'down') => {
    const fieldIndex = form.fields.findIndex(f => f.id === fieldId);
    if (fieldIndex === -1) return;

    const field = form.fields[fieldIndex];
    const siblingFields = form.fields.filter(f => f.parentId === field.parentId);
    const siblingIndex = siblingFields.findIndex(f => f.id === fieldId);

    if (direction === 'up' && siblingIndex > 0) {
      const prevField = siblingFields[siblingIndex - 1];
      const updatedFields = form.fields.map(f => {
        if (f.id === fieldId) {
          return { ...f, order: prevField.order };
        }
        if (f.id === prevField.id) {
          return { ...f, order: field.order };
        }
        return f;
      });

      const updatedForm = {
        ...form,
        fields: updatedFields.sort((a, b) => a.order - b.order)
      };

      moveField(fieldId, updatedFields.findIndex(f => f.id === fieldId));
    } else if (direction === 'down' && siblingIndex < siblingFields.length - 1) {
      const nextField = siblingFields[siblingIndex + 1];
      const updatedFields = form.fields.map(f => {
        if (f.id === fieldId) {
          return { ...f, order: nextField.order };
        }
        if (f.id === nextField.id) {
          return { ...f, order: field.order };
        }
        return f;
      });

      const updatedForm = {
        ...form,
        fields: updatedFields.sort((a, b) => a.order - b.order)
      };

      moveField(fieldId, updatedFields.findIndex(f => f.id === fieldId));
    }
  }, [form, moveField]);

  // بروزرسانی فیلد
  const handleFieldUpdate = useCallback((fieldId: string, updates: Partial<FormField>) => {
    const updatedFields = form.fields.map(field => {
      if (field.id === fieldId) {
        return {
          ...field,
          ...updates
        };
      }
      return field;
    });

    const updatedForm = {
      ...form,
      fields: updatedFields
    };

    updateField(fieldId, updates);
  }, [form, updateField]);

  // رها کردن فیلد در پنل
  const handleFieldDropInPanel = useCallback((fieldId: string, panelId: string) => {
    if (!readonly) {
      console.log('Dropping field', fieldId, 'into panel', panelId);
      handleFieldDrop(fieldId, panelId);
    }
  }, [handleFieldDrop, readonly]);

  // Handle save
  const handleSave = async () => {
    if (!readonly && validateForm()) {
      await saveForm();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Handle reset
  const handleReset = () => {
    if (!readonly) {
      setShowResetConfirm(true);
    }
  };
  
  const confirmReset = () => {
    resetForm();
    setShowResetConfirm(false);
  };

  if (isLoading) {
    return (
      <div className="form-builder min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="form-builder min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">خطا در بارگذاری فرم</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full bg-gray-50 dark:bg-gray-900">
        <FieldsPanel
          onAddField={handleAddField}
        />
        <PreviewPanel
          form={form}
          fields={fields}
          selectedField={selectedField}
          onFieldSelect={setSelectedField}
          onFieldDrop={handleFieldDropInPanel}
          onAddField={handleAddField}
          onDeleteField={handleDeleteField}
          onDuplicateField={handleDuplicateField}
          onMoveField={handleMoveField}
          readonly={readonly}
        />
        <SettingsPanel
          selectedField={selectedField}
          field={fields.find(f => f.id === selectedField) || fields[0]}
          onUpdate={updateField}
          onSave={handleSave}
          onCancel={handleCancel}
          readonly={readonly}
        />
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
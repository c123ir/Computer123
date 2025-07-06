// src/modules/form-builder/components/FormBuilder/FormBuilder.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Save, X, RotateCcw, Eye, Settings as SettingsIcon } from 'lucide-react';
import { useFormBuilder, useFormBuilderShortcuts } from '../../hooks';
import { FormService } from '../../services/formService';
import SidePanel from './SidePanel';
import PreviewPanel from './PreviewPanel';
import { FieldType, FormField, Form, CreateFormDto, UpdateFormDto, FormSettings } from '../../types';
import { nanoid } from 'nanoid';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

/**
 * کامپوننت اصلی Form Builder
 */

interface FormBuilderProps {
  /** شناسه فرم برای ویرایش (اختیاری) */
  formId?: string;
  /** callback پس از ذخیره فرم */
  onSave?: (formId: string) => void;
  /** callback پس از لغو */
  onCancel?: () => void;
  /** حالت فقط خواندنی */
  readonly?: boolean;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  formId,
  onSave,
  onCancel,
  readonly = false
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [selectedField, setSelectedField] = useState<string | undefined>();
  
  // Memoize callbacks
  const handleFormSave = useCallback(async (form: Form) => {
    try {
      // اگر فرم جدید است
      if (!form.id) {
        const defaultSettings: FormSettings = {
          direction: 'rtl',
          theme: 'light',
          submitButtonText: 'ارسال',
          showProgressBar: false,
          allowSaveDraft: true,
          showFieldNumbers: false,
          formWidth: 'medium'
        };

        const defaultStyling = {
          theme: 'default',
          backgroundColor: '#ffffff',
          textColor: '#374151',
          primaryColor: '#3b82f6',
          fontFamily: 'Vazirmatn',
          fontSize: 14,
          borderRadius: 8,
          spacing: 'normal'
        };

        const defaultMetadata = {
          createdBy: 'current-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'draft' as const,
          version: 1
        };

        const createDto: CreateFormDto = {
          name: form.name || 'فرم جدید',
          description: form.description || '',
          fields: form.fields || [],
          settings: { ...defaultSettings, ...form.settings },
          styling: { ...defaultStyling, ...form.styling },
          metadata: { ...defaultMetadata, ...form.metadata }
        };
        const newFormId = await FormService.createForm(createDto);
        onSave?.(newFormId);
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
        onSave?.(form.id);
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
    form,
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
      label: 'فیلد جدید',
      name: `field_${nanoid(6)}`,
      order: form.fields.length + 1,
      required: false,
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
      <div className="form-builder min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {form.name || 'فرم بدون نام'}
                    </h1>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>{fields.length} فیلد</span>
                      <span>•</span>
                      <span>وضعیت: {form.metadata?.status === 'draft' ? 'پیش‌نویس' : 'منتشر شده'}</span>
                      {lastSaved && (
                        <>
                          <span>•</span>
                          <span>آخرین ذخیره: {lastSaved.toLocaleTimeString('fa-IR')}</span>
                        </>
                      )}
                      {isAutoSaving && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600 dark:text-blue-400">در حال ذخیره...</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Validation Errors Indicator */}
                  {Object.keys(validationErrors).length > 0 && (
                    <div className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-xs">
                      {Object.keys(validationErrors).length} خطا
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                {/* Undo/Redo */}
                {!readonly && (
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <button
                      onClick={undo}
                      disabled={!canUndo}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      title="بازگردانی (Ctrl+Z)"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={redo}
                      disabled={!canRedo}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      title="تکرار (Ctrl+Y)"
                    >
                      <RotateCcw className="w-4 h-4 scale-x-[-1]" />
                    </button>
                  </div>
                )}

                {/* Reset */}
                {!readonly && (
                  <button
                    onClick={handleReset}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                    title="بازنشانی فرم"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Preview */}
                <button
                  className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  title="پیش‌نمایش تمام صفحه"
                >
                  <Eye className="w-4 h-4" />
                  <span>پیش‌نمایش</span>
                </button>

                {/* Cancel */}
                {onCancel && (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    لغو
                  </button>
                )}

                {/* Save */}
                {!readonly && (
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !isFormValid}
                    className="flex items-center space-x-2 space-x-reverse px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره فرم'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Preview Panel */}
          <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-hidden">
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
              onFieldDrop={handleFieldDropInPanel}
              readonly={readonly}
            />
          </div>

          {/* Side Panel */}
          <div className="w-80">
            <SidePanel
              selectedField={selectedField || undefined}
              onFieldSelect={handleAddField}
              onFieldUpdate={handleFieldUpdate}
              readonly={readonly}
            />
          </div>
        </div>

        {/* Floating Status Bar */}
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-2 z-50">
          <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1 space-x-reverse">
              <SettingsIcon className="w-3 h-3" />
              <span>فیلد انتخاب شده: {selectedField?.label || 'هیچکدام'}</span>
            </div>
            
            {Object.keys(validationErrors).length > 0 && (
              <div className="text-red-600 dark:text-red-400">
                {Object.keys(validationErrors).length} خطا موجود
              </div>
            )}
            
            <div className="text-green-600 dark:text-green-400">
              Ctrl+S ذخیره • Ctrl+Z بازگردانی
            </div>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                تأیید بازنشانی
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                آیا از بازنشانی فرم اطمینان دارید؟ تمام تغییرات از دست خواهد رفت.
              </p>
              <div className="flex justify-end space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                >
                  لغو
                </button>
                <button
                  onClick={confirmReset}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  بازنشانی
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
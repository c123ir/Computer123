// src/modules/form-builder/components/FormBuilder/FormBuilder.tsx

import React from 'react';

/**
 * کامپوننت اصلی Form Builder
 * این کامپوننت شامل سه پنل اصلی است:
 * 1. FieldsPanel - پنل فیلدهای قابل استفاده (سمت چپ)
 * 2. PreviewPanel - پنل پیش‌نمایش فرم (وسط)
 * 3. SettingsPanel - پنل تنظیمات فیلد انتخاب شده (سمت راست)
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
  return (
    <div className="form-builder min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formId ? 'ویرایش فرم' : 'ایجاد فرم جدید'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                فرم خود را با کشیدن و رها کردن فیلدها بسازید
              </p>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              {!readonly && (
                <>
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    لغو
                  </button>
                  <button
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    ذخیره فرم
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Fields Panel - سمت چپ */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              فیلدهای فرم
            </h3>
            
            {/* TODO: FieldsPanel component */}
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Fields Panel
                  <br />
                  (در حال توسعه)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel - وسط */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              {/* Form Preview Container */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 min-h-96">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    پیش‌نمایش فرم
                  </h3>
                  
                  {/* TODO: PreviewPanel component */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Preview Panel
                      <br />
                      فیلدهای فرم اینجا نمایش داده می‌شوند
                      <br />
                      (در حال توسعه)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel - سمت راست */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              تنظیمات فیلد
            </h3>
            
            {/* TODO: SettingsPanel component */}
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Settings Panel
                  <br />
                  تنظیمات فیلد انتخاب شده
                  <br />
                  (در حال توسعه)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
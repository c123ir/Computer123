// src/modules/form-builder/components/FormBuilder/SettingsPanel.tsx

import React, { useState, useCallback } from 'react';
import {
  Settings, Type, Palette, Plus, Minus, 
  Asterisk, HelpCircle, Trash2, ChevronRight,
  Save, X, Check, AlertCircle, Columns, Layout
} from 'lucide-react';
import { FormField, ValidationRules, FieldStyling, PanelSettings, FieldOption } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelSettings as ImportedPanelSettings } from '../Settings/PanelSettings';

/**
 * پنل تنظیمات فیلد انتخاب شده
 * شامل تنظیمات عمومی، اعتبارسنجی، ظاهری و شرطی
 */

interface SettingsPanelProps {
  /** فیلد انتخاب شده */
  selectedField: string | undefined;
  /** فیلد برای ویرایش */
  field: FormField;
  /** callback تغییر تنظیمات فیلد */
  onUpdate: (fieldId: string, updates: Partial<FormField>) => void;
  /** حالت فقط خواندنی */
  readonly?: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  selectedField,
  field,
  onUpdate,
  readonly = false,
  onSave,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState<'field' | 'validation' | 'style'>('field');
  const [isDirty, setIsDirty] = useState(false);

  const handleTabChange = useCallback((tab: 'field' | 'validation' | 'style') => {
    setActiveTab(tab);
  }, []);

  // update field helper
  const updateField = useCallback((updates: Partial<FormField>) => {
    if (!readonly && selectedField) {
      setIsDirty(true);
      onUpdate(selectedField, updates);
    }
  }, [readonly, selectedField, onUpdate]);

  if (!selectedField) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
        <div className="text-center text-gray-500 dark:text-gray-400">
          یک فیلد را انتخاب کنید
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => handleTabChange('field')}
          className={`
            flex-1 py-3 text-sm font-medium
            ${activeTab === 'field'
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          تنظیمات فیلد
        </button>
        <button
          onClick={() => handleTabChange('validation')}
          className={`
            flex-1 py-3 text-sm font-medium
            ${activeTab === 'validation'
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          اعتبارسنجی
        </button>
        <button
          onClick={() => handleTabChange('style')}
          className={`
            flex-1 py-3 text-sm font-medium
            ${activeTab === 'style'
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          ظاهر
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'field' && (
          <div>
            <GeneralSettings
              field={field}
              onUpdate={updateField}
              readonly={readonly}
            />
          </div>
        )}
        {activeTab === 'validation' && (
          <div>
            <ValidationSettings
              field={field}
              onUpdate={updateField}
              readonly={readonly}
            />
          </div>
        )}
        {activeTab === 'style' && (
          <div>
            <StylingSettings
              field={field}
              onUpdate={updateField}
              readonly={readonly}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200"
          >
            لغو
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            ذخیره
          </button>
        </div>
      </div>
    </div>
  );
};

// General Settings Component
const GeneralSettings: React.FC<{
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  readonly: boolean;
}> = ({ field, onUpdate, readonly }) => {
  const addOption = () => {
    const newOption: FieldOption = {
      id: `option_${Date.now()}`,
      label: `گزینه ${(field.options?.length || 0) + 1}`,
      value: `option_${Date.now()}`
    };
    
    onUpdate({
      options: [...(field.options || []), newOption]
    });
  };

  const updateOption = (index: number, updates: Partial<FieldOption>) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = { ...newOptions[index], ...updates };
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = [...(field.options || [])];
    newOptions.splice(index, 1);
    onUpdate({ options: newOptions });
  };

  return (
    <div className="space-y-6">
      {/* Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          برچسب فیلد
        </label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          disabled={readonly}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800
                   text-gray-900 dark:text-white 
                   placeholder-gray-500 dark:placeholder-gray-400
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:opacity-60 disabled:cursor-not-allowed
                   transition-all duration-200"
          placeholder="برچسب فیلد را وارد کنید"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          توضیحات
        </label>
        <textarea
          value={field.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          disabled={readonly}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800
                   text-gray-900 dark:text-white 
                   placeholder-gray-500 dark:placeholder-gray-400
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:opacity-60 disabled:cursor-not-allowed
                   transition-all duration-200
                   min-h-[100px] resize-y"
          placeholder="توضیحات اختیاری برای راهنمایی کاربر"
        />
      </div>

      {/* Required */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="required"
          checked={field.required}
          onChange={(e) => onUpdate({ required: e.target.checked })}
          disabled={readonly}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded
                   focus:ring-blue-500 dark:focus:ring-blue-600 
                   dark:ring-offset-gray-800 dark:bg-gray-700 
                   dark:border-gray-600"
        />
        <label htmlFor="required" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          فیلد اجباری
        </label>
      </div>

      {/* Options (for select, radio, checkbox) */}
      {['select', 'radio', 'checkbox'].includes(field.type) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              گزینه‌ها
            </label>
            {!readonly && (
              <button
                onClick={addOption}
                className="inline-flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                افزودن گزینه
              </button>
            )}
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {(field.options || []).map((option, index) => (
                <motion.div
                  key={option.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => updateOption(index, { label: e.target.value })}
                      disabled={readonly}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-800
                               text-gray-900 dark:text-white 
                               placeholder-gray-500 dark:placeholder-gray-400
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               disabled:opacity-60 disabled:cursor-not-allowed
                               transition-all duration-200"
                      placeholder={`گزینه ${index + 1}`}
                    />
                  </div>
                  {!readonly && (
                    <button
                      onClick={() => removeOption(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

// Validation Settings Component
const ValidationSettings: React.FC<{
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  readonly: boolean;
}> = ({ field, onUpdate, readonly }) => {
  const updateValidation = (updates: Partial<ValidationRules>) => {
    onUpdate({
      validation: {
        ...field.validation,
        ...updates
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Text Length Validation */}
      {['text', 'textarea', 'email', 'tel', 'url'].includes(field.type) && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              حداقل طول
            </label>
            <input
              type="number"
              min="0"
              value={field.validation.minLength || ''}
              onChange={(e) => updateValidation({ minLength: parseInt(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={readonly}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              حداکثر طول
            </label>
            <input
              type="number"
              min="1"
              value={field.validation.maxLength || ''}
              onChange={(e) => updateValidation({ maxLength: parseInt(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={readonly}
            />
          </div>
        </>
      )}

      {/* Number Range Validation */}
      {field.type === 'number' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              حداقل مقدار
            </label>
            <input
              type="number"
              value={field.validation.min || ''}
              onChange={(e) => updateValidation({ min: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={readonly}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              حداکثر مقدار
            </label>
            <input
              type="number"
              value={field.validation.max || ''}
              onChange={(e) => updateValidation({ max: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={readonly}
            />
          </div>
        </>
      )}

      {/* File Validation */}
      {field.type === 'file' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              انواع فایل مجاز (با کاما جدا کنید)
            </label>
            <input
              type="text"
              value={field.validation.fileTypes?.join(', ') || ''}
              onChange={(e) => updateValidation({ 
                fileTypes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              placeholder="jpg, png, pdf"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={readonly}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              حداکثر اندازه فایل (مگابایت)
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={field.validation.maxFileSize ? (field.validation.maxFileSize / (1024 * 1024)).toFixed(1) : ''}
              onChange={(e) => updateValidation({ 
                maxFileSize: parseFloat(e.target.value) * 1024 * 1024 || undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={readonly}
            />
          </div>
        </>
      )}

      {/* Custom Pattern */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          الگوی سفارشی (RegEx)
        </label>
        <input
          type="text"
          value={field.validation.pattern || ''}
          onChange={(e) => updateValidation({ pattern: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          disabled={readonly}
          placeholder="^[0-9]+$"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          برای اعتبارسنجی پیشرفته از Regular Expression استفاده کنید
        </p>
      </div>

      {/* Custom Pattern Message */}
      {field.validation.pattern && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            پیام خطای الگو
          </label>
          <input
            type="text"
            value={field.validation.patternMessage || ''}
            onChange={(e) => updateValidation({ patternMessage: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={readonly}
            placeholder="فرمت وارد شده صحیح نیست"
          />
        </div>
      )}
    </div>
  );
};

// Styling Settings Component
const StylingSettings: React.FC<{
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  readonly: boolean;
}> = ({ field, onUpdate, readonly }) => {
  const updateStyling = (updates: Partial<FieldStyling>) => {
    onUpdate({
      styling: {
        ...field.styling,
        ...updates
      }
    });
  };

  const widthOptions = [
    { value: '25%', label: '۱/۴ عرض' },
    { value: '50%', label: '۱/۲ عرض' },
    { value: '75%', label: '۳/۴ عرض' },
    { value: '100%', label: 'تمام عرض' }
  ];

  return (
    <div className="space-y-6">
      {/* Width */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          عرض فیلد
        </label>
        <div className="grid grid-cols-2 gap-2">
          {widthOptions.map(option => (
            <button
              key={option.value}
              onClick={() => updateStyling({ width: option.value as any })}
              disabled={readonly}
              className={`p-2 text-sm rounded-md border transition-colors ${
                field.styling.width === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          رنگ پس‌زمینه
        </label>
        <div className="flex items-center space-x-2 space-x-reverse">
          <input
            type="color"
            value={field.styling.backgroundColor || '#ffffff'}
            onChange={(e) => updateStyling({ backgroundColor: e.target.value })}
            disabled={readonly}
            className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-md"
          />
          <input
            type="text"
            value={field.styling.backgroundColor || ''}
            onChange={(e) => updateStyling({ backgroundColor: e.target.value })}
            disabled={readonly}
            placeholder="#ffffff"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          رنگ متن
        </label>
        <div className="flex items-center space-x-2 space-x-reverse">
          <input
            type="color"
            value={field.styling.textColor || '#000000'}
            onChange={(e) => updateStyling({ textColor: e.target.value })}
            disabled={readonly}
            className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-md"
          />
          <input
            type="text"
            value={field.styling.textColor || ''}
            onChange={(e) => updateStyling({ textColor: e.target.value })}
            disabled={readonly}
            placeholder="#000000"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Border Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          رنگ حاشیه
        </label>
        <div className="flex items-center space-x-2 space-x-reverse">
          <input
            type="color"
            value={field.styling.borderColor || '#d1d5db'}
            onChange={(e) => updateStyling({ borderColor: e.target.value })}
            disabled={readonly}
            className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-md"
          />
          <input
            type="text"
            value={field.styling.borderColor || ''}
            onChange={(e) => updateStyling({ borderColor: e.target.value })}
            disabled={readonly}
            placeholder="#d1d5db"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          شعاع گوشه‌ها: {field.styling.borderRadius || 0}px
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={field.styling.borderRadius || 0}
          onChange={(e) => updateStyling({ borderRadius: parseInt(e.target.value) })}
          disabled={readonly}
          className="w-full"
        />
      </div>

      {/* Padding */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          فاصله داخلی: {field.styling.padding || 0}px
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={field.styling.padding || 0}
          onChange={(e) => updateStyling({ padding: parseInt(e.target.value) })}
          disabled={readonly}
          className="w-full"
        />
      </div>

      {/* Margin */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          فاصله خارجی: {field.styling.margin || 0}px
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={field.styling.margin || 0}
          onChange={(e) => updateStyling({ margin: parseInt(e.target.value) })}
          disabled={readonly}
          className="w-full"
        />
      </div>

      {/* Custom CSS Class */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          کلاس CSS سفارشی
        </label>
        <input
          type="text"
          value={field.styling.className || ''}
          onChange={(e) => updateStyling({ className: e.target.value })}
          disabled={readonly}
          placeholder="my-custom-class"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          کلاس‌های CSS اضافی برای استایل‌دهی پیشرفته
        </p>
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          پیش‌نمایش استایل
        </label>
        <div 
          className="p-3 border rounded-md"
          style={{
            backgroundColor: field.styling.backgroundColor,
            color: field.styling.textColor,
            borderColor: field.styling.borderColor,
            borderRadius: `${field.styling.borderRadius || 0}px`,
            padding: `${field.styling.padding || 8}px`,
            margin: `${field.styling.margin || 0}px`
          }}
        >
          نمونه متن با استایل اعمال شده
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
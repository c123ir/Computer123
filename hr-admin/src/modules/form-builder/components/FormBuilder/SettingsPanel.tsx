// src/modules/form-builder/components/FormBuilder/SettingsPanel.tsx

import React, { useState } from 'react';
import {
  Settings, Type, Palette, Plus, Minus, 
  Asterisk, HelpCircle
} from 'lucide-react';
import { FormField, ValidationRules, FieldStyling, FieldOption } from '../../types';

/**
 * پنل تنظیمات فیلد انتخاب شده
 * شامل تنظیمات عمومی، اعتبارسنجی، ظاهری و شرطی
 */

interface SettingsPanelProps {
  /** فیلد انتخاب شده */
  selectedField?: FormField;
  /** callback تغییر تنظیمات فیلد */
  onFieldUpdate?: (fieldId: string, updates: Partial<FormField>) => void;
  /** حالت فقط خواندنی */
  readonly?: boolean;
}

type SettingsTab = 'general' | 'validation' | 'styling' | 'advanced';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  selectedField,
  onFieldUpdate,
  readonly = false
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // اگر فیلد انتخاب نشده
  if (!selectedField) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            تنظیمات فیلد
          </h3>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Settings className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
              فیلدی انتخاب نشده
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              برای ویرایش تنظیمات، یک فیلد را از پیش‌نمایش انتخاب کنید
            </p>
          </div>
        </div>
      </div>
    );
  }

  // update field helper
  const updateField = (updates: Partial<FormField>) => {
    if (!readonly && selectedField) {
      onFieldUpdate?.(selectedField.id, updates);
    }
  };

  // tabs configuration
  const tabs = [
    { id: 'general' as SettingsTab, label: 'عمومی', icon: Type },
    { id: 'validation' as SettingsTab, label: 'اعتبارسنجی', icon: Asterisk },
    { id: 'styling' as SettingsTab, label: 'ظاهری', icon: Palette },
    { id: 'advanced' as SettingsTab, label: 'پیشرفته', icon: Settings },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          تنظیمات فیلد
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {selectedField.label} ({selectedField.type})
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-3 text-xs font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'general' && (
          <GeneralSettings
            field={selectedField}
            onUpdate={updateField}
            readonly={readonly}
          />
        )}
        
        {activeTab === 'validation' && (
          <ValidationSettings
            field={selectedField}
            onUpdate={updateField}
            readonly={readonly}
          />
        )}
        
        {activeTab === 'styling' && (
          <StylingSettings
            field={selectedField}
            onUpdate={updateField}
            readonly={readonly}
          />
        )}
        
        {activeTab === 'advanced' && (
          <AdvancedSettings
            field={selectedField}
            onUpdate={updateField}
            readonly={readonly}
          />
        )}
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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          disabled={readonly}
        />
      </div>

      {/* Placeholder */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          متن راهنما (Placeholder)
        </label>
        <input
          type="text"
          value={field.placeholder || ''}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          disabled={readonly}
        />
      </div>

      {/* Help Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          متن کمکی
        </label>
        <textarea
          value={field.helpText || ''}
          onChange={(e) => onUpdate({ helpText: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          disabled={readonly}
        />
      </div>

      {/* Required Toggle */}
      <div>
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            فیلد اجباری
          </span>
          <button
            onClick={() => onUpdate({ required: !field.required })}
            disabled={readonly}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              field.required ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                field.required ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
      </div>

      {/* Default Value */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          مقدار پیش‌فرض
        </label>
        <input
          type="text"
          value={field.defaultValue || ''}
          onChange={(e) => onUpdate({ defaultValue: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          disabled={readonly}
        />
      </div>

      {/* Options for select, radio, checkbox */}
      {['select', 'radio', 'checkbox'].includes(field.type) && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              گزینه‌ها
            </label>
            {!readonly && (
              <button
                onClick={addOption}
                className="flex items-center space-x-1 space-x-reverse text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن</span>
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={option.id} className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => updateOption(index, { label: e.target.value })}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="نام گزینه"
                  disabled={readonly}
                />
                {!readonly && field.options && field.options.length > 1 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Field Settings based on type */}
      {field.type === 'textarea' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            تعداد خطوط
          </label>
          <input
            type="number"
            min="2"
            max="20"
            value={field.fieldSettings?.rows || 4}
            onChange={(e) => onUpdate({
              fieldSettings: {
                ...field.fieldSettings,
                rows: parseInt(e.target.value)
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={readonly}
          />
        </div>
      )}

      {field.type === 'rating' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            حداکثر امتیاز
          </label>
          <input
            type="number"
            min="3"
            max="10"
            value={field.fieldSettings?.maxRating || 5}
            onChange={(e) => onUpdate({
              fieldSettings: {
                ...field.fieldSettings,
                maxRating: parseInt(e.target.value)
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={readonly}
          />
        </div>
      )}

      {field.type === 'file' && (
        <div>
          <label className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              انتخاب چندین فایل
            </span>
            <button
              onClick={() => onUpdate({
                fieldSettings: {
                  ...field.fieldSettings,
                  multiple: !field.fieldSettings?.multiple
                }
              })}
              disabled={readonly}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                field.fieldSettings?.multiple ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  field.fieldSettings?.multiple ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
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

// Advanced Settings Component
const AdvancedSettings: React.FC<{
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  readonly: boolean;
}> = ({ field, onUpdate, readonly }) => {
  return (
    <div className="space-y-6">
      {/* Field ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          شناسه فیلد
        </label>
        <input
          type="text"
          value={field.id}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
          disabled
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          شناسه یکتا فیلد - قابل تغییر نیست
        </p>
      </div>

      {/* Disabled State */}
      <div>
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            غیرفعال
          </span>
          <button
            onClick={() => onUpdate({ disabled: !field.disabled })}
            disabled={readonly}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              field.disabled ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                field.disabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          فیلد غیرفعال قابل ویرایش نیست
        </p>
      </div>

      {/* Read Only State */}
      <div>
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            فقط خواندنی
          </span>
          <button
            onClick={() => onUpdate({ readonly: !field.readonly })}
            disabled={readonly}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              field.readonly ? 'bg-yellow-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                field.readonly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          فیلد فقط خواندنی قابل تغییر نیست ولی می‌تواند انتخاب شود
        </p>
      </div>

      {/* Conditional Logic */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          منطق شرطی
        </label>
        <div className="p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
          <HelpCircle className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            در نسخه‌های آینده
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            نمایش/عدم نمایش فیلد بر اساس مقادیر سایر فیلدها
          </p>
        </div>
      </div>

      {/* Custom Attributes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ویژگی‌های HTML سفارشی
        </label>
        <textarea
          value=""
          placeholder='{"data-custom": "value", "aria-label": "custom label"}'
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          rows={3}
          disabled={readonly}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          ویژگی‌های HTML اضافی به فرمت JSON
        </p>
      </div>

      {/* Tab Index */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ترتیب Tab
        </label>
        <input
          type="number"
          min="-1"
          value=""
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          disabled={readonly}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          ترتیب فوکوس با کلید Tab (-1 برای عدم دسترسی)
        </p>
      </div>

      {/* Analytics */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          آمار و تحلیل
        </label>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
            <div className="font-medium text-gray-700 dark:text-gray-300">تعامل</div>
            <div className="text-gray-500 dark:text-gray-400">0 کلیک</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
            <div className="font-medium text-gray-700 dark:text-gray-300">تکمیل</div>
            <div className="text-gray-500 dark:text-gray-400">0%</div>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          دسترسی‌پذیری
        </label>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">ARIA Label</span>
            <span className="text-green-600 dark:text-green-400">✓</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Keyboard Navigation</span>
            <span className="text-green-600 dark:text-green-400">✓</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Screen Reader</span>
            <span className="text-green-600 dark:text-green-400">✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
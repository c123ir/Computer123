// src/modules/form-builder/components/FormBuilder/PreviewPanel.tsx

import React, { useState } from 'react';
import { 
  Eye, Smartphone, Tablet, Monitor, RotateCcw, Settings, 
  Trash2, Copy, MoveUp, MoveDown, GripVertical, Upload, PenTool, Star 
} from 'lucide-react';
import { FormField, Form, FieldType } from '../../types';

/**
 * پنل پیش‌نمایش فرم
 * نمایش فرم در حالت real-time و قابلیت drag & drop
 */

interface PreviewPanelProps {
  /** فرم برای نمایش */
  form?: Partial<Form>;
  /** فیلدهای فرم */
  fields: FormField[];
  /** فیلد انتخاب شده */
  selectedField?: string;
  /** callback تغییر فیلد انتخاب شده */
  onFieldSelect?: (fieldId: string) => void;
  /** callback اضافه کردن فیلد جدید */
  onAddField?: (fieldType: FieldType, index?: number) => void;
  /** callback حذف فیلد */
  onDeleteField?: (fieldId: string) => void;
  /** callback کپی فیلد */
  onDuplicateField?: (fieldId: string) => void;
  /** callback جابجایی فیلد */
  onMoveField?: (fieldId: string, direction: 'up' | 'down') => void;
  /** callback تغییر ترتیب فیلدها */
  onReorderFields?: (newOrder: string[]) => void;
  /** حالت فقط خواندنی */
  readonly?: boolean;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  form,
  fields = [],
  selectedField,
  onFieldSelect,
  onAddField,
  onDeleteField,
  onDuplicateField,
  onMoveField,
  onReorderFields,
  readonly = false
}) => {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [showSettings, setShowSettings] = useState(true);

  // تنظیمات viewport
  const viewportConfig = {
    desktop: { width: '100%', maxWidth: 'none', icon: Monitor },
    tablet: { width: '768px', maxWidth: '768px', icon: Tablet },
    mobile: { width: '375px', maxWidth: '375px', icon: Smartphone }
  };

  // handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (readonly) return;

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (data.type === 'field' && data.fieldType) {
        onAddField?.(data.fieldType as FieldType);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // render field
  const renderField = (field: FormField, index: number) => {
    const isSelected = selectedField === field.id;
    
    return (
      <div
        key={field.id}
        className={`relative group mb-4 ${
          isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          if (!readonly) {
            onFieldSelect?.(field.id);
          }
        }}
      >
        {/* Field Actions Overlay */}
        {!readonly && isSelected && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 space-x-reverse bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg px-2 py-1 z-10">
            {/* Move Up */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveField?.(field.id, 'up');
              }}
              disabled={index === 0}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="انتقال به بالا"
            >
              <MoveUp className="w-4 h-4" />
            </button>

            {/* Move Down */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveField?.(field.id, 'down');
              }}
              disabled={index === fields.length - 1}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="انتقال به پایین"
            >
              <MoveDown className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>

            {/* Duplicate */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateField?.(field.id);
              }}
              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              title="کپی کردن"
            >
              <Copy className="w-4 h-4" />
            </button>

            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteField?.(field.id);
              }}
              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Drag Handle */}
            <div className="p-1 text-gray-400 cursor-move" title="جابجایی">
              <GripVertical className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Field Content */}
        <div className={`p-3 border-2 border-dashed transition-all ${
          isSelected 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
        }`}>
          {renderFieldContent(field)}
        </div>
      </div>
    );
  };

  // render field content based on type
  const renderFieldContent = (field: FormField) => {
    const baseClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400";
    const inputClassName = `${baseClasses} ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
    const commonProps = {
      disabled: field.disabled,
      readOnly: field.readonly
    };

    return (
      <div className="space-y-2">
        {/* Label */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 mr-1">*</span>}
        </label>

        {/* Field Input */}
        <div>
          {(() => {
            switch (field.type) {
              case 'text':
              case 'email':
              case 'tel':
              case 'url':
              case 'number':
                return (
                  <input
                    type={field.type}
                    className={inputClassName}
                    placeholder={field.placeholder}
                    {...commonProps}
                  />
                );

              case 'textarea':
                return (
                  <textarea
                    className={inputClassName}
                    placeholder={field.placeholder}
                    rows={field.fieldSettings?.rows || 3}
                    {...commonProps}
                  />
                );

              case 'select':
                return (
                  <select
                    className={inputClassName}
                    {...commonProps}
                  >
                    <option value="">{field.placeholder || 'انتخاب کنید...'}</option>
                    {field.options?.map(option => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                );

              case 'radio':
                return (
                  <div className="space-y-2">
                    {field.options?.map(option => (
                      <label key={option.id} className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="radio"
                          value={option.value}
                          disabled={option.disabled}
                          {...commonProps}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                );

              case 'checkbox':
                return (
                  <div className="space-y-2">
                    {field.options?.map(option => (
                      <label key={option.id} className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="checkbox"
                          value={option.value}
                          disabled={option.disabled}
                          {...commonProps}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                );

              case 'date':
              case 'time':
              case 'datetime':
                return (
                  <input
                    type={field.type === 'datetime' ? 'datetime-local' : field.type}
                    className={inputClassName}
                    {...commonProps}
                  />
                );

              case 'file':
                return (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      className="hidden"
                      multiple={field.fieldSettings?.multiple}
                      accept={field.validation.fileTypes?.join(',')}
                      {...commonProps}
                    />
                    <div className="text-gray-500 dark:text-gray-400">
                      <Upload className="mx-auto h-12 w-12 mb-4" />
                      <p>برای آپلود فایل کلیک کنید یا فایل را اینجا رها کنید</p>
                      {field.validation.fileTypes && (
                        <p className="text-sm mt-2">
                          فرمت‌های مجاز: {field.validation.fileTypes.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                );

              case 'signature':
                return (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <PenTool className="mx-auto h-12 w-12 mb-4" />
                      <p>برای امضا کلیک کنید</p>
                    </div>
                  </div>
                );

              case 'rating':
                return (
                  <div className="flex space-x-1 space-x-reverse">
                    {Array.from({ length: field.fieldSettings?.maxRating || 5 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        className="text-yellow-400 hover:text-yellow-500 disabled:opacity-50"
                        {...commonProps}
                      >
                        <Star className="h-6 w-6" />
                      </button>
                    ))}
                  </div>
                );

              case 'slider':
                return (
                  <div className="space-y-2">
                    <input
                      type="range"
                      className="w-full"
                      min={field.fieldSettings?.min || 0}
                      max={field.fieldSettings?.max || 100}
                      step={field.fieldSettings?.step || 1}
                      {...commonProps}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{field.fieldSettings?.min || 0}</span>
                      <span>{field.fieldSettings?.max || 100}</span>
                    </div>
                  </div>
                );

              default:
                return null;
            }
          })()}
        </div>

        {/* Help Text */}
        {field.helpText && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {field.helpText}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            پیش‌نمایش فرم
          </h3>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          {/* Viewport Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {Object.entries(viewportConfig).map(([mode, config]) => {
              const IconComponent = config.icon;
              return (
                <button
                  key={mode}
                  onClick={() => setViewportMode(mode as ViewportMode)}
                  className={`p-2 rounded-md transition-colors ${
                    viewportMode === mode
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title={mode}
                >
                  <IconComponent className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            title="تنظیمات نمایش"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={() => {}}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
            title="بازنشانی"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
        <div className="flex justify-center">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300"
            style={{
              width: viewportConfig[viewportMode].width,
              maxWidth: viewportConfig[viewportMode].maxWidth
            }}
          >
            {/* Form Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {form?.name || 'فرم بدون نام'}
              </h2>
              {form?.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {form.description}
                </p>
              )}
              
              {/* Progress Bar */}
              {form?.settings?.showProgressBar && fields.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>پیشرفت فرم</span>
                    <span>0 از {fields.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Body */}
            <div 
              className="p-6 min-h-96"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => !readonly && onFieldSelect?.('')}
            >
              {fields.length === 0 ? (
                /* Empty State */
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <div className="text-4xl mb-2">📝</div>
                    <h3 className="text-lg font-medium">فرم خالی است</h3>
                    <p className="text-sm mt-2">
                      {readonly 
                        ? 'این فرم هیچ فیلدی ندارد'
                        : 'فیلدی را از سمت چپ بکشید و اینجا رها کنید'
                      }
                    </p>
                  </div>
                  
                  {!readonly && (
                    <div className="flex justify-center space-x-2 space-x-reverse">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddField?.('text');
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        + اضافه کردن متن
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddField?.('email');
                        }}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                      >
                        + اضافه کردن ایمیل
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Fields List */
                <div className="space-y-4">
                  {fields.map((field, index) => renderField(field, index))}
                  
                  {/* Add Field Zone */}
                  {!readonly && (
                    <div 
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDrop(e);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.dataTransfer.dropEffect = 'copy';
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddField?.('text');
                      }}
                    >
                      <div className="text-gray-400 dark:text-gray-500">
                        <div className="text-2xl mb-2">+</div>
                        <p className="text-sm">
                          فیلد جدید اضافه کنید
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Form Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center">
                {/* Save Draft Button */}
                {form?.settings?.allowSaveDraft && (
                  <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm">
                    ذخیره پیش‌نویس
                  </button>
                )}

                {/* Submit Button */}
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                  {form?.settings?.submitButtonText || 'ارسال فرم'}
                </button>
              </div>

              {/* Form Info */}
              {showSettings && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div>
                      <span className="font-medium">تعداد فیلدها:</span> {fields.length}
                    </div>
                    <div>
                      <span className="font-medium">فیلدهای اجباری:</span> {fields.filter(f => f.required).length}
                    </div>
                    <div>
                      <span className="font-medium">تم:</span> {form?.styling?.theme || 'پیش‌فرض'}
                    </div>
                    <div>
                      <span className="font-medium">وضعیت:</span> {form?.metadata?.status || 'پیش‌نویس'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      {!readonly && viewportMode === 'mobile' && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => onAddField?.('text')}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            title="اضافه کردن فیلد"
          >
            <span className="text-xl">+</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
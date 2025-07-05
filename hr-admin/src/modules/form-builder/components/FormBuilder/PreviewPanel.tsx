// src/modules/form-builder/components/FormBuilder/PreviewPanel.tsx

import React, { useState } from 'react';
import { 
  Eye, Smartphone, Tablet, Monitor, RotateCcw, Settings, 
  Trash2, Copy, MoveUp, MoveDown, GripVertical, Upload, PenTool, Star 
} from 'lucide-react';
import { FormField, Form, FieldType, FieldOption } from '../../types';
import { FieldRegistry } from '../../registry/FieldRegistry';

/**
 * پنل پیش‌نمایش فرم
 * نمایش فرم در حالت real-time و قابلیت drag & drop
 */

interface PreviewPanelProps {
  /** فرم برای نمایش */
  form: Form;
  /** فیلدهای فرم */
  fields: FormField[];
  /** فیلد انتخاب شده */
  selectedField?: string;
  /** callback تغییر فیلد انتخاب شده */
  onFieldSelect?: (fieldId: string) => void;
  /** callback اضافه کردن فیلد جدید */
  onAddField?: (type: FieldType) => void;
  /** callback حذف فیلد */
  onDeleteField?: (fieldId: string) => void;
  /** callback کپی فیلد */
  onDuplicateField?: (fieldId: string) => void;
  /** callback جابجایی فیلد */
  onMoveField?: (fieldId: string, direction: 'up' | 'down') => void;
  /** callback تغییر ترتیب فیلدها */
  onReorderFields?: (fieldIds: string[]) => void;
  /** حالت فقط خواندنی */
  readonly?: boolean;
  /** callback انتقال فیلد بین پنلها */
  onFieldDrop?: (fieldId: string, panelId: string) => void;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  form,
  fields,
  selectedField,
  onFieldSelect,
  onAddField,
  onDeleteField,
  onDuplicateField,
  onMoveField,
  onReorderFields,
  readonly,
  onFieldDrop
}) => {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [showSettings, setShowSettings] = useState(true);

  // تنظیمات viewport
  const viewportConfig = {
    desktop: { width: '100%', maxWidth: 'none', icon: Monitor },
    tablet: { width: '768px', maxWidth: '768px', icon: Tablet },
    mobile: { width: '375px', maxWidth: '375px', icon: Smartphone }
  };

  // گروه‌بندی فیلدها بر اساس پنل
  const groupedFields = fields.reduce((acc, field) => {
    if (field.type === 'panel') {
      acc[field.id] = {
        panel: field,
        fields: fields.filter(f => f.parentId === field.id)
      };
    }
    return acc;
  }, {} as Record<string, { panel: FormField, fields: FormField[] }>);

  // فیلدهای بدون پنل
  const orphanFields = fields.filter(field => 
    !field.parentId && field.type !== 'panel'
  );

  // handle drop
  const handleDrop = (e: React.DragEvent, panelId?: string) => {
    e.preventDefault();
    
    if (readonly) return;

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (data.type === 'field') {
        if (data.fieldId) {
          // اگر فیلد موجود را drag کرده‌ایم
          onFieldDrop?.(data.fieldId, panelId || '');
        } else if (data.fieldType) {
          // اگر فیلد جدید را drag کرده‌ایم
          const newFieldId = onAddField?.(data.fieldType as FieldType);
          if (newFieldId && panelId) {
            onFieldDrop?.(newFieldId, panelId);
          }
        }
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
  const renderField = (field: FormField) => {
    const registry = FieldRegistry[field.type];
    if (!registry?.component) return null;

    const Component = registry.component;
    return (
      <div
        key={field.id}
        className="relative group"
        draggable={!readonly}
        onDragStart={(e) => {
          e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'field',
            fieldId: field.id
          }));
        }}
        onDrop={(e) => handleDrop(e)}
        onDragOver={handleDragOver}
      >
        <Component
          field={field}
          isSelected={selectedField === field.id}
          onFieldSelect={onFieldSelect}
          readonly={readonly}
        />
        
        {/* Field Actions */}
        {!readonly && (
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            <button
              onClick={() => onDeleteField?.(field.id)}
              className="p-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
            >
              حذف
            </button>
            <button
              onClick={() => onDuplicateField?.(field.id)}
              className="p-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
            >
              تکثیر
            </button>
          </div>
        )}
      </div>
    );
  };

  // رندر یک پنل و فیلدهای داخل آن
  const renderPanel = (panelId: string) => {
    const { panel, fields: panelFields } = groupedFields[panelId];
    const registry = FieldRegistry.panel;
    if (!registry?.component) return null;

    const PanelComponent = registry.component;
    return (
      <div key={panel.id} className="mb-4">
        <PanelComponent
          field={panel as FormField & { fieldSettings: { panelSettings: any } }}
          isSelected={selectedField === panel.id}
          onFieldSelect={onFieldSelect}
          onFieldDrop={(fieldId: string) => onFieldDrop?.(fieldId, panel.id)}
          readonly={readonly}
        >
          {panelFields.map(renderField)}
          {/* Drop Zone */}
          {!readonly && (
            <div
              className="min-h-[100px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400"
              onDrop={(e) => handleDrop(e, panel.id)}
              onDragOver={handleDragOver}
            >
              فیلدها را اینجا رها کنید
            </div>
          )}
        </PanelComponent>
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
                {form.name || 'فرم بدون نام'}
              </h2>
              {form.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {form.description}
                </p>
              )}
              
              {/* Progress Bar */}
              {form.settings?.showProgressBar && fields.length > 0 && (
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
              {Object.keys(groupedFields).map(renderPanel)}
              
              {/* Orphan Fields */}
              {orphanFields.map(renderField)}
            </div>

            {/* Form Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center">
                {/* Save Draft Button */}
                {form.settings?.allowSaveDraft && (
                  <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm">
                    ذخیره پیش‌نویس
                  </button>
                )}

                {/* Submit Button */}
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                  {form.settings?.submitButtonText || 'ارسال فرم'}
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
                      <span className="font-medium">تم:</span> {form.styling?.theme || 'پیش‌فرض'}
                    </div>
                    <div>
                      <span className="font-medium">وضعیت:</span> {form.metadata?.status || 'پیش‌نویس'}
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
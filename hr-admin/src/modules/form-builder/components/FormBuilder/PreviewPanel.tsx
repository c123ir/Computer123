// src/modules/form-builder/components/FormBuilder/PreviewPanel.tsx

import React, { useState, useCallback } from 'react';
import { 
  Eye, Smartphone, Tablet, Monitor, RotateCcw, Settings, 
  Trash2, Copy, MoveUp, MoveDown, GripVertical, Upload, PenTool, Star,
  Plus, ArrowUpDown
} from 'lucide-react';
import { FormField, Form, FieldType, FieldOption } from '../../types';
import { FieldRegistry } from '../../registry/FieldRegistry';
import { motion, AnimatePresence } from 'framer-motion';

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
  /** callback اضافه کردن فیلد جدید - برمی‌گرداند شناسه فیلد جدید */
  onAddField?: (type: FieldType, parentId?: string) => string;
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
  const [isDraggingOver, setIsDraggingOver] = useState(false);

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

  // handle drop با useCallback
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, panelId?: string) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (readonly) return;

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      console.log('Drop data:', data, 'into panel:', panelId);
      
      if (data.type === 'field') {
        if (data.fieldId) {
          // اگر فیلد موجود را drag کرده‌ایم
          console.log('Moving existing field', data.fieldId, 'to panel', panelId);
          onFieldDrop?.(data.fieldId, panelId || '');
        } else if (data.fieldType) {
          // اگر فیلد جدید را drag کرده‌ایم
          console.log('Adding new field of type', data.fieldType, 'to panel', panelId);
          const newFieldId = onAddField?.(data.fieldType as FieldType, panelId);
          console.log('Created new field with ID:', newFieldId);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, [readonly, onFieldDrop, onAddField]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  }, []);

  // render field
  const renderField = useCallback((field: FormField) => {
    const registry = FieldRegistry[field.type];
    if (!registry?.component) return null;

    const Component = registry.component;
    return (
      <div
        key={field.id}
        className="relative group"
        draggable={!readonly}
        onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
          const data = {
            type: 'field',
            fieldId: field.id,
            fieldType: field.type
          };
          console.log('Starting drag with data:', data);
          e.dataTransfer.setData('application/json', JSON.stringify(data));
          e.currentTarget.classList.add('dragging');
        }}
        onDragEnd={(e: React.DragEvent<HTMLDivElement>) => {
          e.currentTarget.classList.remove('dragging');
        }}
        onDrop={(e) => handleDrop(e)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
            selectedField === field.id 
              ? 'ring-2 ring-blue-500 shadow-lg' 
              : 'hover:shadow-md'
          }`}
        >
          <Component
            field={field}
            isSelected={selectedField === field.id}
            onFieldSelect={onFieldSelect}
            readonly={readonly}
          />
          
          {/* Field Actions */}
          {!readonly && (
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1">
              <button
                onClick={() => onDeleteField?.(field.id)}
                className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                title="حذف فیلد"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDuplicateField?.(field.id)}
                className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                title="تکثیر فیلد"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => onMoveField?.(field.id, 'up')}
                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                title="انتقال به بالا"
              >
                <MoveUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => onMoveField?.(field.id, 'down')}
                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                title="انتقال به پایین"
              >
                <MoveDown className="w-4 h-4" />
              </button>
              <div className="cursor-move p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                <GripVertical className="w-4 h-4" />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }, [selectedField, readonly, onDeleteField, onDuplicateField, onMoveField, handleDrop, handleDragOver, handleDragLeave]);

  // رندر یک پنل و فیلدهای داخل آن
  const renderPanel = useCallback((panelId: string) => {
    const { panel, fields: panelFields } = groupedFields[panelId];
    const registry = FieldRegistry.panel;
    if (!registry?.component) return null;

    console.log('Rendering panel', panelId, 'with fields:', panelFields);

    const PanelComponent = registry.component;
    return (
      <motion.div 
        key={panel.id} 
        layout
        className="mb-6"
      >
        <PanelComponent
          field={panel as FormField & { fieldSettings: { panelSettings: any } }}
          isSelected={selectedField === panel.id}
          onFieldSelect={onFieldSelect}
          onFieldDrop={(fieldId: string) => {
            console.log('Panel received field drop:', fieldId);
            onFieldDrop?.(fieldId, panel.id);
          }}
          readonly={readonly}
        >
          <AnimatePresence>
            {panelFields.map(renderField)}
          </AnimatePresence>
          
          {/* Drop Zone */}
          {!readonly && (
            <div
              className={`mt-4 transition-all duration-300 ${
                isDraggingOver
                  ? 'border-2 border-dashed border-blue-400 bg-blue-50/50'
                  : 'border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
              } dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center gap-3`}
              onDrop={(e) => handleDrop(e, panel.id)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className={`p-3 rounded-full ${
                isDraggingOver ? 'bg-blue-100' : 'bg-gray-100'
              } transition-colors`}>
                <Plus className={`w-6 h-6 ${
                  isDraggingOver ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="text-center">
                <p className={`text-base font-medium ${
                  isDraggingOver ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  فیلدها را اینجا رها کنید
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  یا از پنل سمت راست انتخاب کنید
                </p>
              </div>
            </div>
          )}
        </PanelComponent>
      </motion.div>
    );
  }, [groupedFields, selectedField, readonly, handleDrop, handleDragOver, handleDragLeave, isDraggingOver, onFieldDrop, onFieldSelect, renderField]);

  return (
    <div className="h-full flex flex-col bg-white/70 backdrop-blur-sm">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              پیش‌نمایش فرم
            </h3>
            {!readonly && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg transition-colors ${
                  showSettings 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport Controls */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {Object.entries(viewportConfig).map(([mode, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={mode}
                    onClick={() => setViewportMode(mode as ViewportMode)}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewportMode === mode
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title={`نمایش در حالت ${mode}`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Form Preview */}
      <div className="flex-1 overflow-y-auto">
        <div 
          className={`mx-auto transition-all duration-300 p-6`}
          style={{
            width: viewportConfig[viewportMode].width,
            maxWidth: viewportConfig[viewportMode].maxWidth
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <AnimatePresence>
              {Object.keys(groupedFields).map(renderPanel)}
              {orphanFields.map(renderField)}
            </AnimatePresence>

            {/* Main Drop Zone */}
            {!readonly && (
              <div
                className={`mt-6 transition-all duration-300 ${
                  isDraggingOver
                    ? 'border-2 border-dashed border-blue-400 bg-blue-50/50'
                    : 'border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                } dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center gap-3`}
                onDrop={(e) => handleDrop(e)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className={`p-3 rounded-full ${
                  isDraggingOver ? 'bg-blue-100' : 'bg-gray-100'
                } transition-colors`}>
                  <Plus className={`w-6 h-6 ${
                    isDraggingOver ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-center">
                  <p className={`text-base font-medium ${
                    isDraggingOver ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    فیلدها را اینجا رها کنید
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    یا از پنل سمت راست انتخاب کنید
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
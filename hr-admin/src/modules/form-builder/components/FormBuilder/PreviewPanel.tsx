// src/modules/form-builder/components/FormBuilder/PreviewPanel.tsx

import React, { useState, useCallback } from 'react';
import { 
  Eye, Smartphone, Tablet, Monitor, RotateCcw, Settings, 
  Trash2, Copy, MoveUp, MoveDown, GripVertical, Upload, PenTool, Star,
  Plus, ArrowUpDown
} from 'lucide-react';
import { FormField, Form, FieldType } from '../../types';
import { FieldRegistry } from '../../registry/FieldRegistry';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelField } from '../Fields/PanelField';
import { useDrop } from 'react-dnd';
import { nanoid } from 'nanoid';

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
  /** callback تغییر فیلد */
  onFieldUpdate: (fieldId: string, updates: Partial<FormField>) => void;
  /** callback حذف فیلد */
  onFieldDelete: (fieldId: string) => void;
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
  onFieldDrop,
  onFieldUpdate,
  onFieldDelete
}) => {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, panelId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const fieldId = e.dataTransfer.getData('fieldId');
    const fieldType = e.dataTransfer.getData('fieldType');

    if (fieldId && onFieldDrop && panelId) {
      onFieldDrop(fieldId, panelId);
    } else if (fieldType && onAddField) {
      const newFieldId = onAddField(fieldType as FieldType, panelId);
      if (panelId && onFieldDrop) {
        onFieldDrop(newFieldId, panelId);
      }
    }
  }, [onFieldDrop, onAddField]);

  const renderField = useCallback((field: FormField) => {
    const Component = FieldRegistry[field.type]?.component;
    if (!Component) return null;

    return (
      <motion.div
        key={field.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`
          relative group
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg
          transition-all duration-200
          ${selectedField === field.id ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
          ${!readonly ? 'hover:border-blue-300 dark:hover:border-blue-500' : ''}
        `}
        onClick={() => onFieldSelect?.(field.id)}
        draggable={!readonly}
        onDragStart={(e) => {
          e.dataTransfer.setData('fieldId', field.id);
          e.dataTransfer.setData('fieldType', field.type);
        }}
      >
        <Component
          field={field}
          readonly={readonly}
        />

        {/* Field Actions */}
        {!readonly && selectedField === field.id && (
          <div className="absolute -left-12 top-0 flex flex-col items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteField?.(field.id);
              }}
              className="p-1.5 text-red-600 hover:text-red-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              title="حذف فیلد"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateField?.(field.id);
              }}
              className="p-1.5 text-gray-600 hover:text-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              title="کپی فیلد"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveField?.(field.id, 'up');
              }}
              className="p-1.5 text-gray-600 hover:text-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              title="انتقال به بالا"
            >
              <MoveUp className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveField?.(field.id, 'down');
              }}
              className="p-1.5 text-gray-600 hover:text-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              title="انتقال به پایین"
            >
              <MoveDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    );
  }, [selectedField, readonly, onFieldSelect, onDeleteField, onDuplicateField, onMoveField]);

  const renderPanel = useCallback((panelId: string) => {
    const { panel, fields: panelFields } = groupedFields[panelId];
    
    return (
      <motion.div
        key={panel.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6"
      >
        <PanelField
          field={panel}
          onFieldSelect={onFieldSelect}
          onFieldDrop={onFieldDrop}
          isSelected={selectedField === panel.id}
          readonly={readonly}
        >
          {panelFields.map(renderField)}
        </PanelField>
      </motion.div>
    );
  }, [groupedFields, selectedField, readonly, onFieldSelect, onFieldDrop, renderField]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FIELD',
    drop: (item: { type: FieldType }) => {
      onAddField(item.type, undefined);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {Object.entries(viewportConfig).map(([mode, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={mode}
                onClick={() => setViewportMode(mode as ViewportMode)}
                className={`
                  p-2 rounded-lg
                  ${viewportMode === mode
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }
                `}
                title={mode}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div 
          className="mx-auto transition-all duration-300 p-6"
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
                ref={drop}
                className={`
                  mt-6
                  min-h-[120px]
                  border-2 border-dashed
                  rounded-lg
                  transition-all duration-200
                  flex flex-col items-center justify-center gap-2
                  ${isOver ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'}
                `}
              >
                <div className={`
                  p-3 rounded-full
                  ${isOver ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}
                `}>
                  <Plus className={`w-6 h-6 ${isOver ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-medium ${isOver ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    فیلدها را اینجا رها کنید
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
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
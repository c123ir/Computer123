import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { FormField, PanelSettings } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface PanelFieldProps {
  field: FormField;
  children?: React.ReactNode;
  onFieldSelect?: (fieldId: string) => void;
  onFieldDrop?: (fieldId: string, panelId: string) => void;
  isSelected?: boolean;
  readonly?: boolean;
}

// مقادیر پیش‌فرض برای تنظیمات پنل
const defaultPanelSettings: PanelSettings = {
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
};

export const PanelField: React.FC<PanelFieldProps> = ({
  field,
  children,
  onFieldSelect,
  onFieldDrop,
  isSelected,
  readonly
}) => {
  const [isCollapsed, setIsCollapsed] = useState(field.fieldSettings?.panelSettings?.defaultCollapsed ?? false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const panelSettings = {
    ...defaultPanelSettings,
    ...field.fieldSettings?.panelSettings
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const fieldId = e.dataTransfer.getData('fieldId');
    const fieldType = e.dataTransfer.getData('fieldType');

    if (fieldId && onFieldDrop) {
      onFieldDrop(fieldId, field.id);
    }
  }, [field.id, onFieldDrop]);

  return (
    <div
      className={`
        relative
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-lg
        transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
        ${!readonly ? 'hover:border-blue-300 dark:hover:border-blue-500' : ''}
      `}
      style={{
        backgroundColor: panelSettings.backgroundColor,
        borderColor: panelSettings.borderColor,
        borderRadius: panelSettings.borderRadius,
      }}
      onClick={() => onFieldSelect?.(field.id)}
    >
      {/* Panel Header */}
      <div className={`
        flex items-center justify-between
        p-4
        border-b border-gray-200 dark:border-gray-700
        ${panelSettings.collapsible ? 'cursor-pointer' : ''}
      `}>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {panelSettings.title}
        </h3>
        {panelSettings.collapsible && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Panel Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`
              overflow-hidden
              ${panelSettings.padding === 'sm' ? 'p-2' : panelSettings.padding === 'md' ? 'p-4' : 'p-6'}
            `}
          >
            {/* Grid Layout */}
            <div
              className={`
                grid gap-4
                ${panelSettings.columns === 1 ? 'grid-cols-1' :
                  panelSettings.columns === 2 ? 'grid-cols-2' :
                  panelSettings.columns === 3 ? 'grid-cols-3' :
                  'grid-cols-4'}
              `}
            >
              {children}
            </div>

            {/* Drop Zone */}
            {!readonly && (
              <div
                className={`
                  mt-4
                  min-h-[100px]
                  border-2 border-dashed
                  rounded-lg
                  transition-all duration-200
                  flex flex-col items-center justify-center gap-2
                  ${isDraggingOver 
                    ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <p className={`text-sm font-medium ${isDraggingOver ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  فیلدها را اینجا رها کنید
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  یا از پنل سمت راست انتخاب کنید
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PanelField; 
import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { FormField, PanelSettings } from '../../types';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // ترکیب تنظیمات پیش‌فرض با تنظیمات دریافتی
  const panelSettings = {
    ...defaultPanelSettings,
    ...(field.fieldSettings?.panelSettings || {})
  };

  const handleClick = () => {
    if (!readonly && onFieldSelect) {
      onFieldSelect(field.id);
    }
  };

  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (panelSettings.collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const fieldId = e.dataTransfer.getData('fieldId');
    const fieldType = e.dataTransfer.getData('fieldType');

    if (fieldId && onFieldDrop) {
      onFieldDrop(fieldId, field.id);
    } else if (fieldType && onFieldDrop) {
      // اگر فیلد جدید است، از نوع فیلد استفاده می‌کنیم
      onFieldDrop(fieldType, field.id);
    }
  }, [field.id, onFieldDrop]);

  // تبدیل تعداد ستون به کلاس tailwind
  const getColumnsClass = (columns: number) => {
    const map: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4'
    };
    return map[columns] || 'grid-cols-1';
  };

  return (
    <div 
      className={`
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-lg
        transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
        ${!readonly ? 'hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer' : ''}
      `}
      onClick={handleClick}
      style={{
        backgroundColor: panelSettings.backgroundColor,
        borderColor: panelSettings.borderColor,
        borderRadius: panelSettings.borderRadius + 'px',
      }}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleCollapse}
            className={`
              p-1 rounded-md
              text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition-colors
              ${!panelSettings.collapsible ? 'invisible' : ''}
            `}
          >
            {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {panelSettings.title || 'پنل جدید'}
          </h3>
        </div>
      </div>

      {/* Panel Content */}
      <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
        <div className={`grid ${getColumnsClass(panelSettings.columns)} gap-4 p-4`}>
          {children}
          
          {/* Drop Zone */}
          {!readonly && (
            <div
              className={`
                min-h-[120px]
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
              <div className={`
                p-3 rounded-full
                ${isDraggingOver ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}
              `}>
                <svg
                  className={`w-6 h-6 ${isDraggingOver ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className={`text-sm font-medium ${isDraggingOver ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
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
  );
};

export default PanelField; 
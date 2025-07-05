import React, { FC } from 'react';
import { useFormBuilder } from '../../hooks';
import { FieldType, FormField } from '../../types';

export interface SidePanelProps {
  selectedField?: FormField;
  onFieldSelect: (fieldType: FieldType, parentId?: string) => string;
  onFieldUpdate: (fieldId: string, updates: Partial<FormField>) => void;
  readonly?: boolean;
  className?: string;
}

const SidePanel: FC<SidePanelProps> = ({
  selectedField,
  onFieldSelect,
  onFieldUpdate,
  readonly = false,
  className = ''
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: FieldType) => {
    if (!readonly) {
      e.dataTransfer.setData('fieldType', type);
    }
  };

  const fieldTypes: { type: FieldType; label: string; icon: string }[] = [
    { type: 'text', label: 'متن کوتاه', icon: '📝' },
    { type: 'textarea', label: 'متن بلند', icon: '📄' },
    { type: 'number', label: 'عدد', icon: '🔢' },
    { type: 'email', label: 'ایمیل', icon: '📧' },
    { type: 'tel', label: 'تلفن', icon: '📞' },
    { type: 'url', label: 'لینک', icon: '🔗' },
    { type: 'select', label: 'انتخاب از لیست', icon: '📋' },
    { type: 'checkbox', label: 'چک‌باکس', icon: '☑️' },
    { type: 'radio', label: 'رادیو', icon: '⭕' },
    { type: 'date', label: 'تاریخ', icon: '📅' },
    { type: 'file', label: 'فایل', icon: '📎' },
    { type: 'panel', label: 'پنل', icon: '🗂️' }
  ];

  const handleFieldClick = (type: FieldType) => {
    if (!readonly) {
      onFieldSelect(type);
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <h3 className="text-lg font-bold mb-4 text-right">فیلدها</h3>
      <div className="grid grid-cols-2 gap-3">
        {fieldTypes.map(({ type, label, icon }) => (
          <div
            key={type}
            draggable={!readonly}
            onDragStart={(e) => handleDragStart(e, type)}
            className={`flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg ${
              !readonly ? 'cursor-move hover:bg-gray-100' : 'cursor-not-allowed opacity-60'
            } transition-colors`}
            onClick={() => handleFieldClick(type)}
          >
            <span className="text-2xl mb-1">{icon}</span>
            <span className="text-sm text-gray-600 text-center">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidePanel; 
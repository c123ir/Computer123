// src/modules/form-builder/components/FormBuilder/FieldsPanel.tsx

import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { FieldType } from '../../types';
import {
  Type,
  AlignLeft,
  Hash,
  List,
  CheckSquare,
  Circle,
  Calendar,
  Clock,
  Upload,
  Edit,
  Star,
  Sliders,
  LayoutDashboard
} from 'lucide-react';

/**
 * پنل فیلدهای قابل استفاده در فرم‌ساز
 * شامل دسته‌بندی فیلدها و قابلیت جستجو
 */

interface FieldsPanelProps {
  onAddField: (type: FieldType) => void;
  readonly?: boolean;
}

interface DraggableFieldProps {
  field: { type: FieldType; label: string; icon: React.ReactNode };
  onAddField: (type: FieldType) => void;
  readonly: boolean;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ field, onAddField, readonly }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'FIELD',
    item: { type: field.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: !readonly
  });

  drag(ref);

  return (
    <div
      ref={ref}
      className={`
        flex items-center gap-3 p-3 rounded-lg
        bg-gray-50 dark:bg-gray-700
        hover:bg-gray-100 dark:hover:bg-gray-600
        border border-gray-200 dark:border-gray-600
        transition-all duration-200
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${readonly ? 'cursor-not-allowed opacity-60' : 'cursor-move'}
      `}
      onClick={() => !readonly && onAddField(field.type)}
    >
      {field.icon}
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {field.label}
      </span>
    </div>
  );
};

const FieldsPanel: React.FC<FieldsPanelProps> = ({ onAddField, readonly = false }) => {
  const fields: { type: FieldType; label: string; icon: React.ReactNode }[] = [
    { type: 'text', label: 'متن تک خطی', icon: <Type className="w-4 h-4" /> },
    { type: 'textarea', label: 'متن چند خطی', icon: <AlignLeft className="w-4 h-4" /> },
    { type: 'number', label: 'عدد', icon: <Hash className="w-4 h-4" /> },
    { type: 'select', label: 'انتخاب از لیست', icon: <List className="w-4 h-4" /> },
    { type: 'checkbox', label: 'چک باکس', icon: <CheckSquare className="w-4 h-4" /> },
    { type: 'radio', label: 'انتخاب یکی از چند', icon: <Circle className="w-4 h-4" /> },
    { type: 'date', label: 'تاریخ', icon: <Calendar className="w-4 h-4" /> },
    { type: 'time', label: 'زمان', icon: <Clock className="w-4 h-4" /> },
    { type: 'file', label: 'آپلود فایل', icon: <Upload className="w-4 h-4" /> },
    { type: 'signature', label: 'امضا', icon: <Edit className="w-4 h-4" /> },
    { type: 'rating', label: 'امتیازدهی', icon: <Star className="w-4 h-4" /> },
    { type: 'slider', label: 'اسلایدر', icon: <Sliders className="w-4 h-4" /> },
    { type: 'panel', label: 'پنل', icon: <LayoutDashboard className="w-4 h-4" /> }
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        فیلدهای فرم
      </h2>
      <div className="space-y-2">
        {fields.map(field => (
          <DraggableField
            key={field.type}
            field={field}
            onAddField={onAddField}
            readonly={readonly}
          />
        ))}
      </div>
    </div>
  );
};

export default FieldsPanel;
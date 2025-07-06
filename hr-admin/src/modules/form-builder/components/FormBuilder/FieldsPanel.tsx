// src/modules/form-builder/components/FormBuilder/FieldsPanel.tsx

import React, { useState } from 'react';
import { 
  LayoutDashboard, Type, AlignLeft, Hash, Mail, Phone, Globe,
  List, Circle, CheckSquare, Calendar, Clock, Upload, PenTool,
  Star, Sliders, Search, X, Plus, Trash2
} from 'lucide-react';
import { FieldType } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag } from 'react-dnd';

/**
 * پنل فیلدهای قابل استفاده در فرم‌ساز
 * شامل دسته‌بندی فیلدها و قابلیت جستجو
 */

interface FieldPaletteItem {
  type: FieldType;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  category: string;
  isPro?: boolean;
}

interface FieldsPanelProps {
  /** callback هنگام انتخاب فیلد */
  onFieldSelect: (type: FieldType, parentId?: string) => void;
  /** حالت فقط خواندنی */
  readonly?: boolean;
  /** وضعیت loading */
  isLoading?: boolean;
  onAddField: (type: FieldType) => void;
}

export const FieldsPanel: React.FC<FieldsPanelProps> = ({
  onFieldSelect,
  readonly = false,
  isLoading = false,
  onAddField
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // تعریف فیلدهای موجود
  const fieldTypes = [
    // فیلدهای چیدمان
    { type: 'panel' as FieldType, label: 'پنل', icon: LayoutDashboard, description: 'پنل با قابلیت تنظیم ستون‌ها', category: 'layout' },
    
    // فیلدهای پایه
    { type: 'text' as FieldType, label: 'متن کوتاه', icon: Type, description: 'متن یک خطی', category: 'basic' },
    { type: 'textarea' as FieldType, label: 'متن بلند', icon: AlignLeft, description: 'متن چند خطی', category: 'basic' },
    { type: 'number' as FieldType, label: 'عدد', icon: Hash, description: 'ورودی عددی', category: 'basic' },
    
    // فیلدهای تماس
    { type: 'email' as FieldType, label: 'ایمیل', icon: Mail, description: 'آدرس ایمیل', category: 'contact' },
    { type: 'tel' as FieldType, label: 'تلفن', icon: Phone, description: 'شماره تلفن', category: 'contact' },
    { type: 'url' as FieldType, label: 'وب‌سایت', icon: Globe, description: 'آدرس وب‌سایت', category: 'contact' },
    
    // فیلدهای انتخابی
    { type: 'select' as FieldType, label: 'لیست کشویی', icon: List, description: 'انتخاب از لیست', category: 'choice' },
    { type: 'radio' as FieldType, label: 'رادیو', icon: Circle, description: 'انتخاب یکی از چند', category: 'choice' },
    { type: 'checkbox' as FieldType, label: 'چک‌باکس', icon: CheckSquare, description: 'انتخاب چند گزینه', category: 'choice' },
    
    // فیلدهای تاریخ و زمان
    { type: 'date' as FieldType, label: 'تاریخ', icon: Calendar, description: 'انتخاب تاریخ', category: 'datetime' },
    { type: 'time' as FieldType, label: 'زمان', icon: Clock, description: 'انتخاب زمان', category: 'datetime' },
    
    // فیلدهای پیشرفته
    { type: 'file' as FieldType, label: 'آپلود فایل', icon: Upload, description: 'آپلود فایل', category: 'advanced', isPro: true },
    { type: 'signature' as FieldType, label: 'امضا', icon: PenTool, description: 'امضای دیجیتال', category: 'advanced', isPro: true },
    { type: 'rating' as FieldType, label: 'امتیازدهی', icon: Star, description: 'امتیاز با ستاره', category: 'advanced', isPro: true },
    { type: 'slider' as FieldType, label: 'اسلایدر', icon: Sliders, description: 'انتخاب مقدار با اسلایدر', category: 'advanced', isPro: true },
  ];

  // دسته‌بندی‌ها
  const categories = [
    { id: 'all', label: 'همه فیلدها', count: fieldTypes.length },
    { id: 'layout', label: 'چیدمان', count: fieldTypes.filter(f => f.category === 'layout').length },
    { id: 'basic', label: 'پایه', count: fieldTypes.filter(f => f.category === 'basic').length },
    { id: 'choice', label: 'انتخابی', count: fieldTypes.filter(f => f.category === 'choice').length },
    { id: 'datetime', label: 'تاریخ و زمان', count: fieldTypes.filter(f => f.category === 'datetime').length },
    { id: 'advanced', label: 'پیشرفته', count: fieldTypes.filter(f => f.category === 'advanced').length },
  ];

  // فیلتر فیلدها
  const filteredFields = fieldTypes.filter(field => {
    const matchesSearch = field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || field.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی فیلد..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 
                     border border-gray-200 dark:border-gray-600 
                     rounded-lg text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium
                transition-colors duration-200
                ${selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }
              `}
            >
              {category.label}
              <span className="ml-2 text-xs bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Fields List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredFields.map((field) => (
            <DraggableField
              key={field.type}
              field={field}
              onAddField={onAddField}
              readonly={readonly}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface DraggableFieldProps {
  field: FieldPaletteItem;
  onAddField: (type: FieldType) => void;
  readonly: boolean;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ field, onAddField, readonly }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FIELD',
    item: { type: field.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: !readonly
  }));

  return (
    <motion.div
      ref={drag}
      className={`
        flex items-center gap-3 p-3 rounded-lg cursor-move
        bg-gray-50 dark:bg-gray-700
        hover:bg-gray-100 dark:hover:bg-gray-600
        border border-gray-200 dark:border-gray-600
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${readonly ? 'cursor-not-allowed opacity-60' : ''}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-gray-500 dark:text-gray-400">
        <field.icon className="w-5 h-5" />
      </div>
      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
        {field.label}
      </span>
      {!readonly && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddField(field.type);
          }}
          className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

export default FieldsPanel;
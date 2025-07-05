// src/modules/form-builder/components/FormBuilder/FieldsPanel.tsx

import React, { useState } from 'react';
import {
  Type, AlignLeft, Hash, Mail, Phone, Link, ChevronDown, Circle, Square,
  Calendar, Clock, CalendarClock, Upload, PenTool, Star, Sliders, Search, List, CheckSquare, Globe
} from 'lucide-react';
import { FieldType } from '../../types';

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
  onFieldSelect?: (fieldType: FieldType) => void;
  /** حالت فقط خواندنی */
  readonly?: boolean;
}

export const FieldsPanel: React.FC<FieldsPanelProps> = ({
  onFieldSelect,
  readonly = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // تعریف فیلدهای موجود
  const fieldTypes = [
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
    { type: 'datetime' as FieldType, label: 'تاریخ و زمان', icon: Calendar, description: 'تاریخ و زمان', category: 'datetime' },
    
    // فیلدهای پیشرفته
    { type: 'file' as FieldType, label: 'آپلود فایل', icon: Upload, description: 'آپلود فایل', category: 'advanced', isPro: true },
    { type: 'signature' as FieldType, label: 'امضا', icon: PenTool, description: 'امضای دیجیتال', category: 'advanced', isPro: true },
    { type: 'rating' as FieldType, label: 'امتیازدهی', icon: Star, description: 'امتیاز با ستاره', category: 'advanced', isPro: true },
    { type: 'slider' as FieldType, label: 'اسلایدر', icon: Sliders, description: 'انتخاب مقدار با اسلایدر', category: 'advanced', isPro: true },
  ];

  // دسته‌بندی‌ها
  const categories = [
    { id: 'all', label: 'همه فیلدها', count: fieldTypes.length },
    { id: 'basic', label: 'پایه', count: fieldTypes.filter(f => f.category === 'basic').length },
    { id: 'choice', label: 'انتخابی', count: fieldTypes.filter(f => f.category === 'choice').length },
    { id: 'datetime', label: 'تاریخ و زمان', count: fieldTypes.filter(f => f.category === 'datetime').length },
    { id: 'advanced', label: 'پیشرفته', count: fieldTypes.filter(f => f.category === 'advanced').length },
  ];

  // فیلتر کردن فیلدها
  const filteredFields = fieldTypes.filter(field => {
    const matchesSearch = field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || field.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // handle field selection
  const handleFieldClick = (fieldType: FieldType) => {
    if (readonly) return;
    onFieldSelect?.(fieldType);
  };

  // handle drag start
  const handleDragStart = (e: React.DragEvent, fieldType: FieldType) => {
    if (readonly) return;
    
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'field',
      fieldType
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          فیلدهای فرم
        </h3>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="جستجو در فیلدها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Categories */}
        <div className="space-y-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{category.label}</span>
                <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fields List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredFields.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                فیلدی یافت نشد
              </p>
            </div>
          ) : (
            filteredFields.map(field => {
              const IconComponent = field.icon;
              
              return (
                <div
                  key={field.type}
                  className={`group relative p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 cursor-pointer transition-all duration-200 ${
                    readonly 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md hover:scale-[1.02]'
                  }`}
                  draggable={!readonly}
                  onDragStart={(e) => handleDragStart(e, field.type)}
                  onClick={() => handleFieldClick(field.type)}
                >
                  {/* Pro Badge */}
                  {field.isPro && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900 dark:to-pink-900 dark:text-purple-200">
                        PRO
                      </span>
                    </div>
                  )}

                  <div className="flex items-start space-x-3 space-x-reverse">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      field.isPro 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                        : 'bg-blue-500'
                    } text-white`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {field.label}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        {field.description}
                      </p>
                    </div>
                  </div>

                  {/* Drag Indicator */}
                  {!readonly && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex flex-col space-y-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Help Text */}
        {!readonly && (
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
              💡 <strong>راهنما:</strong> فیلد مورد نظر را بکشید و در پیش‌نمایش فرم رها کنید یا روی آن کلیک کنید.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldsPanel;
// src/modules/form-builder/components/FormBuilder/FieldsPanel.tsx

import React, { useState, useCallback } from 'react';
import {
  Type, AlignLeft, Hash, Mail, Phone, Link, ChevronDown, Circle, Square,
  Calendar, Clock, CalendarClock, Upload, PenTool, Star, Sliders, Search, List, CheckSquare, Globe,
  LayoutDashboard, Layout, Loader2
} from 'lucide-react';
import { FieldType } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

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
  /** وضعیت loading */
  isLoading?: boolean;
}

export const FieldsPanel: React.FC<FieldsPanelProps> = ({
  onFieldSelect,
  readonly = false,
  isLoading = false
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
    { id: 'layout', label: 'چیدمان', count: fieldTypes.filter(f => f.category === 'layout').length },
    { id: 'basic', label: 'پایه', count: fieldTypes.filter(f => f.category === 'basic').length },
    { id: 'choice', label: 'انتخابی', count: fieldTypes.filter(f => f.category === 'choice').length },
    { id: 'datetime', label: 'تاریخ و زمان', count: fieldTypes.filter(f => f.category === 'datetime').length },
    { id: 'advanced', label: 'پیشرفته', count: fieldTypes.filter(f => f.category === 'advanced').length },
  ];

  // فیلتر کردن فیلدها با debounce
  const filteredFields = fieldTypes.filter(field => {
    const matchesSearch = field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || field.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // handle field selection با useCallback
  const handleFieldClick = useCallback((fieldType: FieldType) => {
    if (readonly) return;
    onFieldSelect?.(fieldType);
  }, [readonly, onFieldSelect]);

  // handle drag start با useCallback
  const handleDragStart = useCallback((e: React.DragEvent, fieldType: FieldType) => {
    if (readonly) return;
    
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'field',
      fieldType
    }));
    e.dataTransfer.effectAllowed = 'copy';

    // اضافه کردن کلاس برای نمایش وضعیت drag
    const dragImage = e.target as HTMLElement;
    dragImage.classList.add('dragging');
  }, [readonly]);

  // handle drag end
  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const dragElement = e.target as HTMLElement;
    dragElement.classList.remove('dragging');
  }, []);

  return (
    <div className="h-full flex flex-col bg-white/70 backdrop-blur-sm">
      {/* Header با glassmorphism */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 backdrop-blur-md">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-blue-500" />
          فیلدهای فرم
        </h3>
        
        {/* Search با انیمیشن focus */}
        <div className="relative mb-4 group">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-blue-500" />
          <input
            type="text"
            placeholder="جستجو در فیلدها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg 
                     bg-white/50 backdrop-blur-sm dark:bg-gray-700/50
                     text-gray-900 dark:text-white 
                     placeholder-gray-500 dark:placeholder-gray-400 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200
                     hover:border-gray-300 dark:hover:border-gray-500"
          />
        </div>

        {/* Categories با hover effects */}
        <div className="space-y-1">
          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full text-right px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{category.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {category.count}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Fields List با loading state و empty state */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-32"
            >
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </motion.div>
          ) : filteredFields.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center py-8"
            >
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                فیلدی با این مشخصات یافت نشد
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredFields.map(field => {
                const IconComponent = field.icon;
                
                return (
                  <motion.div
                    key={field.type}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`group relative p-4 border border-gray-200 dark:border-gray-600 
                              rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm 
                              cursor-pointer transition-all duration-300 
                              ${readonly 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg hover:scale-[1.02]'
                              }`}
                    draggable={!readonly}
                    onDragStart={(e) => handleDragStart(e, field.type)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleFieldClick(field.type)}
                  >
                    {/* Pro Badge با gradient */}
                    {field.isPro && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                     bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                                     text-purple-700 dark:text-purple-300
                                     border border-purple-200 dark:border-purple-800">
                          PRO
                        </span>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Icon با gradient و hover effect */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl 
                                    flex items-center justify-center 
                                    transition-transform duration-300
                                    group-hover:scale-110
                                    ${field.isPro 
                                      ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                                    }`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>

                      {/* Content با hover animations */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white
                                   group-hover:text-blue-600 dark:group-hover:text-blue-400
                                   transition-colors duration-200">
                          {field.label}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed
                                  group-hover:text-gray-700 dark:group-hover:text-gray-300">
                          {field.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FieldsPanel;
// src/modules/form-builder/components/FormsList/FormCard.tsx

import React from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  EyeIcon,
  CalendarIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Form } from '../../types';

interface FormCardProps {
  /** فرم */
  form: Form;
  /** حالت نمایش */
  viewMode?: 'grid' | 'list';
  /** callback انتخاب فرم */
  onSelect?: () => void;
  /** callback ویرایش */
  onEdit?: () => void;
  /** callback حذف */
  onDelete?: () => void;
  /** callback کپی */
  onDuplicate?: () => void;
  /** callback تغییر وضعیت */
  onStatusChange?: (status: Form['status']) => void;
  /** فقط خواندنی */
  readonly?: boolean;
}

const FormCard: React.FC<FormCardProps> = ({
  form,
  viewMode = 'grid',
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onStatusChange,
  readonly = false
}) => {
  
  // Status styling
  const getStatusStyle = (status: Form['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'paused':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: Form['status']) => {
    switch (status) {
      case 'published': return 'منتشر شده';
      case 'draft': return 'پیش‌نویس';
      case 'archived': return 'بایگانی';
      case 'paused': return 'متوقف';
      default: return status;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Grid view
  if (viewMode === 'grid') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="p-4 pb-2">
          <div className="flex justify-between items-start mb-2">
            <h3 
              className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 truncate"
              onClick={onSelect}
            >
              {form.name}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(form.status)}`}>
              {getStatusText(form.status)}
            </span>
          </div>
          
          {form.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {form.description}
            </p>
          )}
          
          {form.category && (
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
              {form.category}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center">
                <ChartBarIcon className="w-4 h-4 ml-1" />
                <span>{form.fields.length} فیلد</span>
              </div>
              {form.metadata.stats && (
                <div className="flex items-center">
                  <UserGroupIcon className="w-4 h-4 ml-1" />
                  <span>{form.metadata.stats.submissions} پاسخ</span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 ml-1" />
              <span>{formatDate(form.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {!readonly && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={onEdit || onSelect}
                  className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                >
                  <PencilIcon className="w-4 h-4 ml-1" />
                  ویرایش
                </button>
                <button
                  onClick={onDuplicate}
                  className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <DocumentDuplicateIcon className="w-4 h-4 ml-1" />
                  کپی
                </button>
              </div>
              
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => onSelect?.()}
                  className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <EyeIcon className="w-4 h-4 ml-1" />
                  مشاهده
                </button>
                <button
                  onClick={onDelete}
                  className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                  <TrashIcon className="w-4 h-4 ml-1" />
                  حذف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 space-x-reverse mb-2">
              <h3 
                className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 truncate"
                onClick={onSelect}
              >
                {form.name}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(form.status)}`}>
                {getStatusText(form.status)}
              </span>
              {form.category && (
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                  {form.category}
                </span>
              )}
            </div>
            
            {form.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                {form.description}
              </p>
            )}
            
            <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <ChartBarIcon className="w-4 h-4 ml-1" />
                <span>{form.fields.length} فیلد</span>
              </div>
              {form.metadata.stats && (
                <div className="flex items-center">
                  <UserGroupIcon className="w-4 h-4 ml-1" />
                  <span>{form.metadata.stats.submissions} پاسخ</span>
                </div>
              )}
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 ml-1" />
                <span>{formatDate(form.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!readonly && (
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={onEdit || onSelect}
                className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              >
                <PencilIcon className="w-4 h-4 ml-1" />
                ویرایش
              </button>
              <button
                onClick={onDuplicate}
                className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <DocumentDuplicateIcon className="w-4 h-4 ml-1" />
                کپی
              </button>
              <button
                onClick={() => onSelect?.()}
                className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <EyeIcon className="w-4 h-4 ml-1" />
                مشاهده
              </button>
              <button
                onClick={onDelete}
                className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                <TrashIcon className="w-4 h-4 ml-1" />
                حذف
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormCard;
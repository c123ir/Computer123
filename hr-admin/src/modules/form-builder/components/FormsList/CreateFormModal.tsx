// src/modules/form-builder/components/FormsList/CreateFormModal.tsx

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useFormsAPI } from '../../hooks/useFormsAPI';
import { CreateFormDto } from '../../types';

interface CreateFormModalProps {
  /** آیا مودال باز است */
  isOpen: boolean;
  /** callback بستن مودال */
  onClose: () => void;
  /** callback موفقیت */
  onSuccess?: (formId: string) => void;
  /** قالب پیش‌فرض */
  template?: Partial<CreateFormDto>;
}

const CreateFormModal: React.FC<CreateFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  template
}) => {
  // =====================================================
  // States
  // =====================================================
  
  const [formData, setFormData] = useState<Partial<CreateFormDto>>({
    name: template?.name || '',
    description: template?.description || '',
    category: template?.category || '',
    tags: template?.tags || [],
    status: 'draft',
    fields: template?.fields || [],
    settings: template?.settings || {
      submitButtonText: 'ارسال',
      showProgressBar: false,
      allowSaveDraft: true,
      showFieldNumbers: false,
      formWidth: 'medium'
    },
    styling: template?.styling || {
      theme: 'default',
      backgroundColor: '#ffffff',
      textColor: '#374151',
      primaryColor: '#3b82f6',
      fontFamily: 'Vazirmatn',
      fontSize: 14,
      borderRadius: 8,
      spacing: 'normal'
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // =====================================================
  // Hooks
  // =====================================================
  
  const { formsAPI } = useFormsAPI();

  const createFormMutation = useMutation({
    mutationFn: (data: CreateFormDto) => formsAPI.createForm(data),
    onSuccess: (newForm) => {
      onSuccess?.(newForm.id);
      onClose();
      setFormData({
        name: '',
        description: '',
        category: '',
        tags: [],
        status: 'draft',
        fields: [],
        settings: {
          submitButtonText: 'ارسال',
          showProgressBar: false,
          allowSaveDraft: true,
          showFieldNumbers: false,
          formWidth: 'medium'
        },
        styling: {
          theme: 'default',
          backgroundColor: '#ffffff',
          textColor: '#374151',
          primaryColor: '#3b82f6',
          fontFamily: 'Vazirmatn',
          fontSize: 14,
          borderRadius: 8,
          spacing: 'normal'
        }
      });
      setErrors({});
    },
    onError: (error: any) => {
      console.error('خطا در ایجاد فرم:', error);
      setErrors({ submit: 'خطا در ایجاد فرم. لطفاً دوباره تلاش کنید.' });
    }
  });

  // =====================================================
  // Event Handlers
  // =====================================================

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    handleInputChange('tags', tags);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'نام فرم الزامی است';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'نام فرم باید حداقل ۲ کاراکتر باشد';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'توضیحات نباید بیش از ۵۰۰ کاراکتر باشد';
    }

    if (formData.category && formData.category.length > 50) {
      newErrors.category = 'دسته‌بندی نباید بیش از ۵۰ کاراکتر باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newForm: CreateFormDto = {
      name: formData.name!,
      description: formData.description,
      fields: formData.fields || [],
      settings: formData.settings!,
      styling: formData.styling!,
      category: formData.category,
      tags: formData.tags || [],
      status: 'draft',
      metadata: {
        createdBy: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
        version: 1
      }
    };

    createFormMutation.mutate(newForm);
  };

  const handleClose = () => {
    if (!createFormMutation.isPending) {
      onClose();
    }
  };

  // =====================================================
  // Predefined Categories
  // =====================================================
  
  const predefinedCategories = [
    'عمومی',
    'ثبت‌نام',
    'نظرسنجی',
    'درخواست',
    'گزارش',
    'پشتیبانی',
    'فروش',
    'منابع انسانی',
    'آموزش',
    'رویداد'
  ];

  // =====================================================
  // Render
  // =====================================================

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                ایجاد فرم جدید
              </h3>
              <button
                onClick={handleClose}
                disabled={createFormMutation.isPending}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  نام فرم *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="نام فرم را وارد کنید"
                  disabled={createFormMutation.isPending}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  توضیحات
                </label>
                <textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    errors.description 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="توضیح کوتاهی از فرم بنویسید"
                  disabled={createFormMutation.isPending}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  دسته‌بندی
                </label>
                <select
                  id="category"
                  value={formData.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  disabled={createFormMutation.isPending}
                >
                  <option value="">دسته‌بندی را انتخاب کنید</option>
                  {predefinedCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  برچسب‌ها
                </label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="برچسب‌ها را با کاما جدا کنید"
                  disabled={createFormMutation.isPending}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  مثال: ثبت‌نام، دوره، برنامه‌نویسی
                </p>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.submit}
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 dark:bg-gray-750 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={createFormMutation.isPending || !formData.name?.trim()}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createFormMutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال ایجاد...
                </>
              ) : (
                'ایجاد فرم'
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={createFormMutation.isPending}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFormModal;
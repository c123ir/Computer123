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

    setErrors({ submit: '' });
    setIsLoading(true);

    try {
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

      await createFormMutation.mutateAsync(newForm);
    } catch (error) {
      console.error('خطا در ایجاد فرم:', error);
      setErrors({ submit: 'خطا در ایجاد فرم. لطفاً دوباره تلاش کنید.' });
    } finally {
      setIsLoading(false);
    }
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
                  className={`
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Form } from '../../modules/form-builder/types';

const Forms: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // TODO: Replace with actual API call
  const { data: forms = [], isLoading } = useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
      // Simulated API response
      return [
        {
          id: '1',
          name: 'فرم ثبت نام',
          description: 'فرم ثبت نام کاربران جدید',
          status: 'published',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: '2',
          name: 'فرم تماس با ما',
          description: 'فرم ارسال پیام به پشتیبانی',
          status: 'draft',
          createdAt: '2024-01-02',
          updatedAt: '2024-01-02'
        }
      ];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">مدیریت فرم‌ها</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          ایجاد فرم جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div
            key={form.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedForm(form)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{form.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                form.status === 'published' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {form.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {form.description}
            </p>

            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span>ایجاد: {new Date(form.createdAt).toLocaleDateString('fa-IR')}</span>
              <span>آخرین ویرایش: {new Date(form.updatedAt).toLocaleDateString('fa-IR')}</span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Handle preview
                  }}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  پیش‌نمایش
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Handle edit
                  }}
                  className="px-3 py-1 text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  ویرایش
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Handle delete
                  }}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for creating/editing form */}
      {(isCreating || selectedForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {isCreating ? 'ایجاد فرم جدید' : 'ویرایش فرم'}
            </h2>
            
            {/* Form fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  عنوان فرم
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="عنوان فرم را وارد کنید"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  توضیحات
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  rows={3}
                  placeholder="توضیحات فرم را وارد کنید"
                />
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setSelectedForm(null);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  // TODO: Handle save
                  setIsCreating(false);
                  setSelectedForm(null);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forms; 
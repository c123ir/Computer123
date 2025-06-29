// src/modules/form-builder/components/FormsList/FormsList.tsx

import React, { useState } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { 
  Plus, Search, Filter, Grid, List, Calendar, Users, BarChart3,
  Star, Archive, Clock, CheckCircle, Loader2
} from 'lucide-react';
import FormCard from './FormCard';
import CreateFormModal from './CreateFormModal';
import { 
  useFormsList, 
  useDeleteForm, 
  useUpdateFormStatus, 
  useCloneForm 
} from '../../hooks/useFormsAPI';
import { FormFilters, Form } from '../../types';

// Type definitions
interface Form {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'archived' | 'paused';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  stats?: {
    totalViews: number;
    totalSubmissions: number;
    completionRate: number;
  };
  category?: string;
  tags?: string[];
}

// Mock data - بعداً از Firebase می‌آید
const mockForms: Form[] = [
  {
    id: '1',
    name: 'فرم ثبت‌نام دوره برنامه‌نویسی',
    description: 'فرم ثبت‌نام برای دوره‌های آموزشی برنامه‌نویسی',
    status: 'published',
    createdAt: '1403/04/08',
    updatedAt: '1403/04/10',
    createdBy: 'علی احمدی',
    stats: {
      totalViews: 150,
      totalSubmissions: 42,
      completionRate: 85
    },
    category: 'آموزش',
    tags: ['ثبت‌نام', 'دوره']
  },
  {
    id: '2',
    name: 'فرم نظرسنجی رضایت مشتری',
    description: 'نظرسنجی از رضایت مشتریان از خدمات ارائه شده',
    status: 'published',
    createdAt: '1403/04/05',
    updatedAt: '1403/04/07',
    createdBy: 'مریم کریمی',
    stats: {
      totalViews: 89,
      totalSubmissions: 23,
      completionRate: 92
    },
    category: 'نظرسنجی',
    tags: ['رضایت', 'مشتری']
  },
  {
    id: '3',
    name: 'فرم درخواست پشتیبانی فنی',
    description: 'فرم ثبت درخواست پشتیبانی فنی و رفع مشکل',
    status: 'draft',
    createdAt: '1403/04/12',
    updatedAt: '1403/04/12',
    createdBy: 'حسن محمدی',
    stats: {
      totalViews: 0,
      totalSubmissions: 0,
      completionRate: 0
    },
    category: 'پشتیبانی',
    tags: ['پشتیبانی', 'فنی']
  }
];

const FormsList: React.FC = () => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'updatedAt' | 'responses'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Build filters for API
  const filters: FormFilters = {
    search: searchTerm || undefined,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    sortBy,
    sortOrder,
    limit: 50, // Adjust as needed
  };

  // API hooks
  const { data: forms = [], isLoading, error, refetch } = useFormsList(filters);
  const deleteFormMutation = useDeleteForm();
  const updateStatusMutation = useUpdateFormStatus();
  const cloneFormMutation = useCloneForm();

  // Handlers for FormCard actions
  const handleEdit = (formId: string) => {
    console.log('Edit form:', formId);
    // Navigate to form builder
    window.location.href = `/forms/${formId}/edit`;
  };

  const handleView = (formId: string) => {
    console.log('View form:', formId);
    // Navigate to form preview
    window.location.href = `/forms/${formId}/preview`;
  };

  const handleCopy = async (formId: string) => {
    try {
      await cloneFormMutation.mutateAsync({
        id: formId,
        createdBy: 'کاربر فعلی' // TODO: Get from auth context
      });
      console.log('Form cloned successfully');
    } catch (error) {
      console.error('Failed to clone form:', error);
    }
  };

  const handleDelete = async (formId: string) => {
    if (window.confirm('آیا از حذف این فرم اطمینان دارید؟')) {
      try {
        await deleteFormMutation.mutateAsync(formId);
        console.log('Form deleted successfully');
      } catch (error) {
        console.error('Failed to delete form:', error);
      }
    }
  };

  const handleStatusChange = async (formId: string, newStatus: Form['status']) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: formId,
        status: newStatus,
        updatedBy: 'کاربر فعلی' // TODO: Get from auth context
      });
      console.log('Form status updated successfully');
    } catch (error) {
      console.error('Failed to update form status:', error);
    }
  };

  const handleShare = (formId: string) => {
    const shareUrl = `${window.location.origin}/forms/${formId}/public`;
    navigator.clipboard.writeText(shareUrl);
    console.log('Form URL copied to clipboard');
  };

  const handleFormCreated = () => {
    // React Query will automatically refetch the list
    console.log('Form created, list will refresh automatically');
  };

  // فیلتر کردن فرم‌ها (اکنون در backend انجام می‌شود)
  const filteredForms = forms;

  // مرتب‌سازی فرم‌ها (اکنون در backend انجام می‌شود)
  const sortedForms = filteredForms;

  // دسته‌های موجود
  const categories = Array.from(new Set(forms.map((form: Form) => form.category).filter(Boolean))) as string[];

  // Loading and Error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
            در حال بارگذاری فرم‌ها...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`
        text-center py-12 rounded-xl backdrop-blur-xl border
        ${isDark 
          ? 'bg-red-900/20 border-red-700/30 text-red-400' 
          : 'bg-red-50 border-red-200 text-red-700'
        }
      `}>
        <h3 className="text-lg font-medium mb-2">خطا در بارگذاری فرم‌ها</h3>
        <p className="mb-4">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  // Status badge component (moved to FormCard)
  // const StatusBadge = ({ status }: { status: Form['status'] }) => { ... }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            مدیریت فرم‌ها
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            ایجاد، ویرایش و مدیریت فرم‌های سازمانی
          </p>
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          ایجاد فرم جدید
        </button>
      </div>

      {/* Filters & Search */}
      <div className={`
        p-6 rounded-xl backdrop-blur-xl border
        ${isDark 
          ? 'bg-gray-800/30 border-gray-700/30' 
          : 'bg-white/30 border-white/30'
        }
      `}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 
              ${isDark ? 'text-gray-400' : 'text-gray-500'}
            `} />
            <input
              type="text"
              placeholder="جستجوی فرم‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                w-full pr-10 pl-4 py-3 rounded-lg border backdrop-blur-xl
                ${isDark 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`
              px-4 py-3 rounded-lg border backdrop-blur-xl min-w-[150px]
              ${isDark 
                ? 'bg-gray-700/50 border-gray-600 text-white' 
                : 'bg-white/50 border-gray-300 text-gray-900'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
          >
            <option value="all">همه دسته‌ها</option>
            {categories.map((category: string) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`
              px-4 py-3 rounded-lg border backdrop-blur-xl min-w-[150px]
              ${isDark 
                ? 'bg-gray-700/50 border-gray-600 text-white' 
                : 'bg-white/50 border-gray-300 text-gray-900'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="published">منتشر شده</option>
            <option value="draft">پیش‌نویس</option>
            <option value="archived">آرشیو</option>
            <option value="paused">متوقف</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`
                p-3 transition-colors
                ${viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-gray-700/50 text-gray-400 hover:text-white'
                    : 'bg-white/50 text-gray-500 hover:text-gray-900'
                }
              `}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`
                p-3 transition-colors
                ${viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-gray-700/50 text-gray-400 hover:text-white'
                    : 'bg-white/50 text-gray-500 hover:text-gray-900'
                }
              `}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            مرتب‌سازی بر اساس:
          </span>
          <div className="flex gap-2">
            {[
              { value: 'updatedAt', label: 'تاریخ ویرایش' },
              { value: 'name', label: 'نام فرم' },
              { value: 'responses', label: 'تعداد پاسخ' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as any)}
                className={`
                  px-3 py-1 rounded-md text-sm transition-colors
                  ${sortBy === option.value
                    ? 'bg-blue-600 text-white'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {filteredForms.length} فرم یافت شد
        </p>
      </div>

      {/* Forms Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedForms.map((form: Form) => (
            <FormCard
              key={form.id}
              form={form}
              viewMode="grid"
              onEdit={handleEdit}
              onView={handleView}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onShare={handleShare}
            />
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-3">
          {sortedForms.map((form: Form) => (
            <FormCard
              key={form.id}
              form={form}
              viewMode="list"
              onEdit={handleEdit}
              onView={handleView}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onShare={handleShare}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedForms.length === 0 && (
        <div className={`
          text-center py-12 rounded-xl backdrop-blur-xl border
          ${isDark 
            ? 'bg-gray-800/30 border-gray-700/30' 
            : 'bg-white/30 border-white/30'
          }
        `}>
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
            ${isDark ? 'bg-gray-700' : 'bg-gray-100'}
          `}>
            <Search className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            فرمی یافت نشد
          </h3>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            {searchTerm ? 'نتیجه‌ای برای جستجوی شما یافت نشد' : 'هنوز فرمی ایجاد نکرده‌اید'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              ایجاد اولین فرم
            </button>
          )}
        </div>
      )}

      {/* Create Form Modal */}
      <CreateFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onFormCreated={handleFormCreated}
      />
    </div>
  );
};

export default FormsList;
// =====================================================
// 🔧 فایل: src/modules/form-builder/components/FormsList/FormsList.tsx
// =====================================================

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline';

// Import types - using proper imports to avoid conflicts
import type { 
  Form, 
  FormFilters, 
  PaginatedResponse 
} from '../../types';

// Import hooks - using proper import
import { useFormsAPI } from '../../hooks/useFormsAPI';

// Components
import FormCard from './FormCard';
import CreateFormModal from './CreateFormModal';

interface FormsListProps {
  /** حالت نمایش */
  viewMode?: 'grid' | 'list';
  /** فیلترهای پیش‌فرض */
  defaultFilters?: Partial<FormFilters>;
  /** callback انتخاب فرم */
  onSelectForm?: (form: Form) => void;
  /** فقط خواندنی */
  readonly?: boolean;
}

const FormsList: React.FC<FormsListProps> = ({
  viewMode = 'grid',
  defaultFilters = {},
  onSelectForm,
  readonly = false
}) => {
  // =====================================================
  // States
  // =====================================================
  
  const [selectedViewMode, setSelectedViewMode] = useState<'grid' | 'list'>(viewMode);
  const [searchTerm, setSearchTerm] = useState(defaultFilters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(defaultFilters.category || '');
  const [selectedStatus, setSelectedStatus] = useState(defaultFilters.status || '');
  const [sortBy, setSortBy] = useState<FormFilters['sortBy']>(defaultFilters.sortBy || 'updatedAt');
  const [sortOrder, setSortOrder] = useState<FormFilters['sortOrder']>(defaultFilters.sortOrder || 'desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // =====================================================
  // Hooks
  // =====================================================
  
  const queryClient = useQueryClient();
  const { formsAPI } = useFormsAPI();

  // Query filters
  const filters: FormFilters = useMemo(() => ({
    search: searchTerm,
    category: selectedCategory || undefined,
    status: selectedStatus || undefined,
    sortBy,
    sortOrder,
    page: currentPage,
    limit: 12
  }), [searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder, currentPage]);

  // Fetch forms
  const { 
    data: formsResponse, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['forms', filters],
    queryFn: () => formsAPI.getForms(filters),
    placeholderData: (previousData) => previousData
  });

  const forms = formsResponse?.data || [];
  const pagination = formsResponse?.pagination;

  // Mutations
  const deleteFormMutation = useMutation({
    mutationFn: (formId: string) => formsAPI.deleteForm(formId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    }
  });

  const duplicateFormMutation = useMutation({
    mutationFn: (formId: string) => formsAPI.duplicateForm(formId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Form['status'] }) => 
      formsAPI.updateFormStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    }
  });

  // =====================================================
  // Event Handlers
  // =====================================================

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleSort = (field: FormFilters['sortBy']) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handleDeleteForm = async (formId: string) => {
    if (window.confirm('آیا از حذف این فرم اطمینان دارید؟')) {
      try {
        await deleteFormMutation.mutateAsync(formId);
      } catch (error) {
        console.error('خطا در حذف فرم:', error);
      }
    }
  };

  const handleDuplicateForm = async (formId: string) => {
    try {
      await duplicateFormMutation.mutateAsync(formId);
    } catch (error) {
      console.error('خطا در کپی فرم:', error);
    }
  };

  const handleStatusChange = async (formId: string, newStatus: Form['status']) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: formId,
        status: newStatus
      });
    } catch (error) {
      console.error('خطا در تغییر وضعیت:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateForm = () => {
    setShowCreateModal(true);
  };

  // =====================================================
  // Derived Data
  // =====================================================

  // دسته‌های موجود
  const categories = Array.from(
    new Set(forms.map((form: Form) => form.category).filter(Boolean))
  ) as string[];

  // Loading and Error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">خطا در بارگذاری فرم‌ها</div>
        <button 
          onClick={() => refetch()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  // Sorted forms for display
  const sortedForms = [...forms].sort((a, b) => {
    const aValue = a[sortBy as keyof Form];
    const bValue = b[sortBy as keyof Form];
    
    // Handle undefined values
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // =====================================================
  // Render
  // =====================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            مدیریت فرم‌ها
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {forms.length} فرم موجود
          </p>
        </div>
        
        {!readonly && (
          <button
            onClick={handleCreateForm}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            فرم جدید
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در فرم‌ها..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">همه دسته‌ها</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="draft">پیش‌نویس</option>
            <option value="published">منتشر شده</option>
            <option value="archived">بایگانی</option>
            <option value="paused">متوقف</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex rounded-md border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setSelectedViewMode('grid')}
              className={`px-3 py-2 rounded-r-md ${
                selectedViewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSelectedViewMode('list')}
              className={`px-3 py-2 rounded-l-md border-r border-gray-300 dark:border-gray-600 ${
                selectedViewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">مرتب‌سازی:</span>
          {(['name', 'createdAt', 'updatedAt'] as const).map((field) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`px-3 py-1 text-sm rounded-md ${
                sortBy === field
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {field === 'name' && 'نام'}
              {field === 'createdAt' && 'تاریخ ایجاد'}
              {field === 'updatedAt' && 'آخرین بروزرسانی'}
              {sortBy === field && (
                <span className="ml-1">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Forms Grid/List */}
      {forms.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            هیچ فرمی یافت نشد
          </div>
          {!readonly && (
            <button
              onClick={handleCreateForm}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              اولین فرم را بسازید
            </button>
          )}
        </div>
      ) : (
        <>
          {selectedViewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedForms.map((form: Form) => (
                <FormCard
                  key={form.id}
                  form={form}
                  onSelect={() => onSelectForm?.(form)}
                  onDelete={() => handleDeleteForm(form.id)}
                  onDuplicate={() => handleDuplicateForm(form.id)}
                  onStatusChange={(status) => handleStatusChange(form.id, status)}
                  readonly={readonly}
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
                  onSelect={() => onSelectForm?.(form)}
                  onDelete={() => handleDeleteForm(form.id)}
                  onDuplicate={() => handleDuplicateForm(form.id)}
                  onStatusChange={(status) => handleStatusChange(form.id, status)}
                  readonly={readonly}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 space-x-reverse">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                قبلی
              </button>
              
              <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                صفحه {currentPage} از {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                بعدی
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Form Modal */}
      {showCreateModal && (
        <CreateFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries({ queryKey: ['forms'] });
          }}
        />
      )}
    </div>
  );
};

export default FormsList;
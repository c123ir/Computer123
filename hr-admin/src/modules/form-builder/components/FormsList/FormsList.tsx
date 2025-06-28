import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Plus, Search, Filter, Grid, List, Edit, Eye, Copy, 
  Trash2, MoreVertical, Calendar, Users, BarChart3,
  Star, Archive, Clock, CheckCircle
} from 'lucide-react';

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
  const [forms, setForms] = useState<Form[]>(mockForms);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'submissions'>('date');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // فیلتر کردن فرم‌ها
  const filteredForms = forms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || form.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // مرتب‌سازی فرم‌ها
  const sortedForms = [...filteredForms].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'submissions':
        return (b.stats?.totalSubmissions || 0) - (a.stats?.totalSubmissions || 0);
      case 'date':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  // دسته‌های موجود
  const categories = Array.from(new Set(forms.map(form => form.category).filter(Boolean)));

  // Status badge component
  const StatusBadge = ({ status }: { status: Form['status'] }) => {
    const statusConfig = {
      published: { 
        label: 'منتشر شده', 
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        icon: CheckCircle
      },
      draft: { 
        label: 'پیش‌نویس', 
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
        icon: Clock
      },
      archived: { 
        label: 'آرشیو', 
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: Archive
      },
      paused: { 
        label: 'متوقف', 
        className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        icon: Clock
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

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
            {categories.map(category => (
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
              { value: 'date', label: 'تاریخ ویرایش' },
              { value: 'name', label: 'نام فرم' },
              { value: 'submissions', label: 'تعداد پاسخ' }
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
          {sortedForms.map(form => (
            <div
              key={form.id}
              className={`
                p-6 rounded-xl backdrop-blur-xl border transition-all hover:scale-105
                ${isDark 
                  ? 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50' 
                  : 'bg-white/30 border-white/30 hover:bg-white/50'
                }
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                    {form.name}
                  </h3>
                  {form.description && (
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1 line-clamp-2`}>
                      {form.description}
                    </p>
                  )}
                </div>
                
                <div className="relative mr-2">
                  <button className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700`}>
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status & Category */}
              <div className="flex items-center gap-2 mb-4">
                <StatusBadge status={form.status} />
                {form.category && (
                  <span className={`px-2 py-1 rounded-full text-xs 
                    ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}
                  `}>
                    {form.category}
                  </span>
                )}
              </div>

              {/* Stats */}
              {form.stats && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {form.stats.totalViews}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      بازدید
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {form.stats.totalSubmissions}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      پاسخ
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {form.stats.completionRate}%
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      تکمیل
                    </div>
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <Calendar className="w-3 h-3 ml-1" />
                <span>ویرایش: {form.updatedAt}</span>
                <span className="mx-2">•</span>
                <Users className="w-3 h-3 ml-1" />
                <span>{form.createdBy}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className={`
                  flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg
                  ${isDark 
                    ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300' 
                    : 'bg-gray-100/50 hover:bg-gray-100 text-gray-700'
                  }
                  transition-colors
                `}>
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">مشاهده</span>
                </button>
                
                <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">ویرایش</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-3">
          {sortedForms.map(form => (
            <div
              key={form.id}
              className={`
                p-4 rounded-lg backdrop-blur-xl border
                ${isDark 
                  ? 'bg-gray-800/30 border-gray-700/30' 
                  : 'bg-white/30 border-white/30'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {form.name}
                    </h3>
                    <StatusBadge status={form.status} />
                    {form.category && (
                      <span className={`px-2 py-1 rounded-full text-xs 
                        ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}
                      `}>
                        {form.category}
                      </span>
                    )}
                  </div>
                  {form.description && (
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      {form.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-6 ml-4">
                  {/* Stats */}
                  {form.stats && (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className={isDark ? 'text-white' : 'text-gray-900'}>
                          {form.stats.totalViews}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          بازدید
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={isDark ? 'text-white' : 'text-gray-900'}>
                          {form.stats.totalSubmissions}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          پاسخ
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className={`
                      p-2 rounded-lg
                      ${isDark 
                        ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300' 
                        : 'bg-gray-100/50 hover:bg-gray-100 text-gray-700'
                      }
                      transition-colors
                    `}>
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>

                    <button className={`
                      p-2 rounded-lg
                      ${isDark 
                        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }
                      transition-colors
                    `}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Create Form Modal - فعلاً placeholder */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`
            w-full max-w-md p-6 rounded-xl
            ${isDark ? 'bg-gray-800' : 'bg-white'}
          `}>
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ایجاد فرم جدید
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              این بخش در مرحله بعد پیاده‌سازی می‌شود
            </p>
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsList;
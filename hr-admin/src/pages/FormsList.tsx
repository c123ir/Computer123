import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Form {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  submissions: number;
  fields: number;
}

const FormsList: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // فرم‌های نمونه
  const [forms] = useState<Form[]>([
    {
      id: '1',
      name: 'فرم ثبت‌نام کارمندان',
      description: 'فرم جامع ثبت‌نام کارمندان جدید',
      status: 'published',
      createdAt: '1403/05/15',
      submissions: 24,
      fields: 12
    },
    {
      id: '2',
      name: 'نظرسنجی رضایت مشتریان',
      description: 'ارزیابی رضایت مشتریان از خدمات',
      status: 'published',
      createdAt: '1403/05/10',
      submissions: 156,
      fields: 8
    },
    {
      id: '3',
      name: 'درخواست مرخصی',
      description: 'فرم درخواست انواع مرخصی برای کارمندان',
      status: 'draft',
      createdAt: '1403/05/20',
      submissions: 0,
      fields: 6
    }
  ]);

  const getStatusBadge = (status: Form['status']) => {
    const statusConfig = {
      published: { 
        label: 'منتشر شده', 
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
      },
      draft: { 
        label: 'پیش‌نویس', 
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' 
      },
      archived: { 
        label: 'آرشیو شده', 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' 
      }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || form.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            مدیریت فرم‌ها
          </h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            ایجاد، ویرایش و مدیریت فرم‌های سیستم
          </p>
        </div>
        
        <button
          onClick={() => navigate('/forms/create')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          ایجاد فرم جدید
        </button>
      </div>

      {/* Filters */}
      <div className={`
        rounded-xl p-6 backdrop-blur-xl border
        ${isDark 
          ? 'bg-gray-800/30 border-gray-700/30' 
          : 'bg-white/30 border-white/30'
        }
      `}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              type="text"
              placeholder="جستجو در فرم‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                w-full pl-4 pr-10 py-3 rounded-lg border
                ${isDark 
                  ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              `}
              dir="rtl"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`
              px-4 py-3 rounded-lg border min-w-[150px]
              ${isDark 
                ? 'bg-gray-800/50 border-gray-700 text-white' 
                : 'bg-white/50 border-gray-200 text-gray-900'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            `}
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="published">منتشر شده</option>
            <option value="draft">پیش‌نویس</option>
            <option value="archived">آرشیو شده</option>
          </select>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map((form) => (
          <div
            key={form.id}
            className={`
              group rounded-xl p-6 backdrop-blur-xl border transition-all duration-300 
              hover:scale-105 hover:shadow-2xl cursor-pointer
              ${isDark 
                ? 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50' 
                : 'bg-white/30 border-white/30 hover:bg-white/50'
              }
            `}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {form.name}
                </h3>
                {form.description && (
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {form.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(form.status)}
                <button className={`
                  p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity
                  ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                `}>
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {form.submissions} پاسخ
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {form.fields} فیلد
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 mb-4">
              <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                ایجاد: {form.createdAt}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/forms/${form.id}/preview`)}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg
                  ${isDark 
                    ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300' 
                    : 'bg-gray-100/50 hover:bg-gray-100 text-gray-700'
                  }
                  transition-colors
                `}
              >
                <Eye className="w-4 h-4" />
                <span className="text-xs">مشاهده</span>
              </button>
              
              <button
                onClick={() => navigate(`/forms/${form.id}/edit`)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span className="text-xs">ویرایش</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredForms.length === 0 && (
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
              onClick={() => navigate('/forms/create')}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              ایجاد اولین فرم
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FormsList; 
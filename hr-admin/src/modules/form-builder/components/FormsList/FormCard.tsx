// src/modules/form-builder/components/FormsList/FormCard.tsx

import React, { useState } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { 
  Edit, Eye, Copy, Trash2, MoreVertical, Calendar, Users, 
  BarChart3, Star, Archive, Clock, CheckCircle, Play, 
  Pause, Download, Share, Settings, TrendingUp, ExternalLink
} from 'lucide-react';

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
    averageTime?: number;
  };
  category?: string;
  tags?: string[];
}

interface FormCardProps {
  form: Form;
  viewMode?: 'grid' | 'list';
  onEdit?: (formId: string) => void;
  onView?: (formId: string) => void;
  onCopy?: (formId: string) => void;
  onDelete?: (formId: string) => void;
  onStatusChange?: (formId: string, newStatus: Form['status']) => void;
  onShare?: (formId: string) => void;
}

const FormCard: React.FC<FormCardProps> = ({
  form,
  viewMode = 'grid',
  onEdit,
  onView,
  onCopy,
  onDelete,
  onStatusChange,
  onShare
}) => {
  const { isDark } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
        icon: Pause
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

  // Dropdown Menu Component
  const ActionMenu = () => (
    <div className={`
      absolute left-0 top-8 z-10 w-48 rounded-lg shadow-lg border backdrop-blur-xl
      ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}>
      <div className="p-1">
        {/* Primary Actions */}
        <button
          onClick={() => {
            onEdit?.(form.id);
            setShowMenu(false);
          }}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm
            ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}
          `}
        >
          <Edit className="w-4 h-4" />
          ویرایش فرم
        </button>
        
        <button
          onClick={() => {
            onView?.(form.id);
            setShowMenu(false);
          }}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm
            ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}
          `}
        >
          <Eye className="w-4 h-4" />
          پیش‌نمایش
        </button>

        <button
          onClick={() => {
            onCopy?.(form.id);
            setShowMenu(false);
          }}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm
            ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}
          `}
        >
          <Copy className="w-4 h-4" />
          کپی فرم
        </button>

        <button
          onClick={() => {
            onShare?.(form.id);
            setShowMenu(false);
          }}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm
            ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}
          `}
        >
          <Share className="w-4 h-4" />
          اشتراک‌گذاری
        </button>

        <div className={`h-px my-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

        {/* Status Actions */}
        {form.status === 'draft' && (
          <button
            onClick={() => {
              onStatusChange?.(form.id, 'published');
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <Play className="w-4 h-4" />
            انتشار فرم
          </button>
        )}

        {form.status === 'published' && (
          <button
            onClick={() => {
              onStatusChange?.(form.id, 'paused');
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
          >
            <Pause className="w-4 h-4" />
            توقف فرم
          </button>
        )}

        {form.status === 'paused' && (
          <button
            onClick={() => {
              onStatusChange?.(form.id, 'published');
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <Play className="w-4 h-4" />
            فعال‌سازی
          </button>
        )}

        <button
          onClick={() => {
            onStatusChange?.(form.id, 'archived');
            setShowMenu(false);
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Archive className="w-4 h-4" />
          آرشیو
        </button>

        <div className={`h-px my-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

        {/* Danger Actions */}
        <button
          onClick={() => {
            onDelete?.(form.id);
            setShowMenu(false);
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-4 h-4" />
          حذف فرم
        </button>
      </div>
    </div>
  );

  // Grid View
  if (viewMode === 'grid') {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative p-6 rounded-xl backdrop-blur-xl border transition-all duration-300
          ${isDark 
            ? 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50' 
            : 'bg-white/30 border-white/30 hover:bg-white/50'
          }
          ${isHovered ? 'transform scale-105 shadow-xl' : ''}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
              {form.name}
            </h3>
            {form.description && (
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1 line-clamp-2`}>
                {form.description}
              </p>
            )}
          </div>
          
          <div className="relative mr-2">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={`
                p-1 rounded-md transition-colors
                ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}
              `}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && <ActionMenu />}
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
              <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {form.stats.totalViews.toLocaleString()}
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                بازدید
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {form.stats.totalSubmissions.toLocaleString()}
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                پاسخ
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {form.stats.completionRate}%
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                تکمیل
              </div>
            </div>
          </div>
        )}

        {/* Completion Rate Bar */}
        {form.stats && (
          <div className="mb-4">
            <div className={`flex items-center justify-between text-xs mb-1
              ${isDark ? 'text-gray-400' : 'text-gray-500'}
            `}>
              <span>نرخ تکمیل</span>
              <span>{form.stats.completionRate}%</span>
            </div>
            <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                style={{ width: `${form.stats.completionRate}%` }}
              />
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className={`flex items-center text-xs mb-4
          ${isDark ? 'text-gray-400' : 'text-gray-500'}
        `}>
          <Calendar className="w-3 h-3 ml-1" />
          <span>ویرایش: {form.updatedAt}</span>
          <span className="mx-2">•</span>
          <Users className="w-3 h-3 ml-1" />
          <span>{form.createdBy}</span>
        </div>

        {/* Tags */}
        {form.tags && form.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {form.tags.slice(0, 3).map(tag => (
              <span 
                key={tag}
                className={`px-2 py-1 rounded-md text-xs
                  ${isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100/50 text-gray-600'}
                `}
              >
                {tag}
              </span>
            ))}
            {form.tags.length > 3 && (
              <span className={`px-2 py-1 rounded-md text-xs
                ${isDark ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100/50 text-gray-500'}
              `}>
                +{form.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => onView?.(form.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm
              ${isDark 
                ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300' 
                : 'bg-gray-100/50 hover:bg-gray-100 text-gray-700'
              }
              transition-colors
            `}
          >
            <Eye className="w-4 h-4" />
            مشاهده
          </button>
          
          <button 
            onClick={() => onEdit?.(form.id)}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm"
          >
            <Edit className="w-4 h-4" />
            ویرایش
          </button>
        </div>

        {/* Performance Indicator */}
        {form.stats && form.stats.totalSubmissions > 10 && (
          <div className="absolute top-4 left-4">
            <div className={`
              flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
              ${form.stats.completionRate > 80 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : form.stats.completionRate > 60
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }
            `}>
              <TrendingUp className="w-3 h-3" />
              {form.stats.completionRate > 80 ? 'عالی' : form.stats.completionRate > 60 ? 'خوب' : 'نیاز به بهبود'}
            </div>
          </div>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className={`
      p-4 rounded-lg backdrop-blur-xl border transition-all
      ${isDark 
        ? 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50' 
        : 'bg-white/30 border-white/30 hover:bg-white/50'
      }
    `}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
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
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate`}>
              {form.description}
            </p>
          )}

          <div className={`flex items-center gap-4 mt-2 text-xs
            ${isDark ? 'text-gray-400' : 'text-gray-500'}
          `}>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {form.updatedAt}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {form.createdBy}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mr-4">
          {/* Stats - List View */}
          {form.stats && (
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {form.stats.totalViews.toLocaleString()}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  بازدید
                </div>
              </div>
              <div className="text-center">
                <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {form.stats.totalSubmissions.toLocaleString()}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  پاسخ
                </div>
              </div>
              <div className="text-center">
                <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {form.stats.completionRate}%
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  تکمیل
                </div>
              </div>
            </div>
          )}

          {/* Actions - List View */}
          <div className="flex gap-2">
            <button 
              onClick={() => onView?.(form.id)}
              className={`
                p-2 rounded-lg transition-colors
                ${isDark 
                  ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-100/50 hover:bg-gray-100 text-gray-700'
                }
              `}
            >
              <Eye className="w-4 h-4" />
            </button>
            
            <button 
              onClick={() => onEdit?.(form.id)}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className={`
                  p-2 rounded-lg transition-colors
                  ${isDark 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showMenu && <ActionMenu />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCard;
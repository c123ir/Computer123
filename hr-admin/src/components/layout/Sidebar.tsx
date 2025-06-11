// src/components/layout/Sidebar.tsx - نسخه ساده بدون خطا
import React from 'react';
import { 
  Home, 
  ShoppingCart, 
  Users, 
  UserCheck, 
  DollarSign, 
  Shield, 
  Tag, 
  FileText,  // استفاده از FileText بجای FileEdit
  Settings, 
  MessageSquare, 
  FileText as DocumentIcon, 
  Brain, 
  BarChart3, 
  Workflow, 
  Database,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggle, 
  isMobile, 
  isOpen, 
  onClose 
}) => {
  const { isDark } = useTheme();
  const currentPath = window.location.pathname;

  const menuItems = [
    { 
      id: 'dashboard', 
      title: 'داشبورد', 
      icon: Home, 
      path: '/',
      description: 'نمای کلی سیستم'
    },
    { 
      id: 'sales', 
      title: 'مدیریت فروش', 
      icon: ShoppingCart, 
      path: '/sales',
      description: 'مدیریت فرایند فروش'
    },
    { 
      id: 'customers', 
      title: 'مدیریت مشتریان', 
      icon: Users, 
      path: '/customers',
      description: 'اطلاعات مشتریان'
    },
    { 
      id: 'employees', 
      title: 'مدیریت پرسنل', 
      icon: UserCheck, 
      path: '/employees',
      description: 'مدیریت کارمندان'
    },
    { 
      id: 'investors', 
      title: 'سرمایه گزاران', 
      icon: DollarSign, 
      path: '/investors',
      description: 'اطلاعات سرمایه گذاران'
    },
    { 
      id: 'users', 
      title: 'مدیریت کاربران', 
      icon: Shield, 
      path: '/users',
      description: 'مدیریت دسترسی ها'
    },
    { 
      id: 'tags', 
      title: 'مدیریت برچسب ها', 
      icon: Tag, 
      path: '/tags',
      description: 'دسته بندی و برچسب ها'
    },
    { 
      id: 'forms', 
      title: 'مدیریت فرم ها', 
      icon: FileText, // تغییر از FileEdit به FileText
      path: '/forms',
      description: 'فرم های سیستم'
    },
    { 
      id: 'settings', 
      title: 'تنظیمات', 
      icon: Settings, 
      path: '/settings',
      description: 'تنظیمات سیستم'
    },
    { 
      id: 'sms', 
      title: 'مدیریت پیامک', 
      icon: MessageSquare, 
      path: '/sms',
      description: 'ارسال و مدیریت پیامک'
    },
    { 
      id: 'documents', 
      title: 'مدیریت اسناد', 
      icon: DocumentIcon, 
      path: '/documents',
      description: 'اسناد و مدارک'
    },
    { 
      id: 'ai', 
      title: 'هوش مصنوعی', 
      icon: Brain, 
      path: '/ai',
      description: 'ابزارهای هوش مصنوعی'
    },
    { 
      id: 'reports', 
      title: 'گزارشات', 
      icon: BarChart3, 
      path: '/reports',
      description: 'گزارش گیری و آمار'
    },
    { 
      id: 'workflows', 
      title: 'مدیریت فرایندها', 
      icon: Workflow, 
      path: '/workflows',
      description: 'طراحی و مدیریت فرایندها'
    },
    { 
      id: 'databases', 
      title: 'مدیریت پایگاه داده ها', 
      icon: Database, 
      path: '/databases',
      description: 'مدیریت دیتابیس'
    }
  ];

  const sidebarClasses = `
    fixed lg:relative top-0 right-0 h-full z-40 transition-all duration-300 ease-in-out
    ${isMobile 
      ? `${isOpen ? 'translate-x-0' : 'translate-x-full'} w-80 lg:w-64` 
      : isCollapsed 
        ? 'w-16' 
        : 'w-64'
    }
    ${isDark 
      ? 'bg-gray-900/95 border-gray-700/30' 
      : 'bg-white/95 border-white/30'
    }
    backdrop-blur-xl border-l shadow-2xl
  `;

  const renderMenuItem = (item: typeof menuItems[0]) => {
    const IconComponent = item.icon;
    const isActive = currentPath === item.path;
    
    return (
      <div
        key={item.id}
        className={`
          group relative cursor-pointer transition-all duration-200
          ${isActive 
            ? isDark 
              ? 'bg-blue-600/20 border-r-2 border-blue-400' 
              : 'bg-blue-50 border-r-2 border-blue-500'
            : 'hover:bg-gray-500/10'
          }
        `}
        onClick={() => {
          window.location.href = item.path;
          if (isMobile) onClose();
        }}
      >
        <div className={`
          flex items-center gap-3 p-4
          ${isCollapsed && !isMobile ? 'justify-center' : 'justify-start'}
        `}>
          <IconComponent 
            size={20} 
            className={`
              transition-colors duration-200
              ${isActive 
                ? isDark 
                  ? 'text-blue-400' 
                  : 'text-blue-600'
                : isDark 
                  ? 'text-gray-300 group-hover:text-blue-400' 
                  : 'text-gray-600 group-hover:text-blue-600'
              }
            `}
          />
          
          {(!isCollapsed || isMobile) && (
            <span className={`
              text-sm font-medium transition-colors duration-200
              ${isActive 
                ? isDark 
                  ? 'text-blue-400' 
                  : 'text-blue-600'
                : isDark 
                  ? 'text-gray-300 group-hover:text-blue-400' 
                  : 'text-gray-700 group-hover:text-blue-600'
              }
            `}>
              {item.title}
            </span>
          )}
        </div>

        {/* Tooltip for collapsed sidebar */}
        {isCollapsed && !isMobile && (
          <div className="
            absolute left-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1
            bg-gray-900 text-white text-xs rounded whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            pointer-events-none z-50
          ">
            {item.title}
            <div className="absolute right-full top-1/2 -translate-y-1/2 
                          border-4 border-transparent border-l-gray-900"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {/* Header */}
        <div className={`
          p-4 border-b
          ${isDark ? 'border-gray-700/30' : 'border-gray-200/30'}
        `}>
          <div className="flex items-center justify-between">
            {(!isCollapsed || isMobile) && (
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  ${isDark 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                    : 'bg-gradient-to-br from-blue-400 to-purple-500'
                  }
                  shadow-lg
                `}>
                  <span className="text-white font-bold text-lg">۱۲۳</span>
                </div>
                <div>
                  <h2 className={`
                    text-sm font-bold
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}>
                    مجتمع کامپیوتر
                  </h2>
                  <p className={`
                    text-xs
                    ${isDark ? 'text-gray-400' : 'text-gray-500'}
                  `}>
                    یک دو سه
                  </p>
                </div>
              </div>
            )}
            
            {/* Toggle Button */}
            {!isMobile && (
              <button
                onClick={onToggle}
                className={`
                  p-1 rounded-lg transition-colors duration-200
                  ${isDark 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                  }
                `}
              >
                {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            )}

            {/* Mobile Close Button */}
            {isMobile && (
              <button
                onClick={onClose}
                className={`
                  p-1 rounded-lg transition-colors duration-200
                  ${isDark 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                  }
                `}
              >
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto">
          <div className="py-2">
            {menuItems.map(renderMenuItem)}
          </div>
        </nav>

        {/* Footer */}
        {(!isCollapsed || isMobile) && (
          <div className={`
            p-4 border-t
            ${isDark ? 'border-gray-700/30' : 'border-gray-200/30'}
          `}>
            <div className={`
              text-xs text-center
              ${isDark ? 'text-gray-500' : 'text-gray-400'}
            `}>
              ورژن ۲.۰ - سیستم مدیریت فرایند
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
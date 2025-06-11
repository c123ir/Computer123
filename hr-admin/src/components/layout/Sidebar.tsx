// src/components/layout/Sidebar.tsx
// نوار کناری بهینه شده برای Grid Layout

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  BarChart3,
  Clock,
  CreditCard,
  ChevronLeft
} from 'lucide-react';
import { SidebarProps, MenuItem } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

// تابع برای دریافت آیکون بر اساس نام
const getIcon = (iconName: string) => {
  const icons: { [key: string]: React.ElementType } = {
    Home,
    Users,
    Calendar,
    FileText,
    Settings,
    BarChart3,
    Clock,
    CreditCard
  };
  
  const IconComponent = icons[iconName] || Home;
  return <IconComponent className="w-5 h-5" />;
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, menuItems }) => {
  const location = useLocation();
  const { isDark } = useTheme();

  return (
    <aside 
      className={`
        h-screen flex flex-col
        ${isDark 
          ? 'bg-gray-900/90 backdrop-blur-xl border-gray-700/50' 
          : 'bg-white/90 backdrop-blur-xl border-gray-200/50'
        }
        border-l shadow-glass
        ${isCollapsed ? 'w-16' : 'w-64'}
        transition-all duration-300
      `}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* قسمت لوگو */}
      <div className={`
        h-16 flex items-center justify-center border-b flex-shrink-0
        ${isDark ? 'border-gray-700/30' : 'border-gray-200/30'}
      `}>
        {isCollapsed ? (
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-white/20">
            <img 
              src="/logo.svg" 
              alt="لوگو مجتمع کامپیوتر یک دو سه" 
              className="w-8 h-8 object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 w-full">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 border border-white/20">
              <img 
                src="/logo.svg" 
                alt="لوگو مجتمع کامپیوتر یک دو سه" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className={`font-bold font-vazir text-sm truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                مجتمع کامپیوتر
              </h2>
              <p className={`text-xs font-vazir truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                یک دو سه
              </p>
            </div>
          </div>
        )}
      </div>

      {/* منوی اصلی */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => (
            <div key={item.id}>
              <Link
                to={item.path}
                className={`
                  group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg
                  transition-all duration-200 relative w-full
                  ${location.pathname === item.path 
                    ? isDark
                      ? 'bg-blue-600/30 text-blue-300 backdrop-blur-sm border border-blue-500/30' 
                      : 'bg-blue-50/50 text-blue-700 backdrop-blur-sm border border-blue-200/50'
                    : isDark
                      ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                      : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                style={{
                  textDecoration: 'none',
                  listStyle: 'none',
                }}
                title={isCollapsed ? item.title : ''}
              >
                {/* آیکون */}
                <span className={`flex-shrink-0 ${isCollapsed ? '' : 'ml-3'}`}>
                  {getIcon(item.icon)}
                </span>
                
                {/* عنوان منو */}
                {!isCollapsed && (
                  <span className="font-vazir text-right flex-1 truncate">
                    {item.title}
                  </span>
                )}

                {/* نشانگر صفحه فعال */}
                {!isCollapsed && location.pathname === item.path && (
                  <div className={`
                    w-2 h-2 rounded-full flex-shrink-0
                    ${isDark ? 'bg-blue-400' : 'bg-blue-600'}
                  `} />
                )}

                {/* Tooltip برای حالت جمع شده */}
                {isCollapsed && (
                  <div className={`
                    absolute right-full mr-2 px-3 py-2 text-xs font-vazir
                    rounded-lg opacity-0 invisible group-hover:opacity-100 
                    group-hover:visible transition-all duration-200 whitespace-nowrap z-50
                    ${isDark 
                      ? 'bg-gray-800/90 text-white border border-gray-700/50' 
                      : 'bg-white/90 text-gray-900 border border-gray-200/50'
                    }
                    backdrop-blur-sm shadow-lg
                  `}>
                    {item.title}
                    <div className={`
                      absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 rotate-45
                      ${isDark ? 'bg-gray-800' : 'bg-white'}
                    `}></div>
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      </nav>

      {/* دکمه تغییر حالت */}
      <div className={`border-t p-4 flex-shrink-0 ${isDark ? 'border-gray-700/30' : 'border-gray-200/30'}`}>
        <button
          onClick={onToggle}
          className={`
            w-full flex items-center justify-center py-2 px-3
            rounded-lg transition-all duration-200
            ${isDark
              ? 'text-gray-300 hover:text-white hover:bg-white/5'
              : 'text-gray-500 hover:text-gray-700 hover:bg-black/5'
            }
            ${isCollapsed ? '' : 'gap-2'}
          `}
        >
          <ChevronLeft 
            className={`w-5 h-5 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`} 
          />
          {!isCollapsed && (
            <span className="text-sm font-vazir">جمع کردن</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
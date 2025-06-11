// src/components/layout/Header.tsx
// سربرگ کاملاً responsive با جستجوی کارا

import React, { useState } from 'react';
import { Menu, Bell, User, LogOut, Search, Settings, Sun, Moon, X } from 'lucide-react';
import { HeaderProps } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

const Header: React.FC<HeaderProps> = ({ user, onSidebarToggle }) => {
  const { isDark, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // تابع جستجو
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('جستجو برای:', searchValue);
    // اینجا منطق جستجو پیاده‌سازی می‌شود
  };

  return (
    <header 
      className={`
        h-16 flex items-center justify-between px-3 md:px-6 sticky top-0 z-30
        transition-all duration-300
        ${isDark 
          ? 'bg-gray-900/80 backdrop-blur-xl border-gray-700/50 text-white' 
          : 'bg-white/80 backdrop-blur-xl border-gray-200/50 text-gray-900'
        }
        border-b shadow-glass
      `}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* قسمت سمت راست */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        {/* دکمه منو موبایل */}
        <button
          onClick={onSidebarToggle}
          className={`
            p-2 rounded-lg transition-all duration-200 lg:hidden flex-shrink-0
            ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}
          `}
          title="منو"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* عنوان صفحه */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            {/* لوگو در header - فقط در دسکتاپ */}
            <div className="hidden lg:flex items-center justify-center w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg shadow-sm border border-white/20">
              <img 
                src="/logo.svg" 
                alt="لوگو" 
                className="w-6 h-6 object-contain"
              />
            </div>
            
            <div className="min-w-0 flex-1">
              <h1 className="font-bold font-vazir text-sm sm:text-lg md:text-xl lg:text-2xl truncate">
                سیستم مدیریت فرایند
              </h1>
              <p className={`text-xs sm:text-sm font-vazir truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                مجتمع کامپیوتر یک دو سه
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* قسمت وسط - جستجو دسکتاپ */}
      <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${
            isDark ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="جستجو در سیستم..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={`
              w-full pl-10 pr-4 py-2 text-sm font-vazir rounded-lg
              transition-all duration-200 backdrop-blur-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isDark 
                ? 'bg-white/10 border border-gray-600/30 text-white placeholder-gray-400 focus:bg-white/20' 
                : 'bg-black/5 border border-gray-300/30 text-gray-900 placeholder-gray-500 focus:bg-white/50'
              }
            `}
          />
        </form>
      </div>

      {/* قسمت سمت چپ */}
      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
        {/* دکمه جستجو موبایل */}
        <button 
          onClick={() => setSearchOpen(!searchOpen)}
          className={`
            p-2 rounded-lg transition-all duration-200 md:hidden
            ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}
          `}
        >
          <Search className="w-5 h-5" />
        </button>

        {/* دکمه تغییر تم */}
        <button 
          onClick={toggleTheme}
          className={`
            p-2 rounded-lg transition-all duration-200 hover:scale-105
            ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}
          `}
          title={isDark ? 'تم روشن' : 'تم تاریک'}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* اعلانات */}
        <button className={`
          relative p-2 rounded-lg transition-all duration-200
          ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}
        `}>
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* تنظیمات - مخفی در موبایل */}
        <button className={`
          p-2 rounded-lg transition-all duration-200 hidden sm:block
          ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}
        `}>
          <Settings className="w-5 h-5" />
        </button>

        {/* جداکننده */}
        <div className={`w-px h-6 mx-1 md:mx-2 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

        {/* پروفایل کاربر */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* تصویر پروفایل */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-medium">
                {user.name.charAt(0)}
              </span>
            )}
          </div>

          {/* اطلاعات کاربر - مخفی در موبایل کوچک */}
          <div className="hidden sm:block text-right min-w-0">
            <p className="text-sm font-medium font-vazir truncate">
              {user.name}
            </p>
            <p className={`text-xs font-vazir truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {user.role}
            </p>
          </div>

          {/* دکمه خروج */}
          <button 
            className={`
              p-2 rounded-lg transition-all duration-200 flex-shrink-0
              ${isDark 
                ? 'hover:bg-red-500/20 hover:text-red-400' 
                : 'hover:bg-red-50 hover:text-red-600'
              }
            `}
            title="خروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* جستجوی موبایل - Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden">
          <div className={`
            absolute top-4 left-4 right-4 p-4 rounded-xl backdrop-blur-xl
            ${isDark 
              ? 'bg-gray-900/90 border border-gray-700/50' 
              : 'bg-white/90 border border-gray-200/50'
            }
          `}>
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDark ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="جستجو در سیستم..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className={`
                      w-full pl-10 pr-4 py-3 text-base font-vazir rounded-lg
                      transition-all duration-200 backdrop-blur-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${isDark 
                        ? 'bg-white/10 border border-gray-600/30 text-white placeholder-gray-400' 
                        : 'bg-black/5 border border-gray-300/30 text-gray-900 placeholder-gray-500'
                      }
                    `}
                    autoFocus
                  />
                </div>
              </form>
              
              <button
                onClick={() => setSearchOpen(false)}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}
                `}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* پیشنهادات جستجو */}
            <div className="mt-4">
              <p className={`text-sm font-vazir mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                جستجوهای پرکاربرد:
              </p>
              <div className="flex flex-wrap gap-2">
                {['پرسنل', 'حضور و غیاب', 'گزارشات', 'مرخصی'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchValue(term);
                      handleSearch(new Event('submit') as any);
                    }}
                    className={`
                      px-3 py-1 text-sm font-vazir rounded-full transition-all duration-200
                      ${isDark 
                        ? 'bg-white/10 text-gray-300 hover:bg-white/20' 
                        : 'bg-black/5 text-gray-600 hover:bg-black/10'
                      }
                    `}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
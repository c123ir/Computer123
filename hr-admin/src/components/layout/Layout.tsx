// src/components/layout/Layout.tsx
// چیدمان اصلی با Grid Layout برای حل مشکل responsive

import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { LayoutProps, MenuItem, AdminUser } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

// آیتم‌های منوی اصلی
const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'داشبورد',
    icon: 'Home',
    path: '/'
  },
  {
    id: 'employees',
    title: 'مدیریت پرسنل',
    icon: 'Users',
    path: '/employees'
  },
  {
    id: 'attendance',
    title: 'حضور و غیاب',
    icon: 'Clock',
    path: '/attendance'
  },
  {
    id: 'calendar',
    title: 'تقویم کاری',
    icon: 'Calendar',
    path: '/calendar'
  },
  {
    id: 'payroll',
    title: 'حقوق و دستمزد',
    icon: 'CreditCard',
    path: '/payroll'
  },
  {
    id: 'reports',
    title: 'گزارشات',
    icon: 'BarChart3',
    path: '/reports'
  },
  {
    id: 'documents',
    title: 'مدارک و فایل‌ها',
    icon: 'FileText',
    path: '/documents'
  },
  {
    id: 'settings',
    title: 'تنظیمات',
    icon: 'Settings',
    path: '/settings'
  }
];

// اطلاعات کاربر نمونه
const currentUser: AdminUser = {
  id: '1',
  name: 'علی احمدی',
  email: 'ali@computer123.com',
  role: 'مدیر سیستم',
  avatar: ''
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isDark } = useTheme();

  // تشخیص اندازه صفحه
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 1024;
      
      setIsMobile(mobile);
      
      // در موبایل، سایدبار همیشه جمع شده (مخفی)
      if (mobile) {
        setSidebarCollapsed(true);
      } else {
        // در دسکتاپ، سایدبار باز می‌شود
        setSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div 
      className={`
        min-h-screen font-vazir
        ${isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
        }
        grid transition-all duration-300
        ${isMobile 
          ? 'grid-cols-1' 
          : sidebarCollapsed 
            ? 'grid-cols-[64px_1fr]' 
            : 'grid-cols-[256px_1fr]'
        }
      `} 
      dir="rtl"
    >
      {/* پس‌زمینه انیمیشن */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`
          absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full blur-3xl opacity-20
          ${isDark ? 'bg-blue-600' : 'bg-blue-400'}
          animate-pulse
        `}></div>
        <div className={`
          absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full blur-3xl opacity-20
          ${isDark ? 'bg-purple-600' : 'bg-purple-400'}
          animate-pulse
        `} style={{ animationDelay: '2s' }}></div>
      </div>

      {/* نوار کناری */}
      {!isMobile && (
        <div className="relative z-20">
          <Sidebar
            isCollapsed={sidebarCollapsed}
            onToggle={toggleSidebar}
            menuItems={menuItems}
          />
        </div>
      )}

      {/* نوار کناری موبایل (Overlay) */}
      {isMobile && (
        <>
          <div 
            className={`
              fixed inset-y-0 right-0 z-50 w-64 transform transition-transform duration-300
              ${sidebarCollapsed ? 'translate-x-full' : 'translate-x-0'}
            `}
          >
            <Sidebar
              isCollapsed={false}
              onToggle={toggleSidebar}
              menuItems={menuItems}
            />
          </div>
          
          {/* پوشش تیره */}
          {!sidebarCollapsed && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={toggleSidebar}
            />
          )}
        </>
      )}

      {/* محتوای اصلی */}
      <div className="flex flex-col min-h-screen relative z-10">
        {/* سربرگ */}
        <Header
          user={currentUser}
          onSidebarToggle={toggleSidebar}
        />

        {/* محتوای صفحه */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto h-full">
            <div 
              className={`
                rounded-2xl p-4 lg:p-6 backdrop-blur-xl shadow-glass border h-full
                ${isDark 
                  ? 'bg-gray-800/30 border-gray-700/30' 
                  : 'bg-white/30 border-white/30'
                }
              `}
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
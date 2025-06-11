// src/components/layout/Layout.tsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDark } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // تشخیص اندازه صفحه
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      
      // در حالت موبایل، sidebar همیشه overlay است
      if (mobile) {
        setIsSidebarCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // بستن sidebar موبایل هنگام کلیک روی overlay
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isMobileSidebarOpen) {
        const sidebar = document.getElementById('mobile-sidebar');
        const target = event.target as Node;
        
        if (sidebar && !sidebar.contains(target)) {
          setIsMobileSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isMobileSidebarOpen]);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  // کلاس‌های Grid برای Layout
  const getGridClasses = () => {
    if (isMobile) {
      return 'grid-cols-1'; // موبایل: یک ستون
    }
    
    return isSidebarCollapsed 
      ? 'grid-cols-[64px_1fr]'   // دسکتاپ جمع شده: 64px + باقی
      : 'grid-cols-[256px_1fr]'; // دسکتاپ باز: 256px + باقی
  };

  return (
    <div className={`
      min-h-screen transition-colors duration-300
      ${isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }
    `}>
      {/* Grid Layout اصلی */}
      <div className={`
        min-h-screen grid transition-all duration-300 ease-in-out
        ${getGridClasses()}
      `}>
        {/* Sidebar - فقط در دسکتاپ */}
        {!isMobile && (
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={handleSidebarToggle}
            isMobile={false}
            isOpen={false}
            onClose={() => {}}
          />
        )}

        {/* Main Content */}
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <Header
            onMenuToggle={handleSidebarToggle}
            isMobile={isMobile}
            isSidebarOpen={isMobileSidebarOpen}
          />

          {/* Content Area */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {/* Container برای محتوا */}
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className={`
            border-t p-4 text-center text-sm
            ${isDark 
              ? 'border-gray-700 text-gray-400 bg-gray-900/50' 
              : 'border-gray-200 text-gray-500 bg-white/50'
            }
            backdrop-blur-sm
          `}>
            <p dir="rtl">
              © ۱۴۰۳ مجتمع کامپیوتر یک دو سه - تمامی حقوق محفوظ است
            </p>
          </footer>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sidebar
          isCollapsed={false}
          onToggle={handleSidebarToggle}
          isMobile={true}
          isOpen={isMobileSidebarOpen}
          onClose={handleMobileSidebarClose}
        />
      )}

      {/* Loading Overlay (برای آینده) */}
      {/* 
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className={`
            rounded-xl p-6 backdrop-blur-xl
            ${isDark ? 'bg-gray-800/90' : 'bg-white/90'}
          `}>
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>
                در حال بارگذاری...
              </span>
            </div>
          </div>
        </div>
      )}
      */}
    </div>
  );
};

export default Layout;
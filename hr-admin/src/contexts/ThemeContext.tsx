// src/contexts/ThemeContext.tsx
// سیستم مدیریت تم روشن و تاریک

import React, { createContext, useContext, useState, useEffect } from 'react';

// تعریف نوع تم
type Theme = 'light' | 'dark';

// نوع Context
interface ThemeContextType {
  theme: Theme;                    // تم فعلی
  toggleTheme: () => void;         // تابع تغییر تم
  isDark: boolean;                 // آیا تم تاریک است؟
}

// ایجاد Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// نوع Props برای Provider
interface ThemeProviderProps {
  children: React.ReactNode;
}

// Provider کامپوننت
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // دریافت تم ذخیره شده از localStorage یا پیش‌فرض روشن
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'light';
  });

  // تابع تغییر تم
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // اعمال تم به html element
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook برای استفاده از Theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme باید داخل ThemeProvider استفاده شود');
  }
  
  return context;
};
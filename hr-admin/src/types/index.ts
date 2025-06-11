// src/types/index.ts
// تعریف انواع مختلف برای پروژه مدیریت منابع انسانی

// نوع آیتم منو
export interface MenuItem {
  id: string;           // شناسه یکتا
  title: string;        // عنوان فارسی منو
  icon: string;         // نام آیکون از lucide-react
  path: string;         // مسیر صفحه
  children?: MenuItem[]; // زیرمنوها (اختیاری)
}

// نوع کاربر ادمین
export interface AdminUser {
  id: string;           // شناسه کاربر
  name: string;         // نام کاربر
  email: string;        // ایمیل
  role: string;         // نقش (مدیر، اپراتور و...)
  avatar?: string;      // تصویر پروفایل (اختیاری)
}

// نوع تنظیمات Layout
export interface LayoutSettings {
  sidebarCollapsed: boolean;  // آیا نوار کناری جمع شده؟
  theme: 'light' | 'dark';    // تم روشن یا تاریک
}

// نوع Props کامپوننت Layout
export interface LayoutProps {
  children: React.ReactNode;  // محتوای داخلی
}

// نوع Props نوار کناری
export interface SidebarProps {
  isCollapsed: boolean;       // وضعیت جمع شده
  onToggle: () => void;       // تابع تغییر وضعیت
  menuItems: MenuItem[];      // آیتم‌های منو
}

// نوع Props هدر
export interface HeaderProps {
  user: AdminUser;            // اطلاعات کاربر فعلی
  onSidebarToggle: () => void; // تابع باز/بسته کردن نوار کناری
}
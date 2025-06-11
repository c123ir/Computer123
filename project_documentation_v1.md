# 📋 مستندات پروژه مدیریت فرایند مجتمع کامپیوتر یک دو سه - نسخه ۱

## 📌 اطلاعات کلی پروژه

**نام پروژه:** سیستم مدیریت فرایند مجتمع کامپیوتر یک دو سه  
**نوع:** React Admin Panel  
**تکنولوژی:** React 18.2 + TypeScript + Tailwind CSS  
**موضوع:** مدیریت فرایندهای اداری و عملیاتی  
**ورژن:** 1.0.0  
**تاریخ:** June 2025  

---

## 🏗️ ساختار پروژه

```
hr-admin/
├── public/
│   ├── index.html
│   └── logo.svg                    # لوگوی شرکت
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── Header.tsx          # سربرگ اصلی
│   │       ├── Sidebar.tsx         # نوار کناری
│   │       └── Layout.tsx          # چیدمان کلی
│   ├── contexts/
│   │   └── ThemeContext.tsx        # مدیریت تم روشن/تاریک
│   ├── types/
│   │   └── index.ts                # تعاریف TypeScript
│   ├── App.tsx                     # کامپوننت اصلی
│   ├── index.css                   # استایل‌های سفارشی
│   └── index.tsx                   # نقطه ورود برنامه
├── package.json
├── tailwind.config.js              # تنظیمات Tailwind
└── postcss.config.js               # تنظیمات PostCSS
```

---

## https://github.com/c123ir/Computer123.git

🎨 ویژگی‌های طراحی

### **استایل کلی:**

- **Glassmorphism**: استایل شیشه‌ای با blur effect
- **Gradient Background**: پس‌زمینه گرادیانت زیبا
- **Modern UI**: طراحی مدرن و حرفه‌ای
- **Responsive Design**: سازگار با موبایل تا دسکتاپ

### **سیستم رنگ‌بندی:**

- **Light Theme**: سفید، خاکستری، آبی
- **Dark Theme**: خاکستری تیره، سیاه، آبی
- **Accent Colors**: آبی و بنفش برای gradient ها

### **Typography:**

- **فونت فارسی**: Vazirmatn
- **Direction**: RTL (راست به چپ)
- **Responsive Text**: اندازه متغیر بر اساس صفحه

---

## 🧩 کامپوننت‌های اصلی

### **1. Layout (src/components/layout/Layout.tsx)**

- **نوع**: کامپوننت اصلی چیدمان
- **Grid System**: استفاده از CSS Grid
- **Responsive**: 
  - دسکتاپ: `grid-cols-[256px_1fr]` (باز) / `grid-cols-[64px_1fr]` (جمع)
  - موبایل: `grid-cols-1`
- **Theme Support**: پشتیبانی کامل از تم تاریک/روشن

### **2. Sidebar (src/components/layout/Sidebar.tsx)**

- **ویژگی‌ها**:
  - Collapsible (قابل جمع شدن)
  - Glassmorphism effect
  - Responsive tooltips
  - Active page indicator
- **حالت‌ها**:
  - باز: `w-64` (256px)
  - جمع: `w-16` (64px)
  - موبایل: Overlay mode

### **3. Header (src/components/layout/Header.tsx)**

- **المان‌ها**:
  - Logo + Title (responsive)
  - Search Bar (desktop/mobile)
  - Theme Toggle Button
  - User Profile
  - Notifications
- **جستجو**:
  - Desktop: Inline search
  - Mobile: Overlay با پیشنهادات

### **4. ThemeContext (src/contexts/ThemeContext.tsx)**

- **عملکرد**: مدیریت تم سراسری
- **ذخیره‌سازی**: localStorage
- **Hook**: `useTheme()`

---

## 📱 سیستم Responsive

### **Breakpoints:**

```css
sm: 640px     /* موبایل بزرگ */
md: 768px     /* تبلت کوچک */
lg: 1024px    /* تبلت بزرگ / لپ‌تاپ کوچک */
xl: 1280px    /* دسکتاپ */
```

### **رفتار در اندازه‌های مختلف:**

#### **Mobile (< 1024px):**

- Sidebar: Overlay mode
- Grid: Single column
- Header: کوچک شده، جستجوی overlay
- Typography: اندازه کوچک‌تر

#### **Desktop (≥ 1024px):**

- Sidebar: Fixed در Grid
- Grid: Two columns
- Header: جستجوی inline
- Typography: اندازه کامل

---

## 🎯 منوی اصلی

```typescript
const menuItems = [
  { id: 'dashboard', title: 'داشبورد', icon: 'Home', path: '/' },
  { id: 'employees', title: 'مدیریت پرسنل', icon: 'Users', path: '/employees' },
  { id: 'attendance', title: 'حضور و غیاب', icon: 'Clock', path: '/attendance' },
  { id: 'calendar', title: 'تقویم کاری', icon: 'Calendar', path: '/calendar' },
  { id: 'payroll', title: 'حقوق و دستمزد', icon: 'CreditCard', path: '/payroll' },
  { id: 'reports', title: 'گزارشات', icon: 'BarChart3', path: '/reports' },
  { id: 'documents', title: 'مدارک و فایل‌ها', icon: 'FileText', path: '/documents' },
  { id: 'settings', title: 'تنظیمات', icon: 'Settings', path: '/settings' }
];
```

---

## 🔧 تنظیمات فنی

### **Dependencies اصلی:**

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.23.1",
  "typescript": "^4.9.5",
  "tailwindcss": "^3.4.4",
  "lucide-react": "^0.263.1"
}
```

### **Tailwind Configuration:**

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'vazir': ['Vazirmatn', 'sans-serif'],
      },
      backgroundColor: {
        'glass-light': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.1)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }
    }
  }
}
```

---

## 🎨 استایل‌های کلیدی

### **Glassmorphism Classes:**

```css
.glass-light {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### **Theme Classes Pattern:**

```css
/* Light Mode */
bg-white dark:bg-gray-800
text-gray-900 dark:text-white
border-gray-200 dark:border-gray-700

/* Glassmorphism */
bg-white/30 dark:bg-gray-800/30
backdrop-blur-xl
border-white/20 dark:border-gray-700/20
```

---

## 📄 صفحات موجود

### **1. Dashboard (/):**

- **کارت‌های آماری**: کل پرسنل، حاضر، مرخصی، غایب
- **آخرین فعالیت‌ها**: لیست فعالیت‌های اخیر
- **نمودار حضور هفتگی**: Progress bar برای هر روز
- **استایل**: Glassmorphism cards با hover effects
- **توضیح**: خلاصه وضعیت سیستم مدیریت فرایند

### **2. سایر صفحات:**

- **وضعیت**: Coming Soon page
- **المان‌ها**: پیام "در حال توسعه" با دکمه notification

---

## 🔄 سیستم تم (Theme System)

### **استفاده از useTheme:**

```typescript
const { isDark, theme, toggleTheme } = useTheme();

// در کامپوننت‌ها
className={`
  ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
`}
```

### **الگوی استاندارد:**

```typescript
const Component = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`
      rounded-xl p-6 backdrop-blur-xl border
      ${isDark 
        ? 'bg-gray-800/30 border-gray-700/30 text-white' 
        : 'bg-white/30 border-white/30 text-gray-900'
      }
    `}>
      محتوا
    </div>
  );
};
```

---

## 🖼️ لوگو و برندینگ

### **لوگو:**

- **فایل**: `public/logo.svg`
- **استفاده**: در Sidebar و Header
- **اندازه‌ها**:
  - Sidebar باز: `w-12 h-12` container, `w-10 h-10` logo
  - Sidebar جمع: `w-10 h-10` container, `w-8 h-8` logo
  - Header: `w-8 h-8` container, `w-6 h-6` logo

### **برندینگ:**

- **نام**: مجتمع کامپیوتر یک دو سه
- **رنگ‌های اصلی**: آبی و بنفش
- **استایل**: مدرن، حرفه‌ای، شیشه‌ای

---

## ⚡ عملکرد و بهینه‌سازی

### **Responsive Performance:**

- **Grid Layout**: تقسیم خودکار فضا
- **Conditional Rendering**: عناصر بر اساس اندازه صفحه
- **Efficient State**: استفاده بهینه از useState

### **Theme Performance:**

- **localStorage**: ذخیره تم کاربر
- **CSS Classes**: تغییر سریع تم
- **Context API**: مدیریت state سراسری

### **Mobile Optimizations:**

- **Touch Targets**: اندازه مناسب برای لمس
- **Overlay UI**: Sidebar به صورت overlay
- **Compressed Text**: فونت‌های کوچک‌تر

---

## 🚀 مراحل بعدی (Version 2)

### **مراحل بعدی (Version 2) - بر اساس مدیریت فرایند:**

1. **مدیریت پرسنل** - CRUD کامل کارمندان و پیمانکاران
2. **حضور و غیاب** - سیستم ثبت و گزارش فعالیت‌ها
3. **تقویم کاری** - مدیریت پروژه‌ها و deadline ها
4. **حقوق و دستمزد** - محاسبه هزینه‌ها و پرداخت‌ها
5. **گزارشات** - نمودارها و analytics فرایندی
6. **مدارک** - آپلود و مدیریت اسناد پروژه‌ها
7. **تنظیمات** - مدیریت سیستم و دسترسی‌ها
8. **مدیریت پروژه‌ها** - ایجاد، ردیابی و کنترل پروژه‌ها
9. **مدیریت مشتری‌ان** - CRM برای مجتمع کامپیوتر
10. **انبارداری** - مدیریت قطعات و تجهیزات کامپیوتر

### **فرایندهای کلیدی سیستم:**

- **فرایند فروش**: از پیش‌فاکتور تا تحویل
- **فرایند پشتیبانی**: ثبت و پیگیری تیکت‌ها
- **فرایند خرید**: سفارش قطعات و تامین‌کنندگان
- **فرایند مالی**: صورت‌حساب‌ها و تسویه‌ها
- **فرایند منابع انسانی**: استخدام تا تسویه حساب
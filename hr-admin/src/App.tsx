// src/App.tsx
// کامپوننت اصلی با پشتیبانی از تم

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';

// صفحه داشبورد با پشتیبانی تم
const Dashboard = () => (
  <div className="space-y-6">
    {/* عنوان صفحه */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-vazir">داشبورد</h1>
      <p className="text-gray-600 dark:text-gray-300 font-vazir mt-2">
        خلاصه وضعیت سیستم مدیریت فرایند
      </p>
    </div>

    {/* کارت‌های آماری */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: 'کل پرسنل', value: '۱۲۵', change: '↗ ۵ نفر افزایش', color: 'blue', emoji: '👥' },
        { title: 'حاضر امروز', value: '۸۹', change: '۷۱٪ حضور', color: 'green', emoji: '✅' },
        { title: 'مرخصی امروز', value: '۱۲', change: '۱۰٪ مرخصی', color: 'yellow', emoji: '🏖️' },
        { title: 'غایب امروز', value: '۲۴', change: '۱۹٪ غیبت', color: 'red', emoji: '❌' }
      ].map((item, index) => (
        <div 
          key={index}
          className={`
            rounded-xl p-6 backdrop-blur-sm border transition-all duration-200 hover:scale-105
            bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-gray-700/20
            shadow-glass hover:shadow-xl
          `}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 font-vazir">
                {item.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {item.value}
              </p>
              <p className={`text-sm font-vazir mt-1 text-${item.color}-600 dark:text-${item.color}-400`}>
                {item.change}
              </p>
            </div>
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center
              bg-${item.color}-100 dark:bg-${item.color}-900/50
            `}>
              <span className="text-2xl">{item.emoji}</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* بخش‌های اضافی */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* آخرین فعالیت‌ها */}
      <div className={`
        rounded-xl p-6 backdrop-blur-sm border
        bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-gray-700/20
        shadow-glass
      `}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-vazir mb-4">
          آخرین فعالیت‌ها
        </h3>
        <div className="space-y-4">
          {[
            { icon: '👤', text: 'احمد رضایی وارد سیستم شد', time: '۱۰ دقیقه پیش', color: 'blue' },
            { icon: '📄', text: 'درخواست مرخصی جدید', time: '۳۰ دقیقه پیش', color: 'green' },
            { icon: '⏰', text: 'گزارش حضور و غیاب آماده شد', time: '۱ ساعت پیش', color: 'orange' }
          ].map((activity, index) => (
            <div 
              key={index}
              className={`
                flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm
                bg-white/30 dark:bg-gray-700/30
              `}
            >
              <span className="text-xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white font-vazir">
                  {activity.text}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-vazir">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* نمودار حضور هفتگی */}
      <div className={`
        rounded-xl p-6 backdrop-blur-sm border
        bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-gray-700/20
        shadow-glass
      `}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-vazir mb-4">
          میانگین حضور هفتگی
        </h3>
        <div className="space-y-3">
          {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'].map((day, index) => (
            <div key={day} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-vazir w-16">
                {day}
              </span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${85 - index * 5}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-vazir">
                {85 - index * 5}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// صفحه نمونه برای سایر بخش‌ها
const ComingSoon = ({ title }: { title: string }) => (
  <div className={`
    rounded-xl p-8 text-center backdrop-blur-sm border
    bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-gray-700/20
    shadow-glass
  `}>
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-2xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-vazir">
      {title}
    </h2>
    <p className="text-gray-600 dark:text-gray-300 font-vazir mb-6">
      این بخش در حال توسعه است و به زودی آماده خواهد شد.
    </p>
    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-vazir hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg">
      اطلاع از آمادگی
    </button>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<ComingSoon title="مدیریت پرسنل" />} />
            <Route path="/attendance" element={<ComingSoon title="حضور و غیاب" />} />
            <Route path="/calendar" element={<ComingSoon title="تقویم کاری" />} />
            <Route path="/payroll" element={<ComingSoon title="حقوق و دستمزد" />} />
            <Route path="/reports" element={<ComingSoon title="گزارشات" />} />
            <Route path="/documents" element={<ComingSoon title="مدارک و فایل‌ها" />} />
            <Route path="/settings" element={<ComingSoon title="تنظیمات" />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
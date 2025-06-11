// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import { useTheme } from './contexts/ThemeContext';

// Import صفحات
import Dashboard from './Dashboard';
import ComingSoon from './';

// کامپوننت اصلی App که شامل ThemeProvider است
const AppContent: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* صفحه اصلی - داشبورد */}
          <Route path="/" element={<Dashboard />} />
          
          {/* صفحات مختلف سیستم */}
          <Route path="/sales" element={<ComingSoon title="مدیریت فروش" />} />
          <Route path="/customers" element={<ComingSoon title="مدیریت مشتریان" />} />
          <Route path="/employees" element={<ComingSoon title="مدیریت پرسنل" />} />
          <Route path="/investors" element={<ComingSoon title="سرمایه گزاران" />} />
          <Route path="/users" element={<ComingSoon title="مدیریت کاربران" />} />
          <Route path="/tags" element={<ComingSoon title="مدیریت برچسب ها" />} />
          <Route path="/forms" element={<ComingSoon title="مدیریت فرم ها" />} />
          <Route path="/settings" element={<ComingSoon title="تنظیمات" />} />
          <Route path="/sms" element={<ComingSoon title="مدیریت پیامک" />} />
          <Route path="/documents" element={<ComingSoon title="مدیریت اسناد" />} />
          <Route path="/ai" element={<ComingSoon title="هوش مصنوعی" />} />
          <Route path="/reports" element={<ComingSoon title="گزارشات" />} />
          <Route path="/workflows" element={<ComingSoon title="مدیریت فرایندها" />} />
          <Route path="/databases" element={<ComingSoon title="مدیریت پایگاه داده ها" />} />
          
          {/* صفحه 404 */}
          <Route path="*" element={<ComingSoon title="صفحه یافت نشد" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

// کامپوننت اصلی App
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
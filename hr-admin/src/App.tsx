// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ComingSoon from './pages/ComingSoon';

// Firebase Connection Test (فقط در development)
import FirebaseConnectionTest from './components/common/FirebaseConnectionTest';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* صفحات فرم‌ساز - فعلاً Coming Soon */}
              <Route path="/forms" element={<ComingSoon title="فرم‌ساز" />} />
              <Route path="/forms/create" element={<ComingSoon title="ایجاد فرم جدید" />} />
              <Route path="/forms/:id/edit" element={<ComingSoon title="ویرایش فرم" />} />
              <Route path="/forms/:id/data" element={<ComingSoon title="داده‌های فرم" />} />
              
              {/* سایر صفحات */}
              <Route path="/employees" element={<ComingSoon title="مدیریت کارمندان" />} />
              <Route path="/payroll" element={<ComingSoon title="حقوق و دستمزد" />} />
              <Route path="/attendance" element={<ComingSoon title="حضور و غیاب" />} />
              <Route path="/reports" element={<ComingSoon title="گزارش‌ها" />} />
              <Route path="/settings" element={<ComingSoon title="تنظیمات" />} />
            </Routes>
          </Layout>
          
          {/* Firebase Connection Test - فقط در development */}
          <FirebaseConnectionTest />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
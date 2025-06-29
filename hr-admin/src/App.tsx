// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ComingSoon from './pages/ComingSoon';
import FormsList from './pages/FormsList';
import FormBuilderPage from './pages/FormBuilderPage';

// PostgreSQL Backend Connection Test (فقط در development)
import PostgreSQLConnectionTest from './components/common/FirebaseConnectionTest';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* صفحات فرم‌ساز */}
              <Route path="/forms" element={<FormsList />} />
              <Route path="/forms/create" element={<FormBuilderPage />} />
              <Route path="/forms/:id/edit" element={<FormBuilderPage />} />
              <Route path="/forms/:id/preview" element={<ComingSoon title="پیش‌نمایش فرم" />} />
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
          <PostgreSQLConnectionTest />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
// src/App.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ComingSoon from './pages/ComingSoon';
import FormsPage from './pages/forms';
import MenuManagement from './pages/MenuManagement';

// PostgreSQL Backend Connection Test (فقط در development)
import PostgreSQLConnectionTest from './components/common/FirebaseConnectionTest';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router 
            future={{ 
              v7_startTransition: true,
              v7_relativeSplatPath: true 
            }}
          >
            <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 ">
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* صفحات فرم‌ساز */}
                  <Route path="/forms" element={<FormsPage />} />
                  <Route path="/menus" element={<MenuManagement />} />
                  <Route path="/sales" element={<ComingSoon title="مدیریت فروش" />} />
                  <Route path="/customers" element={<ComingSoon title="مدیریت مشتریان" />} />
                  <Route path="/employees" element={<ComingSoon title="مدیریت پرسنل" />} />
                  <Route path="/investors" element={<ComingSoon title="سرمایه گزاران" />} />
                  <Route path="/users" element={<ComingSoon title="مدیریت کاربران" />} />
                  <Route path="/tags" element={<ComingSoon title="مدیریت برچسب‌ها" />} />
                  <Route path="/settings" element={<ComingSoon title="تنظیمات" />} />
                  <Route path="/sms" element={<ComingSoon title="پیامک" />} />
                  <Route path="/documents" element={<ComingSoon title="مدیریت اسناد" />} />
                  <Route path="/ai" element={<ComingSoon title="هوش مصنوعی" />} />
                  <Route path="/reports" element={<ComingSoon title="گزارشات" />} />
                  <Route path="/workflows" element={<ComingSoon title="مدیریت فرایندها" />} />
                  <Route path="/databases" element={<ComingSoon title="پایگاه داده" />} />
                </Routes>
              </Layout>
              
              {/* PostgreSQL Backend Connection Test - فقط در development */}
              <PostgreSQLConnectionTest />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
      
      {/* React Query DevTools (فقط در development) */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;
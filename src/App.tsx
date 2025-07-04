import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ComingSoon from './pages/ComingSoon';
import FormsPage from './pages/forms/Forms';
import MenuManagement from './pages/MenuManagement';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/forms" element={<FormsPage />} />
              <Route path="/menus" element={<MenuManagement />} />
              <Route path="/sales" element={<ComingSoon title="فروش" />} />
              <Route path="/customers" element={<ComingSoon title="مشتریان" />} />
              <Route path="/employees" element={<ComingSoon title="کارمندان" />} />
              <Route path="/investors" element={<ComingSoon title="سرمایه‌گذاران" />} />
              <Route path="/users" element={<ComingSoon title="کاربران" />} />
              <Route path="/tags" element={<ComingSoon title="برچسب‌ها" />} />
              <Route path="/settings" element={<ComingSoon title="تنظیمات" />} />
              <Route path="/sms" element={<ComingSoon title="پیامک" />} />
              <Route path="/documents" element={<ComingSoon title="اسناد" />} />
              <Route path="/ai" element={<ComingSoon title="هوش مصنوعی" />} />
              <Route path="/reports" element={<ComingSoon title="گزارشات" />} />
              <Route path="/workflows" element={<ComingSoon title="گردش کار" />} />
              <Route path="/databases" element={<ComingSoon title="پایگاه داده" />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App; 
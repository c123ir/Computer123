// src/App.tsx

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import ComingSoon from './pages/ComingSoon';
import FormsPage from './pages/forms/Forms';

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
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/forms" element={<FormsPage />} />
              <Route path="/sales" element={<ComingSoon />} />
              <Route path="/customers" element={<ComingSoon />} />
              <Route path="/employees" element={<ComingSoon />} />
              <Route path="/investors" element={<ComingSoon />} />
              <Route path="/users" element={<ComingSoon />} />
              <Route path="/tags" element={<ComingSoon />} />
              <Route path="/settings" element={<ComingSoon />} />
              <Route path="/sms" element={<ComingSoon />} />
              <Route path="/documents" element={<ComingSoon />} />
              <Route path="/ai" element={<ComingSoon />} />
              <Route path="/reports" element={<ComingSoon />} />
              <Route path="/workflows" element={<ComingSoon />} />
              <Route path="/databases" element={<ComingSoon />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
      
      {/* React Query DevTools (فقط در development) */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App; 
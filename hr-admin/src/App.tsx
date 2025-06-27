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
              <Route path="/forms" element={<ComingSoon />} />
              <Route path="/forms/create" element={<ComingSoon />} />
              <Route path="/forms/:id/edit" element={<ComingSoon />} />
              <Route path="/forms/:id/data" element={<ComingSoon />} />
              
              {/* سایر صفحات */}
              <Route path="/employees" element={<ComingSoon />} />
              <Route path="/payroll" element={<ComingSoon />} />
              <Route path="/attendance" element={<ComingSoon />} />
              <Route path="/reports" element={<ComingSoon />} />
              <Route path="/settings" element={<ComingSoon />} />
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
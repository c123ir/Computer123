import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // اینجا می‌توانید وضعیت احراز هویت کاربر را بررسی کنید
    const token = localStorage.getItem('authToken');
    if (token) {
      // اینجا می‌توانید اطلاعات کاربر را از توکن یا API دریافت کنید
      setUser({
        id: '1',
        email: 'test@example.com',
        name: 'کاربر تست',
        role: 'admin'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      // اینجا می‌توانید درخواست API برای لاگین را انجام دهید
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('خطا در ورود به سیستم');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // اینجا می‌توانید درخواست API برای خروج را انجام دهید
      localStorage.removeItem('authToken');
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در خروج از سیستم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        login, 
        logout,
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 
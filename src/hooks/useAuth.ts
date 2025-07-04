import { useState, useContext, createContext } from 'react';
import { AuthUser } from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (username: string, password: string) => {
    // TODO: Implement actual login logic
    setIsAuthenticated(true);
    setUser({
      id: '1',
      email: username,
      name: 'کاربر تست',
      role: 'admin',
      permissions: ['read', 'write'],
      roles: ['admin']
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = { isAuthenticated, user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
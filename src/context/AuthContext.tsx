import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('truvila_token'));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('truvila_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('truvila_token', newToken);
    localStorage.setItem('truvila_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('truvila_token');
    localStorage.removeItem('truvila_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

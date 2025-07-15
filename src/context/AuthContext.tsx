import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthState, Admin } from '../types';
import axios from 'axios';

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setAuthFromToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    token: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      setAuthState({
        isLoggedIn: true,
        user: JSON.parse(user),
        token,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post('http://localhost:3001/api/login', { email, password });
      const token = res.data.token;
      const decoded: any = jwtDecode(token);

      const user: Admin = {
        id: decoded.sub || '1',
        name: decoded.name,
        email: decoded.email,
        role: decoded.role || 'user',
        createdAt: '',
        lastLogin: '',
        status: 'active',
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setAuthState({
        isLoggedIn: true,
        user,
        token,
      });

      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const setAuthFromToken = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);

      const user: Admin = {
        id: decoded.sub || 'google-id',
        name: decoded.name,
        email: decoded.email,
        role: decoded.role || 'user',
        createdAt: '',
        lastLogin: '',
        status: 'active',
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setAuthState({
        isLoggedIn: true,
        user,
        token,
      });
    } catch (error) {
      console.error('Failed to decode JWT', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({ isLoggedIn: false, user: null, token: null });
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, setAuthFromToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

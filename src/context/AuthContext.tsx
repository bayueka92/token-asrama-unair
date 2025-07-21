// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../services/apiClient'; 
import { useNavigate } from 'react-router-dom';
import { DecodedToken } from '../types';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'user';
  avatar?: string;
  exp?: number;
}

interface AuthContextType {
  authState: {
    token: string | null;
    user: AuthUser | null;
  };
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
interface CustomDecodedToken extends DecodedToken {
  id: number | string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<{ token: string | null; user: AuthUser | null }>({
    token: null,
    user: null,
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<CustomDecodedToken>(token);
        if (!decoded.id) {
          console.error("TOKEN TIDAK VALID: Klaim 'id' tidak ditemukan di dalam token. Sesi dibersihkan.");
          localStorage.removeItem('authToken');
          return;
        }

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('authToken');
        } else {
          const user: AuthUser = {
            id: String(decoded.id), 
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            avatar: decoded.avatar || undefined,
            exp: decoded.exp,
          };
          setAuthState({ token, user });
        }
      } catch (error) {
        console.error("Gagal decode token dari localStorage:", error);
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiClient.post('/login', { email, password });
      const token = res.data.token;
      
      const decoded = jwtDecode<CustomDecodedToken>(token);

      if (!decoded.id) {
        console.error("LOGIN GAGAL: Token yang diterima dari server tidak memiliki klaim 'id'.");
        throw new Error("Token dari server tidak valid.");
      }

      const user: AuthUser = {
        id: String(decoded.id),
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        avatar: decoded.avatar || undefined,
        exp: decoded.exp,
      };

      localStorage.setItem('authToken', token);
      setAuthState({ token, user });
      
      navigate('/dashboard'); 
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({ token: null, user: null });
    navigate('/login'); 
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
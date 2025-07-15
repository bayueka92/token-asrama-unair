import { useState, useEffect } from 'react';
import { AuthState, Admin } from '../types';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    token: null,
  });

  const navigate = useNavigate();

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

      // ✅ redirect langsung setelah login
      navigate('/dashboard');

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

    setAuthState({
      isLoggedIn: false,
      user: null,
      token: null,
    });

    window.location.href = '/';
  };

  return { authState, login, logout, setAuthFromToken };
};

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './hooks/useTheme';
import LoginForm from './components/Login/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import UserManagement from './components/Users/UserManagement';
import TokenManagement from './components/Tokens/TokenManagement';
import PurchaseHistory from './components/Purchases/PurchaseHistory';
import AdminManagement from './components/Admins/AdminManagement';
import Settings from './components/Settings/Settings';

function App() {
  const { authState, setAuthFromToken } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      setAuthFromToken(token);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [setAuthFromToken]);

  if (!authState.isLoggedIn) {
    return <LoginForm />;
  }

  // Layout untuk halaman setelah login
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/tokens" element={<TokenManagement />} />
              <Route path="/purchases" element={<PurchaseHistory />} />
              <Route path="/admins" element={<AdminManagement />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;

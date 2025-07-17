// src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

// Komponen Layout untuk halaman setelah login
const DashboardLayout = () => {
  const { theme } = useTheme();
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
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

// Komponen untuk melindungi rute
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { authState } = useAuth();
  // ===================================================================
  // == PERBAIKAN UTAMA ADA DI SINI ==
  // `authState` tidak memiliki properti `isAuthenticated`.
  // Kondisi diubah untuk memeriksa keberadaan `authState.token`.
  // Jika token ada (bukan null), maka pengguna dianggap sudah login.
  // ===================================================================
  return authState.token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      {/* Rute untuk login, bisa diakses siapa saja */}
      <Route path="/login" element={<LoginForm />} />

      {/* Semua rute lain akan dilindungi oleh ProtectedRoute */}
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;

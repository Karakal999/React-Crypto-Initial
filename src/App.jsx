import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './components/pages/Dashboard';
import Portfolio from './components/pages/Portfolio';
import Markets from './components/pages/Markets';
import Login from './components/pages/Login';
import { AuthProvider } from './context/authContext';
import { CryptoContextProvider } from './context/cryptoContext';
import { useAuth } from './context/authContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CryptoContextProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route
                path="/portfolio"
                element={
                  <ProtectedRoute>
                    <Portfolio />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </CryptoContextProvider>
    </AuthProvider>
  );
}

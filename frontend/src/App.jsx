// =====================================================
// APP.JSX - Main Application Entry Point
// =====================================================
// This file rarely needs editing. Routes are managed in src/routes/

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { UserProvider } from './context/UserContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import ProviderLayout from './layouts/ProviderLayout';

// Route Modules
import { customerRoutes, providerRoutes, adminRoutes } from './routes';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import RoleSelection from './pages/auth/RoleSelection';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ProviderOnboarding from './pages/provider/ProviderOnboarding';

function App() {
  return (
    <UserProvider>
      <SubscriptionProvider>
        <SocketProvider>
          <NotificationProvider>
            <BrowserRouter>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Customer Routes - Sumit's Domain */}
              <Route
                path="/customer"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                {customerRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
              </Route>

              {/* Standalone Provider Onboarding (No Layout) */}
              <Route
                path="/provider/onboarding"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ProviderOnboarding />
                  </ProtectedRoute>
                }
              />

              {/* Provider Routes - Radhika's Domain */}
              <Route
                path="/provider"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ProviderLayout />
                  </ProtectedRoute>
                }
              >
                {providerRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
              </Route>

              {/* Admin Routes - Sumit's Domain */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                {adminRoutes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
              </Route>

            </Routes>
          </BrowserRouter>
          </NotificationProvider>
        </SocketProvider>
      </SubscriptionProvider>
    </UserProvider>
  );
}

export default App;

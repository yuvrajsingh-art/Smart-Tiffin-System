import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages - Auth & Public
import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import RoleSelection from './pages/auth/RoleSelection'
import Register from './pages/auth/Register'

// Layouts
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'
import ProviderLayout from './layouts/ProviderLayout'

// Pages - Customer
import CustomerDashboard from './pages/customer/CustomerDashboard';
import Menu from './pages/customer/Menu';
import TrackDelivery from './pages/customer/Track';
import ManageSubscription from './pages/customer/ManageSubscription'
import Feedback from './pages/customer/Feedback'
import History from './pages/customer/History'
import Wallet from './pages/customer/Wallet';
import FindMess from './pages/discovery/FindMess'
import MessDetails from './pages/discovery/MessDetails'
import SubscriptionCheckout from './pages/discovery/SubscriptionCheckout'
import Profile from './pages/customer/Profile'
import Notifications from './pages/customer/Notifications'

// Pages - Provider
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ManageMenu from './pages/provider/ManageMenu';
import OrderManagement from './pages/provider/OrderManagement';
import ProviderProfile from './pages/provider/ProviderProfile';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReports from './pages/admin/AdminReports';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminProviders from './pages/admin/AdminProviders';
import AdminPlans from './pages/admin/AdminPlans';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMenu from './pages/admin/AdminMenu';
import AdminFinance from './pages/admin/AdminFinance';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSupport from './pages/admin/AdminSupport';


function App() {
  return (
    <UserProvider>
      <SubscriptionProvider>
        <BrowserRouter>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Routes */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="find-mess" element={<FindMess />} />
              <Route path="mess/:id" element={<MessDetails />} />
              <Route path="mess/:id/subscribe" element={<SubscriptionCheckout />} />
              <Route path="menu" element={<Menu />} />
              <Route path="track" element={<TrackDelivery />} />
              <Route path="manage-subscription" element={<ManageSubscription />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="history" element={<History />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            {/* Provider Routes */}
            <Route
              path="/provider"
              element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ProviderLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<ProviderDashboard />} />
              <Route path="menu" element={<ManageMenu />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="profile" element={<ProviderProfile />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="plans" element={<AdminPlans />} />
              <Route path="providers" element={<AdminProviders />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="finance" element={<AdminFinance />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<AdminDashboard />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </SubscriptionProvider>
    </UserProvider>
  )
}

export default App

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SubscriptionProvider } from './context/SubscriptionContext';

// Pages - Auth & Public
import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import RoleSelection from './pages/auth/RoleSelection'
import Register from './pages/auth/Register'

// Layouts
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout' // [NEW]

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
import ProviderDashboard from './pages/provider/ProviderDashboard'; // Note: Updated import path case to match convention if needed

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard'; // [NEW]
import AdminReports from './pages/admin/AdminReports'; // [NEW]
import AdminCustomers from './pages/admin/AdminCustomers'; // [NEW]
import AdminProviders from './pages/admin/AdminProviders'; // [NEW]
import AdminPlans from './pages/admin/AdminPlans'; // [NEW]
import AdminOrders from './pages/admin/AdminOrders'; // [NEW]
import AdminMenu from './pages/admin/AdminMenu'; // [NEW]
import AdminFinance from './pages/admin/AdminFinance'; // [NEW]
import AdminSettings from './pages/admin/AdminSettings'; // [NEW]
import AdminSupport from './pages/admin/AdminSupport'; // [NEW]

/**
 * Main Application Component
 * Handles the client-side routing using React Router.
 */
function App() {
  return (
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
          <Route path="/customer" element={<DashboardLayout />}>
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

          {/* Provider Routes - To be integrated with Layout later */}
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />

          {/* Admin Routes - [NEW] */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="reports" element={<AdminReports />} />

            {/* Finalized Foundation & Daily Ops Pages */}
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
  )
}

export default App

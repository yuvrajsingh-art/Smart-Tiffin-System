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
import FindMess from './pages/discovery/FindMess'
import MessDetails from './pages/discovery/MessDetails'
import SubscriptionCheckout from './pages/discovery/SubscriptionCheckout'
import Profile from './pages/customer/Profile'
import Notifications from './pages/customer/Notifications'

// Pages - Provider
import ProviderDashboard from './pages/provider/ProviderDashboard'; // Note: Updated import path case to match convention if needed

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard'; // [NEW]

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
            {/* Placeholder routes for now, redirecting to dashboard or showing placeholder component */}
            <Route path="*" element={<AdminDashboard />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </SubscriptionProvider>
  )
}

export default App

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import RoleSelection from './pages/auth/RoleSelection'
import Register from './pages/auth/Register'
import DashboardLayout from './layouts/DashboardLayout'
import CustomerDashboard from './pages/customer/CustomerDashboard';
import TodayMenu from './pages/customer/Menu';
import TrackDelivery from './pages/customer/Track';
import Pause from './pages/customer/Pause'
import Feedback from './pages/customer/Feedback'
import Wallet from './pages/customer/Wallet'
import Profile from './pages/customer/Profile'
import ProviderSidebar from './components/ui/Provider/ProviderSidebar';
import ProviderDashboard from './pages/Provider/ProviderDashboard';

/**
 * Main Application Component
 * Handles the client-side routing using React Router.
 */
function App() {
  // return (
  //   <BrowserRouter>
  //     <Toaster position="top-center" reverseOrder={false} />
  //     <Routes>
  //       {/* Public Routes - Accessible without login */}
  //       <Route path="/" element={<LandingPage />} />
  //       <Route path="/login" element={<Login />} />
  //       <Route path="/role-selection" element={<RoleSelection />} />
  //       <Route path="/register" element={<Register />} />

  //       {/* Protected Routes - Customer Dashboard
  //           All routes under /customer share the DashboardLayout (Sidebar + Topbar)
  //       */}
  //       <Route path="/customer" element={<DashboardLayout />}>
  //         {/* Index route for dashboard: /customer/dashboard */}
  //         <Route path="dashboard" element={<CustomerDashboard />} />
  //         <Route path="menu" element={<TodayMenu />} />
  //        <Route path="track" element={<TrackDelivery />} />
  //         <Route path="pause" element={<Pause />} />
  //         <Route path="feedback" element={<Feedback />} />
  //         <Route path="wallet" element={<Wallet />} />
  //         <Route path="profile" element={<Profile />} />

  //         {/* Future routes can be added here, e.g.:
  //              <Route path="profile" element={<Profile />} />
  //          */}
  //       </Route>
  //     </Routes>
  //   </BrowserRouter>
  // )


  return (
    <BrowserRouter>
      <ProviderDashboard />
    </BrowserRouter>
  )
}

export default App

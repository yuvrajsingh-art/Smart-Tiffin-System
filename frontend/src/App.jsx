import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import DashboardLayout from './components/layout/DashboardLayout'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import Menu from './pages/customer/Menu'
import Track from './pages/customer/Track'
import Pause from './pages/customer/Pause'
import Feedback from './pages/customer/Feedback'
import Wallet from './pages/customer/Wallet'
import Profile from './pages/customer/Profile'

/**
 * Main Application Component
 * Handles the client-side routing using React Router.
 */
function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Routes - Accessible without login */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Customer Dashboard
            All routes under /customer share the DashboardLayout (Sidebar + Topbar)
        */}
        <Route path="/customer" element={<DashboardLayout />}>
          {/* Index route for dashboard: /customer/dashboard */}
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="menu" element={<Menu />} />
          <Route path="track" element={<Track />} />
          <Route path="pause" element={<Pause />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="profile" element={<Profile />} />

          {/* Future routes can be added here, e.g.:
               <Route path="profile" element={<Profile />} />
           */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

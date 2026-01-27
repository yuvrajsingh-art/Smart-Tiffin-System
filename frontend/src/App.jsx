import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import RoleSelection from './pages/auth/RoleSelection'
import Register from './pages/auth/Register'
import DashboardLayout from './layouts/DashboardLayout'
import CustomerDashboard from './pages/customer/CustomerDashboard';

import Menu from './pages/customer/Menu';

import TrackDelivery from './pages/customer/Track';
import ManageSubscription from './pages/customer/ManageSubscription'
import Feedback from './pages/customer/Feedback'
// Wallet route removed
import History from './pages/customer/History'
import FindMess from './pages/discovery/FindMess'
import MessDetails from './pages/discovery/MessDetails'
import SubscriptionCheckout from './pages/discovery/SubscriptionCheckout'
import Profile from './pages/customer/Profile'
 import Notifications from './pages/customer/Notifications'
import { SubscriptionProvider } from './context/SubscriptionContext';

 import ProviderSidebar from './components/ui/Provider/ProviderSidebar';
import ProviderDashboard from './pages/Provider/ProviderDashboard';
import ManageMenu from './pages/Provider/ManageMenu';
import ActiveCustomer from './pages/Provider/ActiveCustomers';
 
/**
 * Main Application Component
 * Handles the client-side routing using React Router.
 */
function App() {
  // return (
  //   <SubscriptionProvider>
  //     <BrowserRouter>
  //       <Toaster position="top-center" reverseOrder={false} />
  //       <Routes>
  //         {/* Public Routes - Accessible without login */}
  //         <Route path="/" element={<LandingPage />} />
  //         <Route path="/login" element={<Login />} />
  //         <Route path="/role-selection" element={<RoleSelection />} />
  //         <Route path="/register" element={<Register />} />

  //         {/* Protected Routes - Customer Dashboard
  //             All routes under /customer share the DashboardLayout (Sidebar + Topbar)
  //         */}
  //         <Route path="/customer" element={<DashboardLayout />}>
  //           {/* Index route for dashboard: /customer/dashboard */}
  //           <Route path="dashboard" element={<CustomerDashboard />} />

  //           {/* Discovery & Subscription Flow */}
  //           <Route path="find-mess" element={<FindMess />} />
  //           <Route path="mess/:id" element={<MessDetails />} />
  //           <Route path="mess/:id/subscribe" element={<SubscriptionCheckout />} />

  //           <Route path="menu" element={<Menu />} />
  //           <Route path="track" element={<TrackDelivery />} />
  //           <Route path="manage-subscription" element={<ManageSubscription />} />
  //           <Route path="feedback" element={<Feedback />} />
  //           {/* Wallet route removed */}
  //           <Route path="history" element={<History />} />
  //           <Route path="profile" element={<Profile />} />
  //           <Route path="notifications" element={<Notifications />} />

  //           {/* Future routes can be added here, e.g.:
  //                <Route path="profile" element={<Profile />} />
  //            */}
  //         </Route>
  //       </Routes>
  //     </BrowserRouter>
  //   </SubscriptionProvider>
  // )


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
      <ManageMenu />
    </BrowserRouter>
  )
}

export default App

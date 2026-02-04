import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { UserProvider } from './context/UserContext';
import { SocketProvider } from './context/SocketContext';
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
import ProviderDashboard from './pages/Provider/ProviderDashboard';
import ManageMenu from './pages/Provider/ManageMenu';
import ActiveCustomers from './pages/Provider/ActiveCustomers';
import DeliveryStatus from './pages/Provider/DeliveryStatus';
import CustomerFeedback from './pages/Provider/CustomerFeedback';
import ProviderAnalysis from './pages/Provider/ProviderAnalysis';
import ProviderProfile from './pages/Provider/ProviderProfile';


function App() {
  // return (
  //   <UserProvider>
  //     <SubscriptionProvider>
  //       <SocketProvider>
  //         <BrowserRouter>
  //           <Toaster position="top-center" reverseOrder={false} />
  //           <Routes>
  //             {/* Public Routes */}
  //             <Route path="/" element={<LandingPage />} />
  //             <Route path="/login" element={<Login />} />
  //             <Route path="/role-selection" element={<RoleSelection />} />
  //             <Route path="/register" element={<Register />} />

  //             {/* Customer Routes */}
  //             <Route
  //               path="/customer"
  //               element={
  //                 <ProtectedRoute allowedRoles={['customer']}>
  //                   <DashboardLayout />
  //                 </ProtectedRoute>
  //               }
  //             >
  //               <Route path="dashboard" element={<CustomerDashboard />} />
  //               <Route path="find-mess" element={<FindMess />} />
  //               <Route path="mess/:id" element={<MessDetails />} />
  //               <Route path="mess/:id/subscribe" element={<SubscriptionCheckout />} />
  //               <Route path="menu" element={<Menu />} />
  //               <Route path="track" element={<TrackDelivery />} />
  //               <Route path="manage-subscription" element={<ManageSubscription />} />
  //               <Route path="wallet" element={<Wallet />} />
  //               <Route path="feedback" element={<Feedback />} />
  //               <Route path="history" element={<History />} />
  //               <Route path="profile" element={<Profile />} />
  //               <Route path="notifications" element={<Notifications />} />
  //             </Route>

  //             {/* Provider Routes */}
  //             <Route
  //               path="/Provider"
  //               element={
  //                 <ProtectedRoute allowedRoles={['Provider']}>
  //                   <DashboardLayout />
  //                 </ProtectedRoute>
  //               }
  //             >
  //               <Route path="ProviderDashboard" element={<ProviderDashboard />} />
  //               <Route path="ManageMenu" element={<ManageMenu />} />
  //               <Route path="ActiveCustomers" element={<ActiveCustomers />} />
  //               <Route path="DeliveryStatus" element={<DeliveryStatus />} />
  //               <Route path="CustomerFeedback" element={<CustomerFeedback />} />
  //               <Route path="ProviderAnalysis" element={<ProviderAnalysis />} />
  //               <Route path="ProviderProfile" element={<ProviderProfile />} />
  //             </Route>

  //             {/* Admin Routes */}
  //             <Route
  //               path="/admin"
  //               element={
  //                 <ProtectedRoute allowedRoles={['admin']}>
  //                   <AdminLayout />
  //                 </ProtectedRoute>
  //               }
  //             >
  //               <Route path="dashboard" element={<AdminDashboard />} />
  //               <Route path="reports" element={<AdminReports />} />
  //               <Route path="plans" element={<AdminPlans />} />
  //               <Route path="providers" element={<AdminProviders />} />
  //               <Route path="menu" element={<AdminMenu />} />
  //               <Route path="customers" element={<AdminCustomers />} />
  //               <Route path="orders" element={<AdminOrders />} />
  //               <Route path="support" element={<AdminSupport />} />
  //               <Route path="finance" element={<AdminFinance />} />
  //               <Route path="settings" element={<AdminSettings />} />
  //               <Route path="*" element={<AdminDashboard />} />
  //             </Route>

  //           </Routes>
  //         </BrowserRouter>
  //       </SocketProvider>
  //     </SubscriptionProvider>
  //   </UserProvider>
  // )

  return (
    <BrowserRouter>
      <Routes>
        
          <Route path="/" element={<ProviderDashboard />} />
          <Route path="/Provider/ManageMenu" element={<ManageMenu />} />
          <Route path="/Provider/ActiveCustomers" element={<ActiveCustomers />} />
          <Route path="/Provider/DeliveryStatus" element={<DeliveryStatus />} />
          <Route path="/Provider/CustomerFeedback" element={<CustomerFeedback />} />
          <Route path="/Provider/ProviderAnalysis" element={<ProviderAnalysis />} />
          <Route path="/Provider/ProviderProfile" element={<ProviderProfile />} />
       </Routes>
    </BrowserRouter>
  )



}


export default App

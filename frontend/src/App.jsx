import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import DashboardLayout from './components/layout/DashboardLayout'
import StudentDashboard from './pages/student/StudentDashboard'

/**
 * Main Application Component
 * Handles the client-side routing using React Router.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Accessible without login */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Customer Dashboard 
            All routes under /student share the DashboardLayout (Sidebar + Topbar)
        */}
        <Route path="/student" element={<DashboardLayout />}>
          {/* Index route for dashboard: /student/dashboard */}
          <Route path="dashboard" element={<StudentDashboard />} />

          {/* Future routes can be added here, e.g.:
               <Route path="profile" element={<Profile />} /> 
           */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

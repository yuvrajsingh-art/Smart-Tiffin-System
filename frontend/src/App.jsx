import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import DashboardLayout from './components/layout/DashboardLayout'
import StudentDashboard from './pages/student/StudentDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Student Dashboard Routes */}
        <Route path="/student" element={<DashboardLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

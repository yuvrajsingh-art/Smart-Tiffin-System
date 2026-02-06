// =====================================================
// ADMIN ROUTES - Sumit's Domain
// =====================================================
// This file is owned by Sumit. Only edit this file for admin-related routes.

import React from 'react';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminReports from '../pages/admin/AdminReports';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminProviders from '../pages/admin/AdminProviders';
import AdminPlans from '../pages/admin/AdminPlans';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminMenu from '../pages/admin/AdminMenu';
import AdminFinance from '../pages/admin/AdminFinance';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminSupport from '../pages/admin/AdminSupport';

// Admin route configuration
export const adminRoutes = [
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "reports", element: <AdminReports /> },
    { path: "plans", element: <AdminPlans /> },
    { path: "providers", element: <AdminProviders /> },
    { path: "menu", element: <AdminMenu /> },
    { path: "customers", element: <AdminCustomers /> },
    { path: "orders", element: <AdminOrders /> },
    { path: "support", element: <AdminSupport /> },
    { path: "finance", element: <AdminFinance /> },
    { path: "settings", element: <AdminSettings /> },
    { path: "*", element: <AdminDashboard /> },
];

export default adminRoutes;

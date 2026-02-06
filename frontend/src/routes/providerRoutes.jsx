// =====================================================
// PROVIDER ROUTES - Radhika's Domain
// =====================================================
// This file is owned by Radhika. Only edit this file for provider-related routes.

import React from 'react';

// Provider Pages (uppercase folder as per Radhika's structure)
import ProviderDashboard from '../pages/provider/ProviderDashboard';
import ManageMenu from '../pages/provider/ManageMenu';
import ActiveCustomers from '../pages/provider/ActiveCustomers';
import DeliveryStatus from '../pages/provider/DeliveryStatus';
import CustomerFeedback from '../pages/provider/CustomerFeedback';
import ProviderAnalysis from '../pages/provider/ProviderAnalysis';
import ProviderProfile from '../pages/provider/ProviderProfile';

// Provider route configuration
export const providerRoutes = [
    { path: "dashboard", element: <ProviderDashboard /> },
    { path: "menu", element: <ManageMenu /> },
    { path: "customers", element: <ActiveCustomers /> },
    { path: "delivery", element: <DeliveryStatus /> },
    { path: "feedback", element: <CustomerFeedback /> },
    { path: "analytics", element: <ProviderAnalysis /> },
    { path: "profile", element: <ProviderProfile /> },
];

export default providerRoutes;

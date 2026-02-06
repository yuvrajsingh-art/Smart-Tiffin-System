// =====================================================
// PROVIDER ROUTES - Radhika's Domain
// =====================================================
// This file is owned by Radhika. Only edit this file for provider-related routes.

import React from 'react';

// Provider Pages (uppercase folder as per Radhika's structure)
import ProviderDashboard from '../pages/Provider/ProviderDashboard';
import ManageMenu from '../pages/Provider/ManageMenu';
import ActiveCustomers from '../pages/Provider/ActiveCustomers';
import DeliveryStatus from '../pages/Provider/DeliveryStatus';
import CustomerFeedback from '../pages/Provider/CustomerFeedback';
import ProviderAnalysis from '../pages/Provider/ProviderAnalysis';
import ProviderProfile from '../pages/Provider/ProviderProfile';

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

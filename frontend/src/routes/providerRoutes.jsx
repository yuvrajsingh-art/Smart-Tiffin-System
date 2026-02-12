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
import SubscriptionPlan from '../pages/Provider/SubscriptionPlan';
import ProviderProfile from '../pages/Provider/ProviderProfile';
import ProviderRevenue from '../pages/Provider/ProviderRevenue';
import Notification from '../components/ui/Provider/Notification';
import ProviderSupport from '../pages/Provider/ProviderSupport';
import ManagePlans from '../pages/Provider/ManagePlans';

// Provider route configuration
export const providerRoutes = [
    { path: "dashboard", element: <ProviderDashboard /> },
    { path: "menu", element: <ManageMenu /> },
    { path: "plans", element: <ManagePlans /> },
    { path: "customers", element: <ActiveCustomers /> },
    { path: "delivery", element: <DeliveryStatus /> },
    { path: "revenue", element: <ProviderRevenue /> },
    { path: "feedback", element: <CustomerFeedback /> },
    { path: "plan", element: <SubscriptionPlan /> },
    { path: "profile", element: <ProviderProfile /> },
    { path: "notifications", element: <Notification /> },
    { path: "support", element: <ProviderSupport /> },
];

export default providerRoutes;

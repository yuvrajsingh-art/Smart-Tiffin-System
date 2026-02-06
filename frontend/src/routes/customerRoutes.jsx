// =====================================================
// CUSTOMER ROUTES - Sumit's Domain
// =====================================================
// This file is owned by Sumit. Only edit this file for customer-related routes.

import React from 'react';
import SubscriptionGuard from '../components/auth/SubscriptionGuard';

// Customer Pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import Menu from '../pages/customer/Menu';
import TrackDelivery from '../pages/customer/Track';
import ManageSubscription from '../pages/customer/ManageSubscription';
import Feedback from '../pages/customer/Feedback';
import History from '../pages/customer/History';
import Wallet from '../pages/customer/Wallet';
import Profile from '../pages/customer/Profile';
import Notifications from '../pages/customer/Notifications';
import Support from '../pages/customer/Support';

// Discovery Pages
import FindMess from '../pages/discovery/FindMess';
import MessDetails from '../pages/discovery/MessDetails';
import SubscriptionCheckout from '../pages/discovery/SubscriptionCheckout';

// Customer route configuration
export const customerRoutes = [
    // Open routes (no subscription required)
    { path: "dashboard", element: <CustomerDashboard /> },
    { path: "find-mess", element: <FindMess /> },
    { path: "mess/:id", element: <MessDetails /> },
    { path: "mess/:id/subscribe", element: <SubscriptionCheckout /> },
    { path: "wallet", element: <Wallet /> },
    { path: "profile", element: <Profile /> },
    { path: "notifications", element: <Notifications /> },
    { path: "support", element: <Support /> },

    // Subscription protected routes
    { path: "menu", element: <SubscriptionGuard><Menu /></SubscriptionGuard> },
    { path: "track", element: <SubscriptionGuard><TrackDelivery /></SubscriptionGuard> },
    { path: "manage-subscription", element: <SubscriptionGuard><ManageSubscription /></SubscriptionGuard> },
    { path: "feedback", element: <SubscriptionGuard><Feedback /></SubscriptionGuard> },
    { path: "history", element: <SubscriptionGuard><History /></SubscriptionGuard> },
];

export default customerRoutes;

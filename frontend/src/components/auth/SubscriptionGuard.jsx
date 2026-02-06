import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';
import { toast } from 'react-hot-toast';

const SubscriptionGuard = ({ children }) => {
    const { hasActiveSubscription } = useSubscription();

    if (!hasActiveSubscription()) {
        // Optional: Show a toast message explanation
        // toast.error("Please subscribe to access this feature", { id: 'subscription-guard' });
        return <Navigate to="/customer/dashboard" replace />;
    }

    return children;
};

export default SubscriptionGuard;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/UserContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isLoading, token } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!token || !user) {
        // Redirect to login but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // User is logged in but doesn't have the right role
        // Redirect to their respective dashboard
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'provider') return <Navigate to="/provider/dashboard" replace />;
        return <Navigate to="/customer/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;

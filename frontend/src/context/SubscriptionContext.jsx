import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './UserContext';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
    // Initialize state from localStorage or default to false
    const [subscription, setSubscription] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        // Fetch only if user is logged in as a customer
        if (user && user.role === 'customer') {
            fetchSubscription();
        } else {
            setSubscription(null);
        }
    }, [user]);

    const fetchSubscription = async () => {
        try {
            const { data } = await axios.get('/api/customer/subscription/details');
            if (data.success && data.data?.subscription) {
                const subData = data.data.subscription;
                setSubscription({
                    status: 'Active',
                    plan: subData.name,
                    price: subData.price,
                    startDate: new Date(subData.startDate),
                    expiryDate: new Date(subData.endDate),
                    mealTypes: subData.mealTypes,
                    lunchTime: subData.lunchTime,
                    dinnerTime: subData.dinnerTime
                });
            } else {
                setSubscription(null);
            }
        } catch (error) {
            // Handle 401 (Unauthorized) or 404 (Not Found) gracefully
            if (error.response?.status === 401 || error.response?.status === 404) {
                console.log("No active subscription or user not logged in");
                setSubscription(null);
            } else {
                console.error("Error fetching subscription:", error);
            }
        }
    };

    useEffect(() => {
        if (subscription) {
            localStorage.setItem('subscription', JSON.stringify(subscription));
        } else {
            localStorage.removeItem('subscription');
        }
    }, [subscription]);

    const buySubscription = async (subscriptionData) => {
        try {
            const { data } = await axios.post('/api/customer/subscription/purchase', subscriptionData);
            if (data.success) {
                const newSub = {
                    status: 'Active',
                    plan: subscriptionData.planName,
                    price: subscriptionData.totalAmount,
                    startDate: subscriptionData.startDate,
                    expiryDate: new Date(Date.now() + (subscriptionData.durationInDays || 30) * 24 * 60 * 60 * 1000)
                };
                setSubscription(newSub);
                return { success: true, data: data.data };
            }
            return { success: false, message: data.message };
        } catch (error) {
            console.error("Subscription purchase error:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Failed to purchase subscription"
            };
        }
    };

    const cancelSubscription = () => {
        setSubscription(null);
    };

    const hasActiveSubscription = () => {
        return subscription && subscription.status === 'Active';
    };

    return (
        <SubscriptionContext.Provider value={{
            subscription,
            buySubscription,
            cancelSubscription,
            hasActiveSubscription,
            fetchSubscription
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

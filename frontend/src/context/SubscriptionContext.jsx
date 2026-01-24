import React, { createContext, useContext, useState, useEffect } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
    // Initialize state from localStorage or default to false
    const [subscription, setSubscription] = useState(() => {
        const stored = localStorage.getItem('subscription');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (subscription) {
            localStorage.setItem('subscription', JSON.stringify(subscription));
        } else {
            localStorage.removeItem('subscription');
        }
    }, [subscription]);

    const buySubscription = (planName, price) => {
        const newSub = {
            status: 'Active',
            plan: planName,
            price: price,
            startDate: new Date(),
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        };
        setSubscription(newSub);
        return newSub;
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
            hasActiveSubscription
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

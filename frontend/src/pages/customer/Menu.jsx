import React, { useState } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { Link } from 'react-router-dom';

const Menu = () => {
    const { hasActiveSubscription } = useSubscription();
    const hasSubscription = hasActiveSubscription();

    return (
        <div className="relative space-y-6 animate-[fadeIn_0.5s_ease-out]">

            {/* Locked Content Overlay */}
            {!hasSubscription && (
                <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/30 flex items-center justify-center rounded-3xl">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md text-center border border-orange-100">
                        <div className="size-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl text-primary">lock</span>
                        </div>
                        <h3 className="text-2xl font-black text-[#2D241E] mb-2">Menu Locked</h3>
                        <p className="text-[#5C4D42] mb-8">You need an active subscription to view the daily menu and book meals.</p>
                        <Link
                            to="/customer/find-mess"
                            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-[#e05d00] transition-colors shadow-lg shadow-orange-500/20 inline-block"
                        >
                            Subscribe Now
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;

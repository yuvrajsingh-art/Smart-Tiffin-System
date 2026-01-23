import React from 'react';

const Track = () => {
    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-2xl font-bold text-gray-900">Track Delivery 🛵</h2>

            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                {/* Status Header */}
                <div className="text-center mb-10">
                    <span className="inline-block p-4 rounded-full bg-orange-100 text-orange-600 mb-4 animate-bounce">
                        <span className="material-symbols-outlined text-3xl">local_shipping</span>
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900">Out for Delivery</h3>
                    <p className="text-gray-500 font-medium">Arriving in 15 mins</p>
                </div>

                {/* Vertical Timeline */}
                <div className="relative border-l-2 border-gray-200 ml-6 space-y-8">
                    {/* Item 1 */}
                    <div className="relative pl-8">
                        <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></span>
                        <h4 className="text-sm font-bold text-gray-900">Order Placed</h4>
                        <p className="text-xs text-gray-400">10:30 AM</p>
                    </div>
                    {/* Item 2 */}
                    <div className="relative pl-8">
                        <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></span>
                        <h4 className="text-sm font-bold text-gray-900">Preparing Food</h4>
                        <p className="text-xs text-gray-400">11:15 AM</p>
                    </div>
                    {/* Item 3 */}
                    <div className="relative pl-8">
                        <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary border-2 border-white animate-pulse"></span>
                        <h4 className="text-sm font-bold text-primary">Out for Delivery</h4>
                        <p className="text-xs text-primary font-medium">12:45 PM</p>
                    </div>
                    {/* Item 4 */}
                    <div className="relative pl-8 grayscale opacity-40">
                        <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></span>
                        <h4 className="text-sm font-bold text-gray-900">Delivered</h4>
                        <p className="text-xs text-gray-400">Estimated 01:00 PM</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Track;

import React from 'react';

const LiveTracker = ({ dashboardData }) => {
    return (
        <section className="glass-panel p-6 rounded-[2rem] relative overflow-hidden group border border-white/60 shadow-xl">
            {/* bg blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1 block">Live Status</span>
                        <h2 className="text-xl font-black text-[#2D241E] capitalize">{dashboardData?.liveStatus?.status?.replace(/_/g, ' ') || "Preparing..."} 🍳</h2>
                    </div>
                    <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/60 text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Estimated Arrival</p>
                        <p className="text-base font-black text-[#2D241E]">
                            {new Date().getHours() < 15 ? dashboardData?.lunchTime : dashboardData?.dinnerTime}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-primary rounded-full shadow-[0_0_15px_rgba(234,88,12,0.5)] transition-all duration-1000 ease-out"
                        style={{ width: `${((dashboardData?.liveStatus?.currentStep || 1) / 5) * 100}%` }}
                    ></div>
                </div>

                {/* Steps */}
                <div className="flex justify-between px-2 relative">
                    {['Prep', 'Cooking', 'Packed', 'On Way', 'Delivered'].map((step, idx) => (
                        <div key={step} className="flex flex-col items-center gap-2 z-10">
                            <div className={`size-9 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${idx + 1 <= (dashboardData?.liveStatus?.currentStep || 1) ? 'border-primary bg-white text-primary scale-110 shadow-lg' : 'border-gray-100 bg-gray-50 text-gray-300'}`}>
                                <span className="material-symbols-outlined text-[16px] font-bold">
                                    {idx === 0 ? 'kitchen' : idx === 1 ? 'skillet' : idx === 2 ? 'package_2' : idx === 3 ? 'moped' : 'check'}
                                </span>
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${idx + 1 <= (dashboardData?.liveStatus?.currentStep || 1) ? 'text-[#2D241E]' : 'text-gray-300'}`}>{step}</span>
                        </div>
                    ))}
                    {/* Connecting Line (Visual only, behind dots) */}
                    <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
                </div>
            </div>
        </section>
    );
};

export default LiveTracker;

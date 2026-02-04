import React from 'react';

const OrderTimeline = ({ timeline, onRefresh }) => {
    return (
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/60 relative overflow-hidden animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-[#2D241E] text-lg uppercase tracking-widest">Timeline</h3>
                <button onClick={onRefresh} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1 group">
                    <span className="material-symbols-outlined text-sm group-hover:rotate-180 transition-transform">refresh</span>
                    Refresh
                </button>
            </div>

            <div className="relative ml-2 space-y-0 pb-2">
                <div className="absolute top-4 bottom-4 left-[7px] w-0.5 bg-gray-100 rounded-full"></div>

                {timeline.map((step, idx) => (
                    <div
                        key={idx}
                        className={`relative pl-10 pb-10 last:pb-0 group ${step.active ? '' : 'opacity-40'}`}
                    >
                        <div className={`absolute -left-0 top-0 size-4 rounded-full border-2 border-white shadow-sm z-10 transition-all duration-500 ${step.done
                                ? 'bg-green-500 scale-110'
                                : step.pulse
                                    ? 'bg-primary animate-pulse scale-125'
                                    : 'bg-gray-200'
                            }`}></div>

                        <div className={`p-4 rounded-2xl border transition-all duration-300 ${step.pulse ? 'bg-orange-50 border-orange-100 shadow-md translate-x-2' : 'bg-transparent border-transparent'
                            }`}>
                            <h4 className={`text-sm font-bold flex items-center gap-2 ${step.active ? 'text-[#2D241E]' : 'text-gray-400'}`}>
                                {step.title}
                                {step.pulse && <span className="flex size-2 rounded-full bg-primary animate-ping"></span>}
                            </h4>
                            <p className="text-[10px] font-black text-[#5C4D42] opacity-40 mt-1 uppercase tracking-widest font-mono">{step.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderTimeline;

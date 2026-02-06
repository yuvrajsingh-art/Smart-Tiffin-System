import React from 'react';

const OrderTimeline = ({ timeline, onRefresh }) => {
    return (
        <div className="relative">
            <div className="absolute top-2 bottom-6 left-[7px] w-[2px] bg-gray-100 rounded-full"></div>

            <div className="relative space-y-2">
                {timeline.map((step, idx) => (
                    <div
                        key={idx}
                        className={`relative pl-10 pb-8 last:pb-0 transition-opacity duration-500 ${step.active ? 'opacity-100' : 'opacity-20'}`}
                    >
                        {/* Status Icon Indicator */}
                        <div className={`absolute left-0 top-1 size-4 rounded-full border-2 border-white shadow-sm z-10 transition-all duration-700 ${step.done ? 'bg-primary shadow-[0_0_10px_rgba(244,114,22,0.4)]' :
                                step.active ? 'bg-primary ring-4 ring-primary/10' : 'bg-gray-300'
                            }`}>
                        </div>

                        <div className={`transition-all duration-300 ${step.active ? 'translate-x-1' : ''}`}>
                            <div className="flex items-center justify-between mb-1">
                                <h4 className={`text-[11px] font-black uppercase tracking-widest ${step.active ? 'text-[#2D241E]' : 'text-gray-400'}`}>
                                    {step.title}
                                </h4>
                                <span className={`text-[10px] font-bold font-mono transition-colors duration-500 ${step.active ? 'text-primary' : 'text-gray-300'}`}>
                                    {step.time}
                                </span>
                            </div>
                            {step.active && (
                                <p className="text-[9px] font-black text-primary opacity-80 uppercase tracking-widest">
                                    {step.done ? 'SUCCESS' : 'CURRENT STATUS'}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderTimeline;

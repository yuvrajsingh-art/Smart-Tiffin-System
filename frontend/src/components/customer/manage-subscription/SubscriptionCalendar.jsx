import React from 'react';

const SubscriptionCalendar = ({ days, today, selectedDays, toggleDay }) => {
    return (
        <div className="glass-panel p-5 rounded-[2rem] border border-white/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-5 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-8xl">calendar_month</span>
            </div>

            <div className="flex justify-between items-center mb-4 relative z-10 gap-4">
                <h3 className="font-black text-xl text-[#2D241E]">{today.toLocaleString('default', { month: 'long' })} {today.getFullYear()}</h3>
                <div className="flex gap-2 text-[10px] font-bold text-gray-400 bg-white/40 p-1.5 rounded-full backdrop-blur-sm">
                    <span className="flex items-center gap-1.5 px-2"><span className="size-2 rounded-full bg-red-500"></span> Paused</span>
                    <span className="flex items-center gap-1.5 px-2"><span className="size-2 rounded-full bg-white border border-gray-300"></span> Active</span>
                </div>
            </div>

            {/* Medium Fixed Size Grid */}
            <div className="flex flex-col items-center">
                <div className="grid grid-cols-7 gap-2 relative z-10 w-fit">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={`${d}-${i}`} className="text-center text-[10px] font-black text-gray-400 uppercase py-1">{d}</div>
                    ))}
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`
                                h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 relative group
                                ${selectedDays.includes(day)
                                    ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md shadow-red-500/30'
                                    : 'bg-white/40 text-[#5C4D42] hover:bg-white border border-white/50 hover:border-white hover:shadow-sm'
                                }
                            `}
                        >
                            {day}
                            {selectedDays.includes(day) && (
                                <span className="absolute top-0.5 right-0.5 size-2.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-[7px] text-red-500 font-bold">close</span>
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionCalendar;

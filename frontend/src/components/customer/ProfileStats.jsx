import React from 'react';

const ProfileStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {stats.map((stat, i) => (
                <div key={i} className="glass-panel p-5 rounded-2xl border border-white/60 flex items-center gap-4 hover:translate-y-[-2px] transition-all cursor-default text-left">
                    <div className="size-12 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">{stat.icon}</span>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">{stat.label}</p>
                        <p className={`text-xl font-black ${stat.color || 'text-[#2D241E]'}`}>{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProfileStats;

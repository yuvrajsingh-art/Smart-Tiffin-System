import React from 'react';

const AdminStatCard = ({ title, value, icon, trend, trendValue, color, delay, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white/70 backdrop-blur-2xl p-5 rounded-[2.5rem] border border-white/60 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden animate-[fadeIn_0.6s_ease-out] cursor-pointer"
        style={{ animationDelay: delay }}
    >
        <div className={`absolute -right-8 -top-8 size-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-3xl ${color.replace('text-', 'bg-')}`}></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`size-10 rounded-2xl flex items-center justify-center shadow-lg shadow-black/5 ${color} bg-white border border-gray-100`}>
                <span className="material-symbols-outlined text-[20px] notranslate">{icon}</span>
            </div>
            <div className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider border flex items-center gap-1 shadow-sm ${trend === 'up' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                <span className="material-symbols-outlined text-[11px]">{trend === 'up' ? 'north_east' : 'south_east'}</span>
                {trendValue}
            </div>
        </div>
        <div className="relative z-10">
            <h3 className="text-3xl font-bold text-[#2D241E] tracking-tight mb-1.5 group-hover:scale-105 transition-transform origin-left duration-500">{value}</h3>
            <p className="text-[#897a70] text-xs font-bold tracking-wider flex items-center gap-2 uppercase opacity-60">
                <span className={`size-1.5 rounded-full ${color.replace('text-', 'bg-')}`}></span>
                {title}
            </p>
        </div>
    </div>
);

export default AdminStatCard;

import React from 'react';
import { Link } from 'react-router-dom';

const TodaysMenuCard = ({ todaysMenu, lunchTime, dinnerTime }) => {
    return (
        <div className="glass-panel p-5 rounded-[2rem] border border-white/60 relative overflow-hidden">
            {/* Decorative Blur */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex justify-between items-center mb-5 relative z-10">
                <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-[#2D241E]">Today's Menu</h3>
                    <span className="px-2 py-0.5 rounded-md bg-orange-100 text-[#2D241E] text-[8px] font-black uppercase tracking-tighter">Freshly Updated</span>
                </div>
                <Link to="/customer/menu" className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                    View Full Week <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                </Link>
            </div>

            {todaysMenu ? (
                <div className="flex gap-4 overflow-x-auto pb-2 relative z-10 scrollbar-hide">
                    {/* Lunch */}
                    <div className={`min-w-[200px] p-4 rounded-2xl border transition-all duration-500 flex-1 relative overflow-hidden group/menu
                        ${new Date().getHours() < 15
                            ? 'bg-orange-50/80 border-orange-200 shadow-lg scale-[1.02]'
                            : 'bg-white/40 border-gray-100 opacity-60 hover:opacity-100 hover:scale-[1.01]'}`}
                    >
                        {new Date().getHours() < 15 && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-400"></div>
                        )}
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase absolute top-3 right-3 shadow-sm 
                            ${new Date().getHours() < 15 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>Lunch</span>

                        <div className="size-10 rounded-full bg-white flex items-center justify-center text-xl mb-3 shadow-sm group-hover/menu:scale-110 transition-transform">
                            {todaysMenu.lunch?.emoji || "🍱"}
                        </div>
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-[#2D241E] text-sm truncate pr-2">
                                {todaysMenu.lunch?.name || "Not Set"}
                            </h4>
                            <span className="text-xs font-black text-primary">₹{todaysMenu.lunch?.price || '--'}</span>
                        </div>
                        <p className="text-[10px] text-[#5C4D42] font-medium leading-relaxed mb-2 line-clamp-2 min-h-[2.5em]">
                            {todaysMenu.lunch?.items || "Menu details pending"}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px] text-orange-400">local_fire_department</span>
                                <span className="text-[10px] font-bold text-gray-400">{todaysMenu.lunch?.calories || 0} kcal</span>
                            </div>
                            <span className="text-[10px] font-black text-primary/60">{lunchTime}</span>
                        </div>
                    </div>

                    {/* Dinner */}
                    <div className={`min-w-[200px] p-4 rounded-2xl border transition-all duration-500 flex-1 relative overflow-hidden group/menu
                        ${new Date().getHours() >= 15
                            ? 'bg-blue-50/80 border-blue-200 shadow-lg scale-[1.02]'
                            : 'bg-white/40 border-gray-100 opacity-60 hover:opacity-100 hover:scale-[1.01]'}`}
                    >
                        {new Date().getHours() >= 15 && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
                        )}
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase absolute top-3 right-3 shadow-sm 
                            ${new Date().getHours() >= 15 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>Dinner</span>

                        <div className="size-10 rounded-full bg-white flex items-center justify-center text-xl mb-3 shadow-sm group-hover/menu:scale-110 transition-transform">
                            {todaysMenu.dinner?.emoji || "🌙"}
                        </div>
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-[#2D241E] text-sm truncate pr-2">
                                {todaysMenu.dinner?.name || "Not Set"}
                            </h4>
                            <span className="text-xs font-black text-indigo-600">₹{todaysMenu.dinner?.price || '--'}</span>
                        </div>
                        <p className="text-[10px] text-[#5C4D42] font-medium leading-relaxed mb-2 line-clamp-2 min-h-[2.5em]">
                            {todaysMenu.dinner?.items || "Menu details pending"}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px] text-indigo-400">local_fire_department</span>
                                <span className="text-[10px] font-bold text-gray-400">{todaysMenu.dinner?.calories || 0} kcal</span>
                            </div>
                            <span className="text-[10px] font-black text-indigo-400/60">{dinnerTime}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <span className="material-symbols-outlined text-gray-200 text-4xl mb-2">restaurant_box</span>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Kitchen is preparing the menu...</p>
                </div>
            )}
        </div>
    );
};

export default TodaysMenuCard;

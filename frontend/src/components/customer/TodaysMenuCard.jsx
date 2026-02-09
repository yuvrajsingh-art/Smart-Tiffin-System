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
                <div className="flex gap-4 overflow-x-auto pb-4 relative z-10 scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible">
                    {/* Lunch */}
                    <div className={`min-w-[240px] p-6 rounded-[2.5rem] border transition-all duration-700 flex-1 relative overflow-hidden group/menu
                        ${new Date().getHours() < 15.5
                            ? 'bg-white border-orange-200 shadow-[0_20px_50px_-15px_rgba(255,140,0,0.15)] ring-1 ring-orange-100 scale-[1.01]'
                            : 'bg-white/40 border-gray-100 opacity-60 hover:opacity-100 hover:scale-[1.01] hover:bg-white/60'}`}
                    >
                        {/* Premium Active Highlight */}
                        {new Date().getHours() < 15.5 && (
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-primary to-orange-500 animate-gradient-x"></div>
                        )}

                        {/* Decorative Active Glow */}
                        {new Date().getHours() < 15.5 && (
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
                        )}

                        <div className="flex justify-between items-start mb-5">
                            <div className="size-14 rounded-2xl bg-[#FFF9F5] border border-orange-50 flex items-center justify-center text-3xl shadow-sm group-hover/menu:scale-105 group-hover/menu:-rotate-6 transition-all duration-500 overflow-hidden relative">
                                {todaysMenu.lunch?.image ? (
                                    <img src={todaysMenu.lunch.image} alt="Lunch" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="drop-shadow-sm">{todaysMenu.lunch?.emoji || "🍛"}</span>
                                )}
                                {!todaysMenu.lunch?.items && <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>}
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border 
                                    ${new Date().getHours() < 15.5 ? 'bg-[#2D241E] text-white border-black' : 'bg-gray-100 text-gray-400 border-transparent'}`}>Lunch</span>
                                {todaysMenu.lunch?.type === 'Veg' && (
                                    <div className="flex items-center gap-1.5 bg-green-50/50 px-2 py-0.5 rounded-lg border border-green-100/50">
                                        <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                        <span className="text-[9px] font-black text-green-700 uppercase tracking-tight">Veg</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-baseline mb-2">
                            <h4 className={`font-black text-lg truncate pr-2 group-hover/menu:text-primary transition-colors duration-300
                                ${!todaysMenu.lunch?.items ? 'text-gray-300 italic' : 'text-[#2D241E]'}`}>
                                {todaysMenu.lunch?.name || "Chef's Special"}
                            </h4>
                            {todaysMenu.lunch?.price > 0 && (
                                <span className="text-base font-black text-primary drop-shadow-sm">₹{todaysMenu.lunch.price}</span>
                            )}
                        </div>

                        <p className={`text-[11px] font-medium leading-relaxed mb-6 line-clamp-2 min-h-[3em] transition-opacity duration-500
                            ${!todaysMenu.lunch?.items ? 'text-gray-300 italic' : 'text-[#5C4D42] opacity-80'}`}>
                            {todaysMenu.lunch?.items || "The kitchen is buzzing! Today's signature lunch menu is arriving shortly..."}
                        </p>

                        <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="size-6 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100/50">
                                    <span className="material-symbols-outlined text-[14px] text-orange-500 fill-1">local_fire_department</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-[#2D241E] leading-none mb-0.5">{todaysMenu.lunch?.calories || 680}</span>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Energy (kcal)</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50/80 px-3 py-1.5 rounded-xl border border-white">
                                <span className="material-symbols-outlined text-[16px] text-[#2D241E]/40">schedule</span>
                                <span className="text-[10px] font-black text-[#2D241E]">{lunchTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Dinner */}
                    <div className={`min-w-[240px] p-6 rounded-[2.5rem] border transition-all duration-700 flex-1 relative overflow-hidden group/menu
                        ${new Date().getHours() >= 15.5
                            ? 'bg-white border-indigo-200 shadow-[0_20px_50px_-15px_rgba(79,70,229,0.1)] ring-1 ring-indigo-50 scale-[1.01]'
                            : 'bg-white/40 border-gray-100 opacity-60 hover:opacity-100 hover:scale-[1.01] hover:bg-white/60'}`}
                    >
                        {/* Premium Active Highlight */}
                        {new Date().getHours() >= 15.5 && (
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-500 animate-gradient-x"></div>
                        )}

                        {/* Decorative Active Glow */}
                        {new Date().getHours() >= 15.5 && (
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                        )}

                        <div className="flex justify-between items-start mb-5">
                            <div className="size-14 rounded-2xl bg-[#F5F7FF] border border-indigo-50 flex items-center justify-center text-3xl shadow-sm group-hover/menu:scale-105 group-hover/menu:-rotate-6 transition-all duration-500 overflow-hidden relative">
                                {todaysMenu.dinner?.image ? (
                                    <img src={todaysMenu.dinner.image} alt="Dinner" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="drop-shadow-sm">{todaysMenu.dinner?.emoji || "🍱"}</span>
                                )}
                                {!todaysMenu.dinner?.items && <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>}
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border 
                                    ${new Date().getHours() >= 15.5 ? 'bg-indigo-600 text-white border-indigo-800' : 'bg-gray-100 text-gray-400 border-transparent'}`}>Dinner</span>
                                {todaysMenu.dinner?.type === 'Veg' && (
                                    <div className="flex items-center gap-1.5 bg-green-50/50 px-2 py-0.5 rounded-lg border border-green-100/50">
                                        <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                        <span className="text-[9px] font-black text-green-700 uppercase tracking-tight">Veg</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-baseline mb-2">
                            <h4 className={`font-black text-lg truncate pr-2 group-hover/menu:text-indigo-600 transition-colors duration-300
                                ${!todaysMenu.dinner?.items ? 'text-gray-300 italic' : 'text-[#2D241E]'}`}>
                                {todaysMenu.dinner?.name || "Evening Feast"}
                            </h4>
                            {todaysMenu.dinner?.price > 0 && (
                                <span className="text-base font-black text-indigo-600 drop-shadow-sm">₹{todaysMenu.dinner.price}</span>
                            )}
                        </div>

                        <p className={`text-[11px] font-medium leading-relaxed mb-6 line-clamp-2 min-h-[3em] transition-opacity duration-500
                            ${!todaysMenu.dinner?.items ? 'text-gray-300 italic' : 'text-[#5C4D42] opacity-80'}`}>
                            {todaysMenu.dinner?.items || "The evening menu is in the works! Unveiling tonight's gourmet selections very soon."}
                        </p>

                        <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="size-6 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100/50">
                                    <span className="material-symbols-outlined text-[14px] text-indigo-500 fill-1">local_fire_department</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-[#2D241E] leading-none mb-0.5">{todaysMenu.dinner?.calories || 680}</span>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Energy (kcal)</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50/80 px-3 py-1.5 rounded-xl border border-white">
                                <span className="material-symbols-outlined text-[16px] text-[#2D241E]/40">schedule</span>
                                <span className="text-[10px] font-black text-[#2D241E]">{dinnerTime}</span>
                            </div>
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

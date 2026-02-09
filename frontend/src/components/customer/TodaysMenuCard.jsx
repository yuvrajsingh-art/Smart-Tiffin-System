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
                    <div className={`min-w-[220px] p-5 rounded-3xl border transition-all duration-500 flex-1 relative overflow-hidden group/menu
                        ${new Date().getHours() < 15.5
                            ? 'bg-orange-50/90 border-orange-200 shadow-xl scale-[1.02]'
                            : 'bg-white/40 border-gray-100 opacity-60 hover:opacity-100 hover:scale-[1.01]'}`}
                    >
                        {/* Status Line */}
                        {new Date().getHours() < 15.5 && (
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-primary"></div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm group-hover/menu:rotate-12 transition-transform overflow-hidden">
                                {todaysMenu.lunch?.image ? (
                                    <img src={todaysMenu.lunch.image} alt="Lunch" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{todaysMenu.lunch?.emoji || "🍱"}</span>
                                )}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm 
                                    ${new Date().getHours() < 15.5 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>Lunch</span>
                                {todaysMenu.lunch?.type === 'Veg' && (
                                    <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-green-100">
                                        <span className="material-symbols-outlined text-green-500 text-[10px] scale-125">fiber_manual_record</span>
                                        <span className="text-[8px] font-bold text-green-700 uppercase">Veg</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-start mb-1.5">
                            <h4 className="font-black text-[#2D241E] text-base truncate pr-2 group-hover/menu:text-primary transition-colors">
                                {todaysMenu.lunch?.name || "Not Set"}
                            </h4>
                            <span className="text-sm font-black text-primary">₹{todaysMenu.lunch?.price || '--'}</span>
                        </div>
                        <p className="text-[11px] text-[#5C4D42] font-semibold leading-relaxed mb-4 line-clamp-2 min-h-[3em] opacity-80">
                            {todaysMenu.lunch?.items || "The chef is finalizing today's special lunch menu."}
                        </p>

                        <div className="flex items-center justify-between border-t border-black/5 pt-3 mt-auto">
                            <div className="flex items-center gap-1.5">
                                <div className="size-5 rounded-full bg-orange-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[12px] text-orange-600">local_fire_department</span>
                                </div>
                                <span className="text-[10px] font-black text-gray-500">{todaysMenu.lunch?.calories || 650} kcal</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400">
                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                <span className="text-[10px] font-bold">{lunchTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Dinner */}
                    <div className={`min-w-[220px] p-5 rounded-3xl border transition-all duration-500 flex-1 relative overflow-hidden group/menu
                        ${new Date().getHours() >= 15.5
                            ? 'bg-indigo-50/90 border-indigo-200 shadow-xl scale-[1.02]'
                            : 'bg-white/40 border-gray-100 opacity-60 hover:opacity-100 hover:scale-[1.01]'}`}
                    >
                        {/* Status Line */}
                        {new Date().getHours() >= 15.5 && (
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 to-indigo-600"></div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm group-hover/menu:rotate-12 transition-transform overflow-hidden">
                                {todaysMenu.dinner?.image ? (
                                    <img src={todaysMenu.dinner.image} alt="Dinner" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{todaysMenu.dinner?.emoji || "🌙"}</span>
                                )}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm 
                                    ${new Date().getHours() >= 15.5 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>Dinner</span>
                                {todaysMenu.dinner?.type === 'Veg' && (
                                    <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-green-100">
                                        <span className="material-symbols-outlined text-green-500 text-[10px] scale-125">fiber_manual_record</span>
                                        <span className="text-[8px] font-bold text-green-700 uppercase">Veg</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-start mb-1.5">
                            <h4 className="font-black text-[#2D241E] text-base truncate pr-2 group-hover/menu:text-indigo-600 transition-colors">
                                {todaysMenu.dinner?.name || "Not Set"}
                            </h4>
                            <span className="text-sm font-black text-indigo-600">₹{todaysMenu.dinner?.price || '--'}</span>
                        </div>
                        <p className="text-[11px] text-[#5C4D42] font-semibold leading-relaxed mb-4 line-clamp-2 min-h-[3em] opacity-80">
                            {todaysMenu.dinner?.items || "Evening menu is being prepared. Check back soon!"}
                        </p>

                        <div className="flex items-center justify-between border-t border-black/5 pt-3 mt-auto">
                            <div className="flex items-center gap-1.5">
                                <div className="size-5 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[12px] text-indigo-500">local_fire_department</span>
                                </div>
                                <span className="text-[10px] font-black text-gray-500">{todaysMenu.dinner?.calories || 650} kcal</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400">
                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                <span className="text-[10px] font-bold">{dinnerTime}</span>
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

import React from 'react';

const MealTimelineItem = ({
    type,
    menu,
    paused,
    preferences,
    onTogglePause,
    onUpdateGuest,
    guestCount,
    bookedCount,
    onOpenPreferences,
    isPastCutoff = false
}) => {
    return (
        <div className="relative pl-20 mb-8 last:mb-0 group">
            {/* Time Marker */}
            <div className="absolute left-0 top-0 w-[4rem] flex flex-col items-center gap-1 z-10 pt-4">
                <span className="text-[12px] font-bold text-[#2D241E] leading-none">{type === 'lunch' ? '12:30' : '08:30'}</span>
                <span className="text-[9px] font-bold text-gray-400 leading-none">PM</span>

                <div className={`size-3.5 rounded-full border-[3px] border-[#FFFBF5] shadow-sm mt-1 z-20 ${type === 'lunch' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
            </div>

            <div className={`glass-card p-5 rounded-[2.5rem] flex flex-col sm:flex-row gap-5 items-center pr-6 overflow-hidden relative transition-all duration-300 border border-white/60 shadow-sm hover:shadow-md ${paused ? 'grayscale opacity-80 bg-gray-50/80 shadow-none' : 'hover:bg-white/80'}`}>

                {/* Paused Overlay */}
                {paused && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-50/50 backdrop-blur-[1px]">
                        <span className="bg-[#2D241E] text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 animate-[scaleIn_0.2s] border border-gray-700">
                            <span className="material-symbols-outlined text-lg">pause_circle</span>
                            <span>Paused</span>
                        </span>
                    </div>
                )}

                {/* Card Badge */}
                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold uppercase tracking-wider ${type === 'lunch' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {type}
                </div>

                <div className="size-24 rounded-2xl overflow-hidden shrink-0 shadow-sm relative group-hover:scale-105 transition-transform duration-500">
                    <img src={menu?.img || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=200'} className="w-full h-full object-cover" alt={type} />
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left w-full space-y-2">
                    <div>
                        <p className="text-xs text-[#5C4D42] font-medium leading-relaxed line-clamp-2 mt-1 opacity-80">{menu?.items}</p>

                        {/* Show Preferences if set */}
                        {(preferences?.spice !== 'Medium' || preferences?.note || preferences?.extras?.extraRoti > 0 || preferences?.extras?.extraRice) && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {preferences?.spice !== 'Medium' && (
                                    <span className="text-[9px] font-bold bg-white text-orange-600 px-2 py-0.5 rounded border border-orange-100">
                                        {preferences?.spice} Spice
                                    </span>
                                )}
                                {preferences?.extras?.extraRoti > 0 && (
                                    <span className="text-[9px] font-bold bg-white text-primary px-2 py-0.5 rounded border border-primary/20 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">bakery_dining</span>
                                        +{preferences.extras.extraRoti} Roti
                                    </span>
                                )}
                                {preferences?.extras?.extraRice && (
                                    <span className="text-[9px] font-bold bg-white text-blue-600 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">rice_bowl</span>
                                        + Rice
                                    </span>
                                )}
                                {preferences?.note && (
                                    <span className="text-[9px] font-bold bg-white text-gray-500 px-2 py-0.5 rounded border border-gray-100 truncate max-w-[150px]">
                                        "{preferences?.note}"
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <span className="text-[10px] font-bold bg-white text-green-700 px-2.5 py-1 rounded-lg border border-green-100 flex items-center gap-1.5 shadow-sm">
                            <span className="size-1.5 rounded-full bg-green-500"></span> Veg
                        </span>
                        <span className="text-[10px] font-bold bg-white text-gray-500 px-2.5 py-1 rounded-lg border border-gray-100 flex items-center gap-1.5 shadow-sm">
                            <span className="material-symbols-outlined text-[10px] text-orange-400">local_fire_department</span> {menu?.cal} cal
                        </span>
                    </div>

                    {isPastCutoff && !paused && (
                        <div className="flex items-center gap-1.5 mt-1 bg-red-50/50 px-3 py-1.5 rounded-xl border border-red-100/30 w-fit animate-[fadeIn_0.5s]">
                            <span className="material-symbols-outlined text-red-500 text-[14px]">lock</span>
                            <span className="text-[9px] font-black text-red-500/80 uppercase tracking-widest leading-none">
                                Cutoff Reached ({type === 'lunch' ? '10 AM' : '4 PM'})
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-row sm:flex-col gap-2 relative z-30 justify-center">

                    {/* Guest Counter */}
                    <div className={`flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm h-10 ${paused || isPastCutoff ? 'opacity-50 pointer-events-none' : ''}`}>
                        {guestCount > 0 ? (
                            <>
                                <button
                                    onClick={() => onUpdateGuest(-1)}
                                    className={`size-10 flex items-center justify-center active:bg-gray-100 ${guestCount <= bookedCount ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-500'}`}
                                    disabled={guestCount <= bookedCount || isPastCutoff}
                                >
                                    <span className="material-symbols-outlined text-xs">remove</span>
                                </button>
                                <span className="font-bold text-xs w-6 text-center">{guestCount}</span>
                                <button
                                    onClick={() => onUpdateGuest(1)}
                                    disabled={isPastCutoff}
                                    className="size-10 hover:bg-gray-50 text-gray-500 flex items-center justify-center active:bg-gray-100"
                                >
                                    <span className="material-symbols-outlined text-xs">add</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => onUpdateGuest(1)}
                                disabled={isPastCutoff}
                                className="h-10 px-3 flex items-center gap-1.5 text-orange-600 font-bold text-[10px] hover:bg-orange-50 transition-colors w-full"
                            >
                                <span className="material-symbols-outlined text-base">person_add</span>
                                <span className="hidden sm:inline">Guest</span>
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={onOpenPreferences}
                            disabled={paused || isPastCutoff}
                            className={`h-10 flex-1 rounded-xl border flex items-center justify-center transition-colors shadow-sm ${paused || isPastCutoff
                                ? 'bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed'
                                : preferences?.spice !== 'Medium' || preferences?.note || preferences?.extras?.extraRoti > 0 || preferences?.extras?.extraRice
                                    ? 'bg-orange-50 text-orange-600 border-orange-200'
                                    : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50 hover:text-[#2D241E]'
                                }`}
                            title="Edit Preference"
                        >
                            <span className="material-symbols-outlined text-lg">tune</span>
                        </button>
                        <button
                            onClick={onTogglePause}
                            disabled={isPastCutoff}
                            className={`h-10 flex-1 rounded-xl border flex items-center justify-center transition-all shadow-sm ${isPastCutoff
                                ? 'bg-gray-50 border-gray-100 text-gray-200 cursor-not-allowed'
                                : paused
                                    ? 'bg-red-500 border-red-500 text-white'
                                    : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
                                }`}
                            title={paused ? "Resume Meal" : "Skip/Pause Meal"}
                        >
                            <span className="material-symbols-outlined text-lg">{paused ? 'play_arrow' : 'pause'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealTimelineItem;

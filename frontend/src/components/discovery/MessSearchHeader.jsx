import React from 'react';

const MessSearchHeader = ({ searchTerm, setSearchTerm, location, setLocation, onSearch }) => {
    return (
        <div className="relative py-8 md:py-12 text-center z-10">
            <div className="relative z-10 px-4">
                <span className="inline-block py-1 px-3 rounded-full bg-orange-100/80 text-primary text-[10px] font-black uppercase tracking-widest mb-3 border border-orange-200/50 backdrop-blur-sm shadow-sm animate-[fadeIn_0.5s_ease-out]">
                    Verified Tiffins Near You
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-[#2D241E] tracking-tight mb-3 leading-tight animate-[slideUp_0.5s_ease-out]">
                    Ghar Jaisa Khana, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Bas Ek Click Door.</span>
                </h1>
                <p className="text-[#5C4D42] text-sm md:text-base max-w-xl mx-auto font-medium mb-8 leading-relaxed opacity-80 animate-[slideUp_0.6s_ease-out]">
                    Find hygiene-verified homemade food services trusted by thousands of students.
                    <br className="hidden md:block" /> Filter by taste, budget, and location.
                </p>

                {/* Search & Filter Bar */}
                <div className="max-w-3xl mx-auto glass-panel p-2 rounded-[2rem] shadow-xl border-white/60 flex flex-col md:flex-row gap-2 relative z-20 animate-[scaleIn_0.5s_ease-out]">
                    {/* Location Input */}
                    <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-primary text-xl group-focus-within:scale-110 transition-transform">location_on</span>
                        </div>
                        <input
                            type="text"
                            className="w-full h-12 pl-12 pr-4 bg-white/50 hover:bg-white/70 focus:bg-white rounded-[1.5rem] border-2 border-transparent focus:border-orange-100 outline-none text-[#2D241E] font-bold text-sm placeholder:text-gray-400 placeholder:font-bold transition-all"
                            placeholder="Locate area (e.g. Kothrud)..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    {/* Divider (Desktop) */}
                    <div className="hidden md:block w-px bg-[#2D241E]/10 my-2"></div>

                    {/* Search Input */}
                    <div className="flex-[1.5] relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-primary text-xl group-focus-within:scale-110 transition-transform">search</span>
                        </div>
                        <input
                            type="text"
                            className="w-full h-12 pl-12 pr-4 bg-white/50 hover:bg-white/70 focus:bg-white rounded-[1.5rem] border-2 border-transparent focus:border-orange-100 outline-none text-[#2D241E] font-bold text-sm placeholder:text-gray-400 placeholder:font-bold transition-all"
                            placeholder="Search 'Veg Thali', 'Jain'..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={onSearch}
                        className="h-12 px-8 bg-[#111716] text-white rounded-[1.5rem] font-black uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs group"
                    >
                        <span>Find Food</span>
                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(MessSearchHeader);

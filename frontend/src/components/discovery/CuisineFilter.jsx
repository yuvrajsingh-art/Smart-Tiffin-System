import React from 'react';

const CuisineFilter = ({ filters, activeFilter, setActiveFilter }) => {
    return (
        <div className="flex flex-wrap justify-center gap-2 mt-2 px-4 animate-[fadeIn_0.5s_ease-out_0.3s]">
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border shadow-sm hover:-translate-y-0.5 active:translate-y-0 ${activeFilter === filter
                        ? 'bg-[#2D241E] text-white border-[#2D241E] shadow-md'
                        : 'bg-white/40 text-[#5C4D42] border-white/60 hover:bg-white hover:border-white'
                        }`}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
};

export default React.memo(CuisineFilter);

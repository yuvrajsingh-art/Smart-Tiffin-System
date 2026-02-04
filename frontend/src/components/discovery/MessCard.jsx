import React from 'react';
import { Link } from 'react-router-dom';

const MessCard = ({ provider }) => {
    return (
        <div className="group glass-panel rounded-[2rem] p-2.5 hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-white/40 border-white/60">
            {/* Image Wrapper */}
            <div className="relative h-48 rounded-[1.5rem] overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-all">
                <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20 text-white shadow-lg ${provider.type.includes('Pure Veg') ? 'bg-green-600/90' : 'bg-red-600/90'
                        }`}>
                        {provider.type}
                    </span>
                    {provider.isVerified && (
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20 text-white bg-blue-500/90 shadow-lg flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">verified</span> Verified
                        </span>
                    )}
                </div>

                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xl px-2.5 py-1 rounded-full text-[11px] font-black text-[#2D241E] flex items-center gap-1 shadow-md">
                    <span className="material-symbols-outlined text-amber-500 text-[14px] fill-current">star</span>
                    {provider.rating}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-black text-lg leading-tight mb-1 group-hover:text-orange-200 transition-colors line-clamp-1 text-shadow-sm">
                        {provider.name}
                    </h3>
                    <div className="flex items-center gap-1 text-white/90 text-[10px] font-bold uppercase tracking-wide">
                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                        {provider.location} • {provider.distance}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-2 pb-2">
                <div className="flex flex-wrap gap-1.5 mb-3 h-6 overflow-hidden">
                    {provider.tags?.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/50 rounded-md text-[9px] font-bold text-[#5C4D42] border border-[#2D241E]/5 uppercase tracking-wider">
                            {tag}
                        </span>
                    ))}
                </div>

                <p className="text-[#5C4D42] font-medium text-xs line-clamp-2 mb-4 leading-relaxed opacity-80 h-10">
                    {provider.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#2D241E]/5 mt-auto">
                    <div>
                        <p className="text-[9px] text-[#5C4D42] font-extrabold uppercase tracking-widest mb-0.5 opacity-60">Monthly Plan</p>
                        <p className="text-xl font-black text-[#2D241E]">{provider.priceRange}<span className="text-[10px] font-bold text-[#5C4D42]/60 ml-0.5">/mo</span></p>
                    </div>
                    <Link
                        to={`/customer/mess/${provider.id}`}
                        className="px-5 py-2.5 bg-[#2D241E] text-white rounded-[1.2rem] font-bold text-xs flex items-center gap-1.5 hover:bg-primary transition-all shadow-lg hover:shadow-primary/30 active:scale-95 group/btn"
                    >
                        View Menu
                        <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default React.memo(MessCard);

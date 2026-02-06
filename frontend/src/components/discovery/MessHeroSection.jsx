import React from 'react';
import { Link } from 'react-router-dom';

const MessHeroSection = ({ provider }) => {
    return (
        <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl group border border-white/20 select-none animate-[scaleIn_0.5s_ease-out]">
            {/* Banner Image with Parallax-like effect */}
            <div className="absolute inset-0 bg-gray-900">
                <img
                    src={provider.banner}
                    alt="Mess Banner"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s] ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b] via-[#1a120b]/40 to-transparent z-10"></div>
            </div>

            {/* Back Button */}
            <Link to="/customer/find-mess" className="absolute top-6 left-6 z-20 px-4 py-2 rounded-[1rem] bg-white/10 backdrop-blur-xl flex items-center gap-2 text-white hover:bg-white/20 border border-white/10 transition-all text-xs font-bold shadow-lg group/back">
                <span className="material-symbols-outlined text-lg group-hover/back:-translate-x-1 transition-transform">arrow_back</span>
                Back to Discovery
            </Link>

            {/* Verified Badge (Absolute Top Right) */}
            <div className="absolute top-6 right-6 z-20">
                <div className="flex items-center gap-1.5 bg-green-500/20 backdrop-blur-md border border-green-500/30 px-3 py-1.5 rounded-full shadow-lg">
                    <span className="material-symbols-outlined text-green-400 text-[18px]">verified</span>
                    <span className="text-green-100 text-[10px] font-black uppercase tracking-widest">Verified Kitchen</span>
                </div>
            </div>

            {/* Content Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl animate-[slideUp_0.5s_ease-out_0.1s]">
                        {/* Tags & Ratings */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/10 text-white ${provider.type.includes('Pure Veg') ? 'bg-green-600' : 'bg-red-600'}`}>
                                {provider.type}
                            </span>
                            <span className="flex items-center gap-1.5 text-[#1a120b] font-black text-xs bg-white/90 px-3 py-1 rounded-full backdrop-blur-xl shadow-lg">
                                <span className="material-symbols-outlined text-[16px] text-amber-500 fill-current">star</span>
                                {provider.rating} <span className="text-gray-400 mx-1">•</span> {provider.reviews} Reviews
                            </span>
                        </div>

                        {/* Title & Address */}
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-xl mb-3 leading-none">
                            {provider.name}
                        </h1>
                        <p className="text-white/80 text-sm md:text-base font-bold flex items-center gap-2 drop-shadow-md bg-black/20 backdrop-blur-sm w-fit px-3 py-1 rounded-lg border border-white/5">
                            <span className="material-symbols-outlined text-[20px] text-orange-400">location_on</span>
                            {provider.address}
                        </p>
                    </div>

                    {/* Quick Stats (Desktop Only) */}
                    <div className="hidden md:flex gap-4 animate-[slideUp_0.5s_ease-out_0.2s]">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center min-w-[80px]">
                            <p className="text-[10px] text-white/60 font-black uppercase tracking-wider mb-1">Monthly</p>
                            <p className="text-white font-black text-xl">₹{provider.monthlyPrice}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center min-w-[80px]">
                            <p className="text-[10px] text-white/60 font-black uppercase tracking-wider mb-1">Weekly</p>
                            <p className="text-white font-black text-xl">₹{provider.weeklyPrice}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessHeroSection;

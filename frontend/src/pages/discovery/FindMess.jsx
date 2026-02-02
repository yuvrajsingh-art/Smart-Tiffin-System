import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const FindMess = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    const filters = ['All', 'Pure Veg', 'Student Special', 'Budget', 'Premium'];

    const fetchProviders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/discovery/find-mess', {
                params: {
                    location: location,
                    searchTerm: searchTerm,
                    filter: activeFilter
                }
            });
            if (data.success) {
                setProviders(data.data);
            }
        } catch (error) {
            console.error("Error fetching providers:", error);
            toast.error("Failed to load mess providers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProviders();
        }, 300); // Debounce search/location changes

        return () => clearTimeout(timer);
    }, [searchTerm, location, activeFilter]);

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out] pb-20 relative px-4">

            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="blob blob-1 blob-primary opacity-30 scale-75"></div>
                <div className="blob blob-2 blob-secondary opacity-30 scale-75"></div>
            </div>

            {/* Premium Hero Search Header (Compact) */}
            <div className="relative py-8 md:py-10 text-center z-10">
                <div className="relative z-10 px-4">
                    <span className="inline-block py-1 px-3 rounded-full bg-orange-100/80 text-primary text-[10px] font-black uppercase tracking-widest mb-3 border border-orange-200/50 backdrop-blur-sm">
                        Verified Tiffins Near You
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-[#2D241E] tracking-tight mb-2 leading-tight">
                        Ghar Jaisa Khana, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Bas Ek Click Door.</span>
                    </h1>
                    <p className="text-[#5C4D42] text-sm max-w-xl mx-auto font-medium mb-6 leading-relaxed">
                        Find hygiene-verified homemade food services trusted by thousands of students.
                    </p>

                    {/* Search & Filter Bar (Compact) */}
                    <div className="max-w-3xl mx-auto glass-panel p-1.5 rounded-[1.5rem] shadow-lg border-white/60 flex flex-col md:flex-row gap-2 relative z-20">
                        {/* Location Input */}
                        <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-primary text-xl group-focus-within:scale-110 transition-transform">location_on</span>
                            </div>
                            <input
                                type="text"
                                className="w-full h-10 pl-10 pr-3 bg-white/40 hover:bg-white/60 focus:bg-white rounded-xl border-none outline-none text-[#2D241E] font-bold text-sm placeholder:text-gray-400 placeholder:font-medium transition-all"
                                placeholder="Locate area..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        {/* Divider (Desktop) */}
                        <div className="hidden md:block w-px bg-[#2D241E]/10 my-1.5"></div>

                        {/* Search Input */}
                        <div className="flex-[1.5] relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-primary text-xl group-focus-within:scale-110 transition-transform">search</span>
                            </div>
                            <input
                                type="text"
                                className="w-full h-10 pl-10 pr-3 bg-white/40 hover:bg-white/60 focus:bg-white rounded-xl border-none outline-none text-[#2D241E] font-bold text-sm placeholder:text-gray-400 placeholder:font-medium transition-all"
                                placeholder="Search 'Veg Thali'..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={fetchProviders}
                            className="h-10 px-5 bg-[#111716] text-white rounded-xl font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <span>Search</span>
                        </button>
                    </div>

                    {/* Filter Chips (Compact) */}
                    <div className="flex flex-wrap justify-center gap-2 mt-5">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${activeFilter === filter ? 'bg-[#2D241E] text-white border-[#2D241E]' : 'bg-white/40 text-[#5C4D42] border-white/60 hover:bg-white/70 shadow-sm'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Provider Grid (Compact) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10 px-4">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse glass-panel rounded-[1.5rem] p-4 bg-white/40 h-64">
                            <div className="w-full h-32 bg-gray-200 rounded-xl mb-4"></div>
                            <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                        </div>
                    ))
                ) : providers.length > 0 ? (
                    providers.map((provider) => (
                        <div key={provider.id} className="group glass-panel rounded-[1.5rem] p-2 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 bg-white/40 border-white/50">
                            {/* Image Wrapper */}
                            <div className="relative h-40 rounded-[1.2rem] overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-all">
                                <img src={provider.image} alt={provider.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70"></div>

                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20 text-white ${provider.type.includes('Pure Veg') ? 'bg-green-600/90' : 'bg-red-600/90'}`}>
                                        {provider.type}
                                    </span>
                                </div>
                                <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-black text-[#2D241E] flex items-center gap-0.5 shadow-sm">
                                    <span className="material-symbols-outlined text-amber-500 text-[12px] fill-current">star</span>
                                    {provider.rating}
                                </div>

                                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                                    <div className="text-white">
                                        <h3 className="text-sm font-bold leading-tight mb-0.5 group-hover:text-orange-200 transition-colors line-clamp-1">{provider.name}</h3>
                                        <div className="flex items-center gap-1 text-white/80 text-[10px] font-medium">
                                            <span className="material-symbols-outlined text-[12px]">location_on</span>
                                            {provider.location} • {provider.distance}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-2 pb-2">
                                <p className="text-[#5C4D42] font-medium text-[11px] line-clamp-2 mb-3 leading-relaxed opacity-90 h-8">
                                    {provider.description}
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-[#2D241E]/5">
                                    <div>
                                        <p className="text-[9px] text-[#5C4D42] font-extrabold uppercase tracking-widest mb-0.5">Monthly</p>
                                        <p className="text-lg font-black text-[#2D241E]">{provider.priceRange}<span className="text-[10px] font-bold text-[#5C4D42]/60">/mo</span></p>
                                    </div>
                                    <Link to={`/customer/mess/${provider.id}`} className="px-4 py-2 bg-[#111716] text-white rounded-[1rem] font-bold text-[10px] flex items-center gap-1 hover:bg-primary transition-all shadow-md hover:shadow-primary/30 active:scale-95 group/btn">
                                        View
                                        <span className="material-symbols-outlined text-[14px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-gray-400">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                        <p>No verified tiffins found matching your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindMess;

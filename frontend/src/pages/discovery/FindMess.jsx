import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input';

const MOCK_PROVIDERS = [
    {
        id: 1,
        name: "Annapurna Mess Services",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2670&auto=format&fit=crop",
        distance: "0.5 km",
        type: "Both", // Veg/Non-Veg
        priceRange: "₹2500 - ₹4000",
        rating: 4.8,
        reviews: 120,
        description: "Home-style food with authentic Marathi taste. Daily changing menu with sweet dish on Sundays.",
        location: "Kothrud, Pune"
    },
    {
        id: 2,
        name: "Healthy Bites Tiffin",
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2670&auto=format&fit=crop",
        distance: "1.2 km",
        type: "Veg Only",
        priceRange: "₹2200 - ₹3500",
        rating: 4.5,
        reviews: 85,
        description: "Pure vegetarian nutritious meals. Less oil, more taste. Perfect for students.",
        location: "Karve Nagar, Pune"
    },
    {
        id: 3,
        name: "Spice Box Kitchen",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2670&auto=format&fit=crop",
        distance: "2.5 km",
        type: "Both",
        priceRange: "₹3000 - ₹5000",
        rating: 4.2,
        reviews: 45,
        description: "North Indian specialities. Spicy and delicious meals delivered hot.",
        location: "Baner, Pune"
    }
];

const FindMess = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out] pb-20">
            {/* Premium Hero Search Header */}
            <div className="relative py-12 md:py-20 text-center overflow-hidden rounded-3xl bg-orange-50/50 mb-12">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-40"></div>
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 px-6">
                    <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-primary text-xs font-black uppercase tracking-widest mb-4">Discovery</span>
                    <h1 className="text-4xl md:text-6xl font-black text-[#2D241E] tracking-tight mb-6">
                        Find Your Next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Favorite Meal</span>
                    </h1>
                    <p className="text-[#5C4D42] text-lg max-w-2xl mx-auto font-medium mb-10">
                        Explore top-rated homemade tiffin services nearby. Healthy, hygienic, and just like mom's cooking.
                    </p>

                    {/* Glass Control Center */}
                    <div className="max-w-4xl mx-auto glass-panel p-3 rounded-[2rem] shadow-2xl shadow-orange-500/10 backdrop-blur-xl border border-white/40 flex flex-col md:flex-row gap-2 relative z-20">

                        {/* Location Input */}
                        <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-primary group-focus-within:scale-110 transition-transform">location_on</span>
                            </div>
                            <input
                                type="text"
                                className="w-full h-14 pl-12 pr-4 bg-white/50 hover:bg-white/80 focus:bg-white rounded-2xl border-none outline-none text-[#2D241E] font-bold placeholder:text-gray-400 placeholder:font-medium transition-all"
                                placeholder="Locate area..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        {/* Divider (Desktop) */}
                        <div className="hidden md:block w-px bg-gray-200 my-2"></div>

                        {/* Search Input */}
                        <div className="flex-[1.5] relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-primary group-focus-within:scale-110 transition-transform">search</span>
                            </div>
                            <input
                                type="text"
                                className="w-full h-14 pl-12 pr-4 bg-white/50 hover:bg-white/80 focus:bg-white rounded-2xl border-none outline-none text-[#2D241E] font-bold placeholder:text-gray-400 placeholder:font-medium transition-all"
                                placeholder="Search 'Veg Thali' or 'Annapurna'..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Search Button */}
                        <button className="h-14 px-8 bg-[#111716] text-white rounded-xl font-bold shadow-lg shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            <span>Search</span>
                        </button>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {['Pure Veg', 'Rating 4.0+', 'Under ₹3000', 'Student Special'].map((filter) => (
                            <button key={filter} className="px-5 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-sm font-bold text-gray-600 hover:text-primary hover:border-primary/30 hover:bg-orange-50 transition-all">
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {MOCK_PROVIDERS.map((provider) => (
                    <div key={provider.id} className="group bg-white rounded-[2.5rem] p-3 shadow-xl shadow-gray-100 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                        {/* Image Wrapper */}
                        <div className="relative h-64 rounded-[2rem] overflow-hidden mb-4">
                            <img src={provider.image} alt={provider.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                            {/* Floating Badges */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-lg ${provider.type.includes('Veg Only') ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                    {provider.type}
                                </span>
                            </div>

                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black text-[#2D241E] flex items-center gap-1 shadow-lg">
                                <span className="material-symbols-outlined text-yellow-500 text-[18px] fill-current">star</span>
                                {provider.rating} <span className="text-gray-400 font-medium">({provider.reviews})</span>
                            </div>

                            <div className="absolute bottom-4 left-4 text-white">
                                <div className="flex items-center gap-1.5 text-white/90 text-sm font-bold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                                    {provider.distance}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-4 pb-2">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-black text-[#2D241E] group-hover:text-primary transition-colors line-clamp-1">{provider.name}</h3>
                            </div>
                            <p className="text-[#5C4D42] font-medium text-sm line-clamp-2 mb-6 h-10 leading-relaxed opacity-80">
                                {provider.description}
                            </p>

                            <div className="flex items-center justify-between gap-4 mt-auto">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-0.5">Monthly</p>
                                    <p className="text-2xl font-black text-[#2D241E]">{provider.priceRange.split(' - ')[0]}<span className="text-sm text-gray-400 font-bold">+</span></p>
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/customer/mess/${provider.id}`} className="size-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-[#2D241E] hover:border-primary hover:text-primary transition-colors bg-white">
                                        <span className="material-symbols-outlined">menu_book</span>
                                    </Link>
                                    <Link to={`/customer/mess/${provider.id}`} className="h-12 px-6 bg-[#111716] text-white rounded-full font-bold text-sm flex items-center gap-2 hover:bg-primary transition-colors shadow-lg hover:shadow-primary/30">
                                        View
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindMess;

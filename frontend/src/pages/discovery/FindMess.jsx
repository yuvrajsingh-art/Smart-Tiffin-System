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
            {/* Header Section */}
            <div className="text-center space-y-4 py-8">
                <h1 className="text-4xl font-black text-[#2D241E] tracking-tight">Find Your Perfect Mess</h1>
                <p className="text-[#5C4D42] max-w-2xl mx-auto">Discover top-rated tiffin services near you. Fresh, hygienic, and affordable meals just a click away.</p>
            </div>

            {/* Search & Filter */}
            <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row gap-4 items-center bg-white/50 backdrop-blur-xl border border-orange-100/50 shadow-lg">
                <div className="relative flex-1 w-full">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">location_on</span>
                    <input
                        type="text"
                        placeholder="Enter your location (e.g. Kothrud)"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-[#2D241E] font-medium placeholder:text-gray-400"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-primary bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">
                        Auto-Detect
                    </button>
                </div>
                <div className="relative flex-[2] w-full">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Search by mess name, type (Veg/Non-Veg)..."
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-[#2D241E] font-medium placeholder:text-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="w-full md:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all text-nowrap">
                    Search Results
                </button>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_PROVIDERS.map((provider) => (
                    <div key={provider.id} className="group bg-white rounded-[2rem] overflow-hidden border border-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                        {/* Image */}
                        <div className="relative h-56 overflow-hidden">
                            <img src={provider.image} alt={provider.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#2D241E] flex items-center gap-1 shadow-sm">
                                <span className="material-symbols-outlined text-yellow-500 text-[16px] fill-current">star</span>
                                {provider.rating} ({provider.reviews})
                            </div>
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold shadow-sm backdrop-blur-md ${provider.type.includes('Veg Only') ? 'bg-green-100/90 text-green-700' : 'bg-red-100/90 text-red-700'}`}>
                                    {provider.type}
                                </span>
                                <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                                    <span className="material-symbols-outlined text-[14px]">distance</span>
                                    {provider.distance}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-[#2D241E] group-hover:text-primary transition-colors">{provider.name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                                        {provider.location}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-[#5C4D42] line-clamp-2 my-4 leading-relaxed">
                                {provider.description}
                            </p>

                            <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Starts from</p>
                                    <p className="text-lg font-black text-[#2D241E]">{provider.priceRange}<span className="text-xs text-gray-400 font-normal">/mo</span></p>
                                </div>
                                <Link to={`/customer/mess/${provider.id}`} className="px-6 py-3 bg-[#111716] text-white rounded-xl font-bold text-sm hover:bg-primary transition-colors shadow-lg hover:shadow-primary/25">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindMess;

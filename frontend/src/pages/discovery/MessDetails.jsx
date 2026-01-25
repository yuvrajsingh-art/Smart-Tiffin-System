import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const MessDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('menu');

    // Mock Data
    const provider = {
        id: id,
        name: "Annapurna Mess Services",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2670&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2670&auto=format&fit=crop",
        type: "Veg & Non-Veg",
        rating: 4.8,
        reviews: 120,
        address: "Kothrud, Pune",
        description: "Authentic Maharashtrian Thali. Serving since 2012.",
        features: ["Hygiene Verified", "Sunday Sweet", "Ghar Jaisa Taste"],
        reviewsList: [
            { id: 1, user: "Rohan D.", rating: 5, date: "2 days ago", text: "Best Paneer Masala I've had in Pune! Reminds me of home." },
            { id: 2, user: "Neha S.", rating: 4, date: "1 week ago", text: "Good variety, but Sunday delivery is sometimes late. Food is tasty." },
            { id: 3, user: "Amit K.", rating: 5, date: "2 weeks ago", text: "Hygiene is top notch. Packaging is spill-proof." }
        ],
        menu: [
            { day: "Mon", lunch: "Paneer Butter Masala, 3 Rotis, Rice", dinner: "Aloo Gobi Dry, 3 Rotis, Dal", badges: ["Bestseller"] },
            { day: "Tue", lunch: "Aloo Matar, 3 Rotis, Jeera Rice", dinner: "Sev Bhaji, 3 Rotis, Khichdi" },
            { day: "Wed", lunch: "Veg Kofta Curry, 3 Rotis, Rice", dinner: "Dal Fry, Jeera Rice, Salad" },
            { day: "Thu", lunch: "Baingan Bharta, 3 Rotis, Rice", dinner: "Methi Matar, 3 Rotis, Dal", badges: ["Chef's Special"] },
            { day: "Fri", lunch: "Chole Masala, 2 Bhature, Rice", dinner: "Soyabean Curry, 3 Rotis" },
            { day: "Sat", lunch: "Rajma Chawal, Curd, Salad", dinner: "Egg Curry / Paneer Bhurji", badges: ["Protein Heavy"] },
            { day: "Sun", lunch: "Puran Poli Special Thali", dinner: "Light Khichdi Kadhi", badges: ["Sweet Treat"] },
        ]
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4">

            {/* Compact Header */}
            <div className="relative h-48 md:h-64 rounded-[2rem] overflow-hidden mb-6 shadow-xl group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <img src={provider.banner} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />

                {/* Back Button */}
                <Link to="/customer/find-mess" className="absolute top-4 left-4 z-20 size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>

                <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-primary text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm">
                                    {provider.type}
                                </span>
                                <span className="flex items-center gap-1 text-white/90 text-xs font-bold bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-md">
                                    <span className="material-symbols-outlined text-[14px] text-amber-400 fill-current">star</span>
                                    {provider.rating} ({provider.reviews})
                                </span>
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight shadow-sm leading-none">{provider.name}</h1>
                            <p className="text-white/80 text-sm font-medium flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                {provider.address}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Tabbed Interface */}
                <div className="lg:col-span-2">
                    {/* Tabs */}
                    <div className="flex p-1 bg-white/40 backdrop-blur-md rounded-xl border border-white/60 mb-6 gap-1">
                        {['menu', 'about', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-[#2D241E] text-white shadow-md' : 'text-[#5C4D42] hover:bg-white/50'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="glass-panel p-6 rounded-3xl min-h-[400px]">
                        {activeTab === 'menu' && (
                            <div className="space-y-4 animate-[fadeIn_0.3s]">
                                <h3 className="text-lg font-black text-[#2D241E] mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">restaurant_menu</span>
                                    This Week's Menu
                                </h3>
                                <div className="grid gap-3">
                                    {provider.menu.map((day, idx) => (
                                        <div key={idx} className="relative flex gap-4 p-4 rounded-2xl hover:bg-orange-50/50 border border-transparent hover:border-orange-100 transition-colors group overflow-hidden">
                                            {/* Badges */}
                                            {day.badges && (
                                                <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
                                                    {day.badges[0]}
                                                </div>
                                            )}

                                            <div className="w-12 h-12 rounded-xl bg-[#2D241E] text-white flex items-center justify-center font-black text-sm uppercase shadow-sm shrink-0">
                                                {day.day}
                                            </div>
                                            <div className="flex-1 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] text-[#5C4D42]/60 font-bold uppercase tracking-wider mb-0.5">Lunch</p>
                                                    <p className="text-sm font-bold text-[#2D241E] line-clamp-1 group-hover:text-primary transition-colors">{day.lunch}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-[#5C4D42]/60 font-bold uppercase tracking-wider mb-0.5">Dinner</p>
                                                    <p className="text-sm font-bold text-[#2D241E] line-clamp-1 text-opacity-80">{day.dinner}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="animate-[fadeIn_0.3s]">
                                <h3 className="text-lg font-black text-[#2D241E] mb-4">About {provider.name}</h3>
                                <p className="text-[#5C4D42] text-sm leading-relaxed mb-6">{provider.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {provider.features.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">verified</span>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="animate-[fadeIn_0.3s] space-y-4">
                                <h3 className="text-lg font-black text-[#2D241E] mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-amber-500">star</span>
                                    Student Reviews
                                </h3>
                                {provider.reviewsList.map((review) => (
                                    <div key={review.id} className="p-4 rounded-2xl bg-white/50 border border-white/60 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="size-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center font-black text-xs text-orange-700">
                                                    {review.user.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-[#2D241E]">{review.user}</p>
                                                    <p className="text-[9px] text-gray-400 font-medium">{review.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex text-amber-400 text-[10px]">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`material-symbols-outlined text-[14px] ${i < review.rating ? 'fill-current' : 'text-gray-200'}`}>star</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-[#5C4D42] leading-relaxed font-medium">"{review.text}"</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Sticky Subscription */}
                <div className="space-y-4">
                    <div className="glass-panel p-5 rounded-[2rem] sticky top-24 border-2 border-primary/10">
                        <h2 className="text-lg font-black text-[#2D241E] mb-4">Subscribe Now</h2>

                        {/* Monthly */}
                        <div className="bg-orange-50 rounded-2xl p-4 mb-3 border border-orange-100 relative overflow-hidden group hover:border-primary/40 transition-colors">
                            <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">Best Value</div>
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h3 className="font-bold text-[#2D241E]">Monthly Complete</h3>
                                    <p className="text-[10px] text-[#5C4D42]">Lunch & Dinner + Weekend Specials</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-[#2D241E]">₹3500</span>
                                </div>
                            </div>
                            <button className="w-full py-2.5 bg-[#2D241E] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-primary transition-colors flex items-center justify-center gap-2 group/btn">
                                <Link to={`/customer/mess/${id}/subscribe?plan=monthly`} className="w-full h-full flex items-center justify-center gap-2">
                                    Select Plan
                                    <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                            </button>
                        </div>

                        {/* Weekly */}
                        <div className="bg-white/40 rounded-2xl p-4 border border-white/60 hover:bg-white/60 transition-colors">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h3 className="font-bold text-[#2D241E] text-sm">Weekly Trial</h3>
                                    <p className="text-[10px] text-[#5C4D42]">Good for testing</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-black text-[#2D241E]">₹900</span>
                                </div>
                            </div>
                            <button className="w-full py-2.5 bg-transparent border-2 border-[#2D241E]/10 text-[#2D241E] rounded-xl font-bold text-sm hover:border-[#2D241E] hover:bg-[#2D241E] hover:text-white transition-all">
                                <Link to={`/customer/mess/${id}/subscribe?plan=weekly`} className="w-full h-full block">
                                    Try Weekly
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessDetails;

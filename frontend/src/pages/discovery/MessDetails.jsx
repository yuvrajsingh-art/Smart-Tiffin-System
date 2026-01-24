import React from 'react';
import { useParams, Link } from 'react-router-dom';

const MessDetails = () => {
    const { id } = useParams();

    // Mock Data (In real app, fetch by ID)
    const provider = {
        id: id,
        name: "Annapurna Mess Services",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2670&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2670&auto=format&fit=crop",
        type: "Veg & Non-Veg",
        rating: 4.8,
        reviews: 120,
        address: "Shop No. 4, Golden Heights, Kothrud, Pune - 411038",
        description: "We have been serving homely food for over 10 years. Our specialty is authentic Maharashtrian Thali. We use only refined oil and fresh vegetables sourced daily from the market.",
        hygiene: ["Daily Kitchen Sanitization", "Staff Temperature Checks", "Fresh Ingredients Only"],
        menuPreview: [
            { day: "Today", lunch: "Paneer Masala, 3 Rotis, Rice, Dal", dinner: "Aloo Gobi, 3 Rotis, Khichdi" },
            { day: "Tomorrow", lunch: "Mix Veg, 3 Rotis, Jeera Rice", dinner: "Egg Curry / Paneer Bhurji, Bhakri" },
        ]
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out]">
            {/* Banner Section */}
            <div className="relative h-[300px] md:h-[400px] rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <img src={provider.banner} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="bg-primary text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 inline-block shadow-lg">
                                {provider.type}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 shadow-sm">{provider.name}</h1>
                            <p className="text-white/90 text-sm md:text-base font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">location_on</span>
                                {provider.address}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center text-white min-w-[100px]">
                                <p className="text-2xl font-black">{provider.rating}</p>
                                <p className="text-xs opacity-80">Rating</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center text-white min-w-[100px]">
                                <p className="text-2xl font-black">{provider.reviews}</p>
                                <p className="text-xs opacity-80">Reviews</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Info & Menu */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <section className="glass-panel p-8 rounded-3xl">
                        <h2 className="text-2xl font-bold text-[#2D241E] mb-4">About this Mess</h2>
                        <p className="text-[#5C4D42] leading-relaxed mb-6">{provider.description}</p>

                        <h3 className="text-sm font-extrabold text-[#2D241E] uppercase tracking-wider mb-4">Hygiene Standards</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {provider.hygiene.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 bg-green-50 p-3 rounded-xl border border-green-100">
                                    <div className="size-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                                    </div>
                                    <span className="text-xs font-bold text-green-800">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Menu Preview */}
                    <section className="glass-panel p-8 rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[#2D241E]">Weekly Menu Preview</h2>
                            <button className="text-primary font-bold text-sm hover:underline">View Full Menu</button>
                        </div>
                        <div className="space-y-4">
                            {provider.menuPreview.map((item, index) => (
                                <div key={index} className="bg-white border border-orange-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="bg-[#2D241E] text-white px-3 py-1 rounded-lg text-xs font-bold uppercase">{item.day}</span>
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex gap-4">
                                            <div className="size-10 rounded-lg bg-orange-50 flex items-center justify-center text-xl">☀️</div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Lunch</p>
                                                <p className="text-[#2D241E] font-medium text-sm">{item.lunch}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="size-10 rounded-lg bg-indigo-50 flex items-center justify-center text-xl">🌙</div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Dinner</p>
                                                <p className="text-[#2D241E] font-medium text-sm">{item.dinner}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Plans */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-3xl sticky top-24">
                        <h2 className="text-xl font-bold text-[#2D241E] mb-6">Subscription Plans</h2>
                        <div className="space-y-4">
                            {/* Monthly Plan */}
                            <div className="border-2 border-primary bg-orange-50/50 rounded-2xl p-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">BEST VALUE</div>
                                <h3 className="font-bold text-[#2D241E] text-lg">Monthly Complete</h3>
                                <div className="flex items-baseline gap-1 my-2">
                                    <span className="text-3xl font-black text-[#2D241E]">₹3500</span>
                                    <span className="text-sm text-gray-500">/month</span>
                                </div>
                                <ul className="space-y-2 mb-6 text-sm text-[#5C4D42]">
                                    <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-[16px]">check</span> Lunch & Dinner included</li>
                                    <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-[16px]">check</span> Weekend Specials</li>
                                    <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-[16px]">check</span> 2 Pauses allowed</li>
                                </ul>
                                <Link to={`/customer/mess/${id}/subscribe?plan=monthly`} className="block w-full text-center py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-[#e05d00] transition-colors">
                                    Select Plan
                                </Link>
                            </div>

                            {/* Weekly Plan */}
                            <div className="border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors">
                                <h3 className="font-bold text-[#2D241E] text-lg">Weekly Trial</h3>
                                <div className="flex items-baseline gap-1 my-2">
                                    <span className="text-3xl font-black text-[#2D241E]">₹900</span>
                                    <span className="text-sm text-gray-500">/week</span>
                                </div>
                                <ul className="space-y-2 mb-6 text-sm text-[#5C4D42]">
                                    <li className="flex gap-2"><span className="material-symbols-outlined text-gray-400 text-[16px]">check</span> Lunch or Dinner</li>
                                    <li className="flex gap-2"><span className="material-symbols-outlined text-gray-400 text-[16px]">check</span> No Pause allowed</li>
                                </ul>
                                <Link to={`/customer/mess/${id}/subscribe?plan=weekly`} className="block w-full text-center py-3 border-2 border-[#2D241E] text-[#2D241E] rounded-xl font-bold hover:bg-[#2D241E] hover:text-white transition-colors">
                                    Select Plan
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessDetails;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const MessDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('menu');
    const [provider, setProvider] = useState(null);
    const [menuData, setMenuData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            // Fetch provider details
            const { data: detailData } = await axios.get(`/api/discovery/mess/${id}`);
            if (detailData.success) {
                setProvider(detailData.data);

                // Fetch public menu using providerId from details
                const { data: menuResp } = await axios.get(`/api/customer/menu/public/${detailData.data.providerId}`);
                if (menuResp.success) {
                    setMenuData(menuResp.data);
                }
            }
        } catch (error) {
            console.error("Error fetching details:", error);
            toast.error("Failed to load mess details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    if (!provider) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold">Provider not found</h2>
            <Link to="/customer/find-mess" className="text-primary hover:underline">Go back to discovery</Link>
        </div>
    );

    const menuDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">

            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="blob blob-1 blob-primary opacity-30 scale-75"></div>
                <div className="blob blob-2 blob-secondary opacity-30 scale-75"></div>
            </div>

            {/* Header Section */}
            <div className="relative h-56 md:h-72 rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl group border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D241E] via-black/20 to-transparent z-10"></div>
                <img src={provider.banner} alt="Banner" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />

                {/* Back Button */}
                <Link to="/customer/find-mess" className="absolute top-6 left-6 z-20 px-4 py-2 rounded-full bg-white/20 backdrop-blur-xl flex items-center gap-1 text-white hover:bg-white/40 border border-white/30 transition-all text-xs font-bold shadow-lg">
                    <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Discovery
                </Link>

                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="max-w-xl">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">
                                    {provider.type}
                                </span>
                                <span className="flex items-center gap-1 text-white font-black text-xs bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                                    <span className="material-symbols-outlined text-[14px] text-amber-400 fill-current">star</span>
                                    {provider.rating} <span className="text-white/40 mx-0.5">•</span> {provider.reviews} Reviews
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-md mb-2">{provider.name}</h1>
                            <p className="text-white/90 text-sm font-bold flex items-center gap-2 drop-shadow-sm">
                                <span className="material-symbols-outlined text-[18px] text-orange-200">location_on</span>
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
                                    {menuData ? (
                                        menuDays.map((day, idx) => (
                                            <div key={idx} className="relative flex gap-4 p-4 rounded-2xl hover:bg-orange-50/50 border border-transparent hover:border-orange-100 transition-colors group overflow-hidden">
                                                {menuData[day]?.badges?.length > 0 && (
                                                    <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
                                                        {menuData[day].badges[0]}
                                                    </div>
                                                )}

                                                <div className="w-12 h-12 rounded-xl bg-[#2D241E] text-white flex items-center justify-center font-black text-sm uppercase shadow-sm shrink-0">
                                                    {day}
                                                </div>
                                                <div className="flex-1 grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-[10px] text-[#5C4D42]/60 font-bold uppercase tracking-wider mb-0.5">Lunch</p>
                                                        <p className="text-sm font-bold text-[#2D241E] line-clamp-1 group-hover:text-primary transition-colors">{menuData[day]?.lunch}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-[#5C4D42]/60 font-bold uppercase tracking-wider mb-0.5">Dinner</p>
                                                        <p className="text-sm font-bold text-[#2D241E] line-clamp-1 text-opacity-80">{menuData[day]?.dinner}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-center py-10 italic">Menu data not available for this provider yet.</p>
                                    )}
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
                                <div className="mt-6">
                                    <h4 className="text-sm font-black text-[#2D241E] mb-2">Cuisines Offered</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {provider.cuisines.map((c, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md text-[10px] font-bold border border-orange-100">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="animate-[fadeIn_0.3s] space-y-4">
                                <h3 className="text-lg font-black text-[#2D241E] mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-amber-500">star</span>
                                    Student Reviews
                                </h3>
                                <p className="text-gray-400 text-center py-10 italic">No reviews yet for this provider.</p>
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

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    MessHeroSection,
    SubscriptionPlansGrid,
    ReviewCarousel
} from '../../components/discovery';
import { BackgroundBlobs } from '../../components/common';

const MessDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('menu');
    const [provider, setProvider] = useState(null);
    const [menuData, setMenuData] = useState(null);
    const [loading, setLoading] = useState(true);

    const menuDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
        <div className="text-center py-20 flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">storefront</span>
            <h2 className="text-2xl font-bold text-gray-800">Provider not found</h2>
            <Link to="/customer/find-mess" className="text-primary hover:underline font-bold mt-2">Go back to discovery</Link>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">
            <BackgroundBlobs />

            <MessHeroSection provider={provider} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Tabbed Interface */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Tabs */}
                    <div className="flex p-1.5 bg-white/40 backdrop-blur-md rounded-[1.2rem] border border-white/60 gap-1 shadow-sm sticky top-4 z-30">
                        {['menu', 'about', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition-all ${activeTab === tab ? 'bg-[#2D241E] text-white shadow-lg transform scale-[1.02]' : 'text-[#5C4D42] hover:bg-white/50'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] min-h-[500px] border border-white/60 bg-white/30">
                        {activeTab === 'menu' && (
                            <div className="space-y-6 animate-[fadeIn_0.3s]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-black text-[#2D241E] flex items-center gap-2">
                                        <div className="size-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined text-lg">restaurant_menu</span>
                                        </div>
                                        This Week's Menu
                                    </h3>
                                    <span className="text-[10px] font-bold text-[#5C4D42] bg-white/40 px-3 py-1 rounded-full border border-white/40">Updated Today</span>
                                </div>

                                <div className="grid gap-3">
                                    {menuData ? (
                                        menuDays.map((day, idx) => (
                                            <div key={idx} className="relative flex gap-5 p-5 rounded-[1.5rem] hover:bg-white/60 bg-white/20 border border-transparent hover:border-orange-100 transition-all group overflow-hidden shadow-sm hover:shadow-md">
                                                {menuData[day]?.badges?.length > 0 && (
                                                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-orange-100 to-transparent p-4 pb-2 pl-2">
                                                        <span className="bg-primary/10 text-primary text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-primary/20">
                                                            {menuData[day].badges[0]}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="w-14 h-14 rounded-2xl bg-[#2D241E] text-white flex flex-col items-center justify-center shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                                                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">{day.substring(0, 3)}</span>
                                                    <span className="font-black text-lg">{idx + 24}</span>
                                                </div>

                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="material-symbols-outlined text-[16px] text-orange-500">sunny</span>
                                                            <p className="text-[10px] text-[#5C4D42]/80 font-black uppercase tracking-wider">Lunch</p>
                                                        </div>
                                                        <p className="text-sm font-bold text-[#2D241E] group-hover:text-primary transition-colors">{menuData[day]?.lunch || "Not Available"}</p>
                                                    </div>
                                                    <div className="container-type-normal">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="material-symbols-outlined text-[16px] text-indigo-500">dark_mode</span>
                                                            <p className="text-[10px] text-[#5C4D42]/80 font-black uppercase tracking-wider">Dinner</p>
                                                        </div>
                                                        <p className="text-sm font-bold text-[#2D241E] opacity-90">{menuData[day]?.dinner || "Not Available"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 flex flex-col items-center opacity-60">
                                            <span className="material-symbols-outlined text-4xl mb-2">menu_book</span>
                                            <p className="font-bold">Menu not available yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="animate-[fadeIn_0.3s]">
                                <h3 className="text-xl font-black text-[#2D241E] mb-6">About {provider.name}</h3>
                                <p className="text-[#5C4D42] text-sm md:text-base leading-relaxed mb-8 font-medium opacity-90">{provider.description}</p>

                                <div className="mb-8">
                                    <h4 className="text-xs font-black text-[#2D241E] uppercase tracking-widest mb-3 opacity-60">Key Features</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {provider.features.map((tag, i) => (
                                            <span key={i} className="px-4 py-2 bg-white/50 text-[#2D241E] rounded-xl text-xs font-bold border border-white/60 flex items-center gap-2 shadow-sm">
                                                <span className="material-symbols-outlined text-[16px] text-green-600">check_circle</span>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-black text-[#2D241E] uppercase tracking-widest mb-3 opacity-60">Cuisines Served</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {provider.cuisines.map((c, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-black border border-orange-100 uppercase tracking-wide">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <ReviewCarousel reviews={provider.reviewsList} />
                        )}
                    </div>
                </div>

                {/* Right Column: Sticky Subscription */}
                <div>
                    <SubscriptionPlansGrid provider={provider} providerId={id} />
                </div>
            </div>
        </div>
    );
};

export default MessDetails;

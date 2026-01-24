import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RoleSelection = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('');

    const handleContinue = () => {
        if (selectedRole) {
            navigate(`/register?role=${selectedRole}`);
        }
    };

    return (
        <div className="font-display mesh-gradient min-h-screen relative overflow-hidden flex flex-col selection:bg-primary/20 selection:text-primary">

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[#FFFBF5] z-0"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-orange-200/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-yellow-200/20 rounded-full blur-[80px]"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-50 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="size-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-[24px]">lunch_dining</span>
                    </div>
                    <span className="text-xl font-black text-[#2D241E] tracking-tight">Smart Tiffin</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="hidden sm:block text-sm text-[#5C4D42] font-medium">Already a member?</span>
                    <Link to="/login" className="px-5 py-2.5 rounded-xl bg-white/50 border border-orange-100 text-primary font-bold text-sm hover:bg-white transition-all shadow-sm">
                        Login
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
                <div className="text-center mb-12 max-w-2xl mx-auto animate-[fadeIn_0.5s_ease-out]">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100/50 border border-orange-200 text-primary text-[11px] font-bold uppercase tracking-widest mb-4">
                        Getting Started
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-[#2D241E] tracking-tight mb-4">
                        Choose your journey
                    </h1>
                    <p className="text-[#5C4D42] text-lg font-medium">
                        Are you here to find delicious meals or to grow your food business?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mb-12">
                    {/* Customer Card */}
                    <label className="group relative cursor-pointer perspective-1000">
                        <input
                            type="radio"
                            name="role"
                            value="customer"
                            className="peer sr-only"
                            onChange={(e) => setSelectedRole(e.target.value)}
                            checked={selectedRole === 'customer'}
                        />
                        <div className="relative h-[400px] glass-panel rounded-[2.5rem] p-8 flex flex-col items-center justify-between overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl peer-checked:ring-4 peer-checked:ring-primary/20 peer-checked:border-primary peer-checked:bg-white/80">

                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-50/50 opacity-0 group-hover:opacity-100 peer-checked:opacity-100 transition-opacity duration-500"></div>

                            {/* Checkmark */}
                            <div className="absolute top-6 right-6 size-8 rounded-full bg-primary text-white flex items-center justify-center opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all duration-300 shadow-lg shadow-primary/30 z-20">
                                <span className="material-symbols-outlined text-xl">check</span>
                            </div>

                            <div className="relative z-10 w-full text-center mt-4">
                                <div className="size-20 mx-auto bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-4xl">restaurant</span>
                                </div>
                                <h3 className="text-2xl font-black text-[#2D241E] mb-2">I want to Eat</h3>
                                <p className="text-[#5C4D42] font-medium leading-relaxed max-w-xs mx-auto">
                                    Subscribe to daily tiffins, browse menus, and managing your meals.
                                </p>
                            </div>

                            <div className="relative z-10 w-full mt-auto">
                                <div className="h-40 w-full rounded-2xl bg-gradient-to-br from-orange-100 to-white overflow-hidden border border-orange-100/50 flex items-center justify-center relative group-hover:shadow-lg transition-shadow duration-500">
                                    <img
                                        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop"
                                        alt="Delicious Food"
                                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    <span className="relative text-white font-bold text-sm bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                                        Join 500+ Students
                                    </span>
                                </div>
                            </div>
                        </div>
                    </label>

                    {/* Provider Card */}
                    <label className="group relative cursor-pointer perspective-1000">
                        <input
                            type="radio"
                            name="role"
                            value="provider"
                            className="peer sr-only"
                            onChange={(e) => setSelectedRole(e.target.value)}
                            checked={selectedRole === 'provider'}
                        />
                        <div className="relative h-[400px] glass-panel rounded-[2.5rem] p-8 flex flex-col items-center justify-between overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl peer-checked:ring-4 peer-checked:ring-primary/20 peer-checked:border-primary peer-checked:bg-white/80">

                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-50/50 opacity-0 group-hover:opacity-100 peer-checked:opacity-100 transition-opacity duration-500"></div>

                            {/* Checkmark */}
                            <div className="absolute top-6 right-6 size-8 rounded-full bg-primary text-white flex items-center justify-center opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all duration-300 shadow-lg shadow-primary/30 z-20">
                                <span className="material-symbols-outlined text-xl">check</span>
                            </div>

                            <div className="relative z-10 w-full text-center mt-4">
                                <div className="size-20 mx-auto bg-[#111716] rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-black/10 group-hover:scale-110 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-4xl">soup_kitchen</span>
                                </div>
                                <h3 className="text-2xl font-black text-[#2D241E] mb-2">I want to Serve</h3>
                                <p className="text-[#5C4D42] font-medium leading-relaxed max-w-xs mx-auto">
                                    Manage your kitchen, track orders, and grow your tiffin business.
                                </p>
                            </div>

                            <div className="relative z-10 w-full mt-auto">
                                <div className="h-40 w-full rounded-2xl bg-[#111716] overflow-hidden border border-gray-800 flex items-center justify-center relative group-hover:shadow-lg transition-shadow duration-500">
                                    <img
                                        src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=500&auto=format&fit=crop"
                                        alt="Chef Cooking"
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <span className="relative text-white font-bold text-sm bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                                        Partner with Us
                                    </span>
                                </div>
                            </div>
                        </div>
                    </label>
                </div>

                {/* Continue Action */}
                <div className="w-full max-w-md mx-auto animate-[fadeIn_0.5s_ease-out_0.3s]">
                    <button
                        onClick={handleContinue}
                        disabled={!selectedRole}
                        className={`
                            w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-500
                            ${selectedRole
                                ? 'bg-[#111716] text-white shadow-2xl hover:scale-[1.02] hover:-translate-y-1'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
                        `}
                    >
                        Continue Journey
                        <span className={`material-symbols-outlined transition-transform duration-300 ${selectedRole ? 'translate-x-1' : ''}`}>
                            arrow_forward
                        </span>
                    </button>

                    <p className="text-center mt-6 text-sm text-[#5C4D42] opacity-60">
                        Secure & Verified Platform • 100% Hygienic Food
                    </p>
                </div>
            </main>
        </div>
    );
};

export default RoleSelection;

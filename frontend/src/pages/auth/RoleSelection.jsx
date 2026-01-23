import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../components/ui/Logo';

const RoleSelection = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('');

    const handleContinue = () => {
        if (selectedRole) {
            navigate(`/register?role=${selectedRole}`);
        }
    };

    return (
        <div className="font-display mesh-gradient text-[#2D241E] overflow-x-hidden min-h-screen relative selection:bg-primary/20 selection:text-primary flex flex-col">
            {/* Background Blobs matching original theme */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob w-[800px] h-[800px] bg-orange-200/40 -top-40 -left-20"></div>
                <div className="blob w-[700px] h-[700px] bg-amber-100/40 top-1/4 right-0"></div>
                <div className="blob w-[900px] h-[900px] bg-orange-100/30 bottom-0 left-1/4"></div>
            </div>

            {/* Simplified Header matching RolePage layout */}
            <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                         <Logo />
                     <div className="flex items-center gap-4">
                        <span className="hidden sm:block text-sm text-[#6A717B] font-medium">Already have an account?</span>
                        <Link to="/login" className="text-sm font-bold text-primary hover:text-orange-700 transition-colors">Login</Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-32">
                <div className="w-full max-w-[900px] perspective-1000">
                    <div className="glass-panel rounded-[2rem] p-8 md:p-12 relative overflow-hidden transition-all duration-500 hover:shadow-glass-hover">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-[#111716] tracking-tight mb-2 font-display">
                                How would you like to join us?
                            </h1>
                            <p className="text-[#6A717B] text-sm font-medium">
                                Select your role to get started
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            {/* Customer Role */}
                            <label className="group relative cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="customer"
                                    className="peer sr-only"
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    checked={selectedRole === 'customer'}
                                />
                                <div className="glass-card h-full rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:bg-white/60 peer-checked:bg-orange-50/60 peer-checked:border-primary peer-checked:shadow-glass-hover peer-checked:ring-1 peer-checked:ring-primary/50 transition-all duration-300">
                                    <div className="size-16 rounded-full bg-gradient-to-br from-orange-100 to-white flex items-center justify-center shadow-inner mb-2 group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-3xl text-primary">person</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#111716] mb-2">I am a Customer</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Subscribe to healthy meals and track your daily tiffins.
                                        </p>
                                    </div>
                                    <div className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity duration-300">
                                        <div className="size-5 rounded-full bg-primary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-[14px]">check</span>
                                        </div>
                                    </div>
                                </div>
                            </label>

                            {/* Provider Role */}
                            <label className="group relative cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="provider"
                                    className="peer sr-only"
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    checked={selectedRole === 'provider'}
                                />
                                <div className="glass-card h-full rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:bg-white/60 peer-checked:bg-orange-50/60 peer-checked:border-primary peer-checked:shadow-glass-hover peer-checked:ring-1 peer-checked:ring-primary/50 transition-all duration-300">
                                    <div className="size-16 rounded-full bg-gradient-to-br from-orange-100 to-white flex items-center justify-center shadow-inner mb-2 group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-3xl text-primary">soup_kitchen</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#111716] mb-2">I am a Mess Owner</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Manage your menu, track orders, and grow your tiffin business.
                                        </p>
                                    </div>
                                    <div className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity duration-300">
                                        <div className="size-5 rounded-full bg-primary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-[14px]">check</span>
                                        </div>
                                    </div>
                                </div>
                            </label>

                        </div>

                        <button
                            onClick={handleContinue}
                            disabled={!selectedRole}
                            className={`w-full bg-gradient-to-r from-primary to-orange-600 text-white text-base font-bold py-4 rounded-xl shadow-glow transition-all duration-300 ${selectedRole
                                ? 'hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 opacity-100 cursor-pointer'
                                : 'opacity-50 cursor-not-allowed grayscale'
                                }`}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </main>

            {/* Simplified Footer matching RolePage layout */}
            <footer className="relative z-10 w-full py-6 text-center">
                <p className="text-xs text-gray-500 font-medium">© 2024 Smart Tiffin. Designed with <span className="text-red-500">♥</span> for better food.</p>
            </footer>
        </div>
    );
};

export default RoleSelection;

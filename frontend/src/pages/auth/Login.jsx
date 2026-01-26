import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {
    const navigate = useNavigate();

    // UI Loading State
    const [isLoading, setIsLoading] = useState(false);

    // Form Input State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { value, type } = e.target;
        const id = e.target.id || e.target.name; // Handle both id and name
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        // Simulate API
        const loginPromise = new Promise(resolve => setTimeout(resolve, 1500));

        await toast.promise(loginPromise, {
            loading: 'Logging in...',
            success: 'Welcome back!',
            error: 'Login failed',
        });

        setIsLoading(false);
        console.log("Logged in with:", formData);
        navigate('/customer/dashboard');
    };

    return (
        <div className="relative flex flex-col items-center min-h-screen text-[#2D241E] bg-[#FFFBF5] overflow-x-hidden selection:bg-primary/20 selection:text-primary">

            {/* Background Blobs (Unified) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="blob blob-1 blob-primary"></div>
                <div className="blob blob-2 blob-secondary"></div>
            </div>

            {/* Header */}
            <header className="w-full max-w-7xl px-6 py-6 flex justify-between items-center z-50">
                <Link to="/" className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-orange-300 flex items-center justify-center text-white shadow-md">
                        <span className="material-symbols-outlined text-[18px]">lunch_dining</span>
                    </div>
                    <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#2D241E] to-primary">Smart Tiffin</span>
                </Link>
                <div className="hidden sm:block">
                    <span className="text-xs text-[#5C4D42]/80 font-medium">Don't have an account?</span>
                    <Link to="/role-selection" className="ml-2 text-xs font-bold text-primary hover:text-[#e04112] transition-colors">Register</Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full flex justify-center items-start pt-4 pb-12 px-4 z-10 flex-grow">
                <div className="glass-panel w-full max-w-lg rounded-[2rem] p-6 md:p-8 bg-white/60 backdrop-blur-xl border border-white/70 shadow-2xl shadow-primary/5 mx-auto">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-black text-[#2D241E] mb-1">Welcome Back</h1>
                        <p className="text-xs text-[#2D241E]/60 font-bold uppercase tracking-wider">Login to your Smart Tiffin account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative flex flex-col">
                            <span className="material-symbols-outlined absolute left-4 top-4 text-[#2D241E]/40 text-[20px]">alternate_email</span>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white/40 border border-white/50 rounded-2xl pl-11 pr-4 py-3.5 outline-none transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:bg-white/60 font-medium placeholder:text-gray-400"
                                placeholder="Email Address"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="relative flex flex-col">
                                <span className="material-symbols-outlined absolute left-4 top-4 text-[#2D241E]/40 text-[20px]">lock</span>
                                <input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-white/40 border border-white/50 rounded-2xl pl-11 pr-4 py-3.5 outline-none transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:bg-white/60 font-medium placeholder:text-gray-400"
                                    placeholder="Password"
                                />
                            </div>
                            <div className="flex justify-end px-1">
                                <Link to="#" className="text-sm font-bold text-primary hover:text-[#e04112] transition-colors">Forgot Password?</Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-primary to-orange-500 hover:to-orange-600 text-white font-extrabold py-4 rounded-xl shadow-[0_10px_20px_-5px_rgba(255,87,36,0.4)] transition-all hover:scale-[1.01] active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Logging In...' : 'Login'}
                        </button>

                        <div className="relative py-4 flex items-center">
                            <div className="flex-grow border-t border-[#2D241E]/10"></div>
                            <span className="flex-shrink mx-4 text-xs font-bold text-[#2D241E]/40 uppercase tracking-widest">Or login with</span>
                            <div className="flex-grow border-t border-[#2D241E]/10"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="flex items-center justify-center gap-3 py-3 bg-white/40 hover:bg-white/60 border border-white/50 rounded-2xl transition-all shadow-sm hover:shadow-md">
                                <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsnS2Q9jote0zTwDBTaQW3-Hp5bXCKiqORGLI3HeWG8NeLc_Bk7tzlpIGqszu3aof4jHImylcUjk7M-auzE2VsRbeCdbzdrs36_aEbCWMRjFREwfHFwbokCBt5UjzdeGrZnVyLe4ghM54i7uerahR4tepsHNH-4SXUvqm0hveFxnfvDF4JzxUjFasRYHHtn10Wgqb3paugB76O__RPwerL9bgxXfZgn83KSyzxkrgGg_o1Wn1e4ZFaacjEtuRAm_J2uSIXCSMa" />
                                <span className="text-sm font-bold text-[#2D241E]">Google</span>
                            </button>
                            <button type="button" className="flex items-center justify-center gap-3 py-3 bg-white/40 hover:bg-white/60 border border-white/50 rounded-2xl transition-all shadow-sm hover:shadow-md">
                                <img alt="Apple" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC_GuhkVOHy_E4cGw5zY6R-ALLVj0OOOOPafEdFrLH-7UakSdUPJ6kqbm0k9NWvEXX7muPBNXxY4awL6DcSwiZTfZDRe_uE1RwHl6n1C2iFHimWjexrmFMHvgi5pERv7nJGKJJVIt9BcacNvNT1GrgThYdWFVlR4mn6rgGXJTbicYN7PGTCOFJNH4BwJ0bWuQqBdjHw7s4NTMQv8-GZ8IThDvzsezlaAIn8T3-izlPHWw3qPeqcVDERXrlxWQKY5Y6L3C2B4w1" />
                                <span className="text-sm font-bold text-[#2D241E]">Apple</span>
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto py-8 text-center text-[#2D241E]/40 text-xs font-medium w-full relative z-10">
                <p>© 2024 Smart Tiffin Technology. All rights reserved.</p>
                <div className="flex justify-center gap-6 mt-3">
                    <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
                    <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
                    <Link to="#" className="hover:text-primary transition-colors">Support</Link>
                </div>
            </footer>
        </div>
    );
}

export default Login;

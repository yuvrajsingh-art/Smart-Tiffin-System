import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/UserContext';
import Logo from '../../components/common/Logo';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form Input State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Field change par error clear kardein
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const role = await login(formData.email, formData.password);

            if (role === 'admin') navigate('/admin/dashboard');
            else if (role === 'provider') navigate('/provider/dashboard');
            else navigate('/customer/dashboard');

        } catch (error) {
            console.error("Login component error:", error);
            if (error.response) {
                if (error.response.status === 401) {
                    setErrors({ general: "Invalid email or password. Please try again." });
                    toast.error("Authentication Failed");
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col items-center min-h-screen text-[#2D241E] bg-[#FFFBF5] overflow-x-hidden selection:bg-primary/20 selection:text-primary font-outfit">

            {/* Background Blobs (Unified) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="blob blob-1 blob-primary"></div>
                <div className="blob blob-2 blob-secondary"></div>
            </div>

            {/* Header */}
            <header className="w-full max-w-7xl px-6 py-6 flex justify-between items-center z-50">
                <Logo />
                <div className="hidden sm:block">
                    <span className="text-sm text-[#5C4D42]/80 font-medium">Don't have an account?</span>
                    <Link to="/role-selection" className="ml-2 text-sm font-bold text-primary hover:text-orange-600 transition-colors">Register</Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full flex justify-center items-center pt-4 pb-12 px-4 z-10 flex-grow">
                <div className="glass-panel w-full max-w-md rounded-[2.5rem] p-8 md:p-10 bg-white/70 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-primary/5 mx-auto">
                    <div className="mb-10 text-center">
                        <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                            <span className="material-symbols-outlined text-4xl">lock_open</span>
                        </div>
                        <h1 className="text-3xl font-black text-[#2D241E] mb-2">Welcome Back!</h1>
                        <p className="text-sm text-[#2D241E]/60 font-medium">Login to manage your Smart Tiffin experience</p>

                        {errors.general && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-500 animate-in fade-in slide-in-from-top-2">
                                {errors.general}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#5C4D42] ml-1">Email Address</label>
                            <div className={`relative flex flex-col group transition-all ${errors.email ? 'scale-[1.01]' : ''}`}>
                                <span className={`material-symbols-outlined absolute left-4 top-4 transition-colors ${errors.email ? 'text-red-500' : 'text-[#2D241E]/40 group-focus-within:text-primary'}`}>alternate_email</span>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full bg-white/50 border ${errors.email ? 'border-red-300 bg-red-50/30' : 'border-white group-focus-within:border-primary/30'} rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/5 font-medium placeholder:text-gray-400`}
                                    placeholder="name@example.com"
                                />
                                {errors.email && <span className="text-[10px] font-bold text-red-500 mt-1 ml-4 uppercase tracking-wider animate-in fade-in slide-in-from-top-1">{errors.email}</span>}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-bold text-[#5C4D42]">Password</label>
                                <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-orange-600 transition-colors">Forgot?</Link>
                            </div>
                            <div className={`relative flex flex-col group transition-all ${errors.password ? 'scale-[1.01]' : ''}`}>
                                <span className={`material-symbols-outlined absolute left-4 top-4 transition-colors ${errors.password ? 'text-red-500' : 'text-[#2D241E]/40 group-focus-within:text-primary'}`}>lock</span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full bg-white/50 border ${errors.password ? 'border-red-300 bg-red-50/30' : 'border-white group-focus-within:border-primary/30'} rounded-2xl pl-12 pr-12 py-3.5 outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/5 font-medium placeholder:text-gray-400`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-4 text-[#2D241E]/40 hover:text-primary transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                                {errors.password && <span className="text-[10px] font-bold text-red-500 mt-1 ml-4 uppercase tracking-wider animate-in fade-in slide-in-from-top-1">{errors.password}</span>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-gradient-to-r from-primary to-orange-500 hover:to-orange-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>Login </span>
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            )}
                        </button>

                        <div className="relative py-4 flex items-center">
                            <div className="flex-grow border-t border-[#2D241E]/5"></div>
                            <span className="flex-shrink mx-4 text-[10px] font-black text-[#2D241E]/30 uppercase tracking-[0.2em]">Or continue with</span>
                            <div className="flex-grow border-t border-[#2D241E]/5"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="flex items-center justify-center gap-3 py-3 bg-white/50 hover:bg-white border border-white hover:border-gray-200 rounded-2xl transition-all shadow-sm active:scale-95 group">
                                <img alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsnS2Q9jote0zTwDBTaQW3-Hp5bXCKiqORGLI3HeWG8NeLc_Bk7tzlpIGqszu3aof4jHImylcUjk7M-auzE2VsRbeCdbzdrs36_aEbCWMRjFREwfHFwbokCBt5UjzdeGrZnVyLe4ghM54i7uerahR4tepsHNH-4SXUvqm0hveFxnfvDF4JzxUjFasRYHHtn10Wgqb3paugB76O__RPwerL9bgxXfZgn83KSyzxkrgGg_o1Wn1e4ZFaacjEtuRAm_J2uSIXCSMa" />
                                <span className="text-sm font-bold text-[#2D241E]">Google</span>
                            </button>
                            <button type="button" className="flex items-center justify-center gap-3 py-3 bg-white/50 hover:bg-white border border-white hover:border-gray-200 rounded-2xl transition-all shadow-sm active:scale-95 group">
                                <img alt="Apple" className="w-5 h-5 group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC_GuhkVOHy_E4cGw5zY6R-ALLVj0OOOOPafEdFrLH-7UakSdUPJ6kqbm0k9NWvEXX7muPBNXxY4awL6DcSwiZTfZDRe_uE1RwHl6n1C2iFHimWjexrmFMHvgi5pERv7nJGKJJVIt9BcacNvNT1GrgThYdWFVlR4mn6rgGXJTbicYN7PGTCOFJNH4BwJ0bWuQqBdjHw7s4NTMQv8-GZ8IThDvzsezlaAIn8T3-izlPHWw3qPeqcVDERXrlxWQKY5Y6L3C2B4w1" />
                                <span className="text-sm font-bold text-[#2D241E]">Apple</span>
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-[#2D241E]/40 text-[10px] font-bold uppercase tracking-widest w-full relative z-10">
                <p>© 2024 Smart Tiffin System. All rights reserved.</p>
                <div className="flex justify-center gap-8 mt-4 text-[#2D241E]/60">
                    <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
                    <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
                    <Link to="#" className="hover:text-primary transition-colors">Support</Link>
                </div>
            </footer>
        </div>
    );
}

export default Login;

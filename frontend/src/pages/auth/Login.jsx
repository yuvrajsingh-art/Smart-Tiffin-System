import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
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

    // Validation Errors
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

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

        // Redirect
        navigate('/customer/dashboard');
    };

    return (
        <div className="relative flex flex-col items-center min-h-screen text-[#2D241E] bg-[#FFFBF5] overflow-x-hidden">

            {/* Background Blobs (Exact Match with Role/Register Page) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#ffe0d6] rounded-full blur-[80px] opacity-60"></div>
                <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#ffe8cc] rounded-full blur-[80px] opacity-60"></div>
            </div>

            {/* Header */}
            <header className="w-full max-w-6xl px-6 py-6 flex justify-between items-center z-50">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-orange-300 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[18px]">lunch_dining</span>
                    </div>
                    <span className="text-base font-black text-[#2D241E] tracking-tight">Smart Tiffin</span>
                </Link>
                <div className="hidden sm:block">
                    <span className="text-xs text-[#5C4D42]/80 font-medium">New here?</span>
                    <Link to="/role-selection" className="ml-2 text-xs font-bold text-primary hover:text-[#e04112] transition-colors">Create Account</Link>
                </div>
            </header>

            {/* Main Form Container - Compact & Responsive */}
            <main className="w-full flex justify-center items-start pt-8 pb-12 px-4 z-10 flex-grow">
                <div className="glass-panel w-full max-w-lg rounded-[2rem] p-6 md:p-8 bg-white/60 backdrop-blur-xl border border-white/70 shadow-2xl shadow-primary/5 mx-auto">

                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-black text-[#2D241E] mb-1">Welcome Back!</h1>
                        <p className="text-xs text-[#2D241E]/60 font-bold uppercase tracking-wider">Login to manage your meals</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="space-y-4">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">alternate_email</span>
                                <input
                                    id="email"
                                    type="email"
                                    className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 h-11 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="text-[10px] text-red-500 font-bold ml-2 mt-1">{errors.email}</p>}
                            </div>

                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">lock</span>
                                <input
                                    id="password"
                                    type="password"
                                    className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 h-11 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {errors.password && <p className="text-[10px] text-red-500 font-bold ml-2 mt-1">{errors.password}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-[11px] font-bold text-primary hover:text-orange-700 hover:underline transition-colors">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#111716] hover:bg-black text-white font-bold h-12 rounded-xl shadow-lg shadow-black/10 transition-all hover:scale-[1.01] active:scale-[0.98] mt-2 text-sm flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                            ) : (
                                <>
                                    Login <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Social Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200/50">
                        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Or continue with</p>
                        <div className="flex justify-center gap-4">
                            <button className="size-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsnS2Q9jote0zTwDBTaQW3-Hp5bXCKiqORGLI3HeWG8NeLc_Bk7tzlpIGqszu3aof4jHImylcUjk7M-auzE2VsRbeCdbzdrs36_aEbCWMRjFREwfHFwbokCBt5UjzdeGrZnVyLe4ghM54i7uerahR4tepsHNH-4SXUvqm0hveFxnfvDF4JzxUjFasRYHHtn10Wgqb3paugB76O__RPwerL9bgxXfZgn83KSyzxkrgGg_o1Wn1e4ZFaacjEtuRAm_J2uSIXCSMa" alt="G" className="w-5 h-5" />
                            </button>
                            <button className="size-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC_GuhkVOHy_E4cGw5zY6R-ALLVj0OOOOPafEdFrLH-7UakSdUPJ6kqbm0k9NWvEXX7muPBNXxY4awL6DcSwiZTfZDRe_uE1RwHl6n1C2iFHimWjexrmFMHvgi5pERv7nJGKJJVIt9BcacNvNT1GrgThYdWFVlR4mn6rgGXJTbicYN7PGTCOFJNH4BwJ0bWuQqBdjHw7s4NTMQv8-GZ8IThDvzsezlaAIn8T3-izlPHWw3qPeqcVDERXrlxWQKY5Y6L3C2B4w1" alt="A" className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="py-6 text-center text-[#2D241E]/30 text-[10px] font-bold w-full relative z-10 uppercase tracking-widest">
                © 2024 Smart Tiffin System
            </footer>
        </div>
    );
}

export default Login;

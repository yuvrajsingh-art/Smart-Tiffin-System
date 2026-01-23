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
        rememberMe: false
    });

    // Validation Errors
    const [errors, setErrors] = useState({});

    /**
     * Handles changes in input fields
     */
    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    /**
     * Validates email and password requirements
     * Returns true if valid, false otherwise.
     */
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

    /**
     * Handles form submission and login logic.
     * Uses toast.promise for better UX.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setIsLoading(true);

        const loginPromise = new Promise(resolve => setTimeout(resolve, 2000));

        await toast.promise(loginPromise, {
            loading: 'Logging in...',
            success: 'Welcome back!',
            error: 'Login failed',
        });

        setIsLoading(false);
        console.log("Logged in with:", formData);

        // Mock Redirect
        navigate('/customer/dashboard');
    };

    return (
        <div className="font-display mesh-gradient text-[#111716] overflow-x-hidden min-h-screen relative flex flex-col selection:bg-primary/20 selection:text-primary">
            {/* Detailed Background from Zip */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob w-[800px] h-[800px] bg-orange-200/40 -top-40 -left-20"></div>
                <div className="blob w-[700px] h-[700px] bg-amber-100/40 top-1/4 right-0"></div>
                <div className="blob w-[900px] h-[900px] bg-orange-100/30 bottom-0 left-1/4"></div>
            </div>

            <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                        <div className="size-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-[24px]">lunch_dining</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-[#111716] group-hover:text-primary transition-colors font-display">Smart Tiffin</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:block text-sm text-[#6A717B] font-medium">Don't have an account?</span>
                        <Link to="/register" className="text-sm font-bold text-primary hover:text-orange-700 transition-colors">Sign Up</Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-32">
                <div className="w-full max-w-[480px] perspective-1000">
                    <div className="glass-panel rounded-[2rem] p-8 md:p-10 relative overflow-hidden transition-all duration-500 hover:shadow-glass-hover animate-[fadeIn_0.5s_ease-out]">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-extrabold text-[#111716] tracking-tight mb-2">Welcome Back!</h1>
                            <p className="text-[#6A717B] text-sm">Login to continue managing your daily meals</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <Input
                                id="email"
                                // Remove label for cleaner look as per design, using placeholder
                                type="email"
                                placeholder="Email Address"
                                icon="mail"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                variant="glass"
                                className="!bg-transparent"
                            />

                            <div className="flex flex-col gap-2">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter Password"
                                    icon="lock"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    variant="glass"
                                    className="!bg-transparent"
                                />
                                <div className="flex justify-end">
                                    <a href="#" className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors">Forgot Password?</a>
                                </div>
                            </div>

                            <button type="button" className="group flex items-center gap-3 w-full px-2 py-1 text-left rounded-xl transition-all duration-300 hover:bg-white/30">
                                <div className="size-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-red-500 text-[18px]">my_location</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[#111716] group-hover:text-primary transition-colors">Use My Current Location</span>
                                    <span className="text-[10px] text-gray-400">Enable GPS for better delivery accuracy</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-400 text-[16px] ml-auto group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </button>

                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="mt-2 w-full bg-gradient-to-r from-primary to-orange-600 text-white text-base font-bold py-4 rounded-xl shadow-glow hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 border-none"
                            >
                                Login
                            </Button>
                        </form>

                        <div className="relative py-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300/50"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-transparent text-gray-500 text-xs uppercase tracking-wide backdrop-blur-sm rounded">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 bg-white/60 hover:bg-white/90 border border-white/60 hover:border-white shadow-sm hover:shadow-md py-3 rounded-xl transition-all duration-300 group">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                <span className="text-sm font-semibold text-[#111716] group-hover:text-black">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-white/60 hover:bg-white/90 border border-white/60 hover:border-white shadow-sm hover:shadow-md py-3 rounded-xl transition-all duration-300 group">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.36-.16-.7-.28-1.02-.28-.31 0-.64.12-1.01.29-1.04.47-2.11.53-3.11-.42-1.63-1.57-2.82-4.39-1.18-7.07.82-1.34 2.18-2.15 3.59-2.15.29 0 .61.04.97.13.56.16 1.04.53 1.45.53.46 0 .98-.44 1.64-.62.33-.08.6-.12.82-.12 1.54 0 2.8.76 3.52 1.84-.06.04-.58.33-.58.33-1.4 1.06-1.17 3.39.26 4.39.04.03.09.06.13.08-.29.88-.63 1.74-1.13 2.25-.33.36-.66.69-1.02 1.05l-.25-.23zM12.03 7.25c-.14-2.22 1.69-4.14 3.86-4.25.13 2.37-1.95 4.34-3.86 4.25z"></path>
                                </svg>
                                <span className="text-sm font-semibold text-[#111716] group-hover:text-black">Apple</span>
                            </button>
                        </div>

                        <p className="mt-8 text-center text-[11px] text-gray-500 leading-tight">
                            By logging in, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </main>

            <footer className="relative z-10 w-full py-6 text-center">
                <p className="text-xs text-gray-500 font-medium">© 2024 Smart Tiffin. Designed with <span className="text-red-500">♥</span> for better food.</p>
            </footer>
        </div>
    )
}

export default Login;

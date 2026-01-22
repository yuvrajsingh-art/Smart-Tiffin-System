import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

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
        <div className="font-display mesh-gradient text-[#2D241E] overflow-x-hidden min-h-screen relative flex flex-col selection:bg-primary/20 selection:text-primary">
            {/* Detailed Background from Zip */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob w-[800px] h-[800px] bg-orange-200/40 -top-40 -left-20"></div>
                <div className="blob w-[700px] h-[700px] bg-amber-100/40 top-1/4 right-0"></div>
                <div className="blob w-[900px] h-[900px] bg-orange-100/30 bottom-0 left-1/4"></div>
            </div>

            <Header />

            <main className="flex-grow flex items-center justify-center relative z-10 py-24 px-4">
                <div className="w-full max-w-[380px] md:max-w-md relative">

                    <div className="glass-panel p-8 md:p-10 rounded-3xl w-full animate-[fadeIn_0.5s_ease-out] border border-orange-100/50 shadow-xl">
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 shadow-sm">
                                <span className="material-symbols-outlined text-2xl">account_circle</span>
                            </div>
                            <h1 className="text-2xl font-black text-[#2D241E] mb-2 tracking-tight">Welcome Back</h1>
                            <p className="text-sm text-[#5C4D42] font-medium">Enter your credentials to access your account.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <Input
                                id="email"
                                label="Email Address"
                                type="email"
                                placeholder="student@example.com"
                                icon="mail"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />

                            <div>
                                <Input
                                    id="password"
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    icon="lock"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                />
                                <div className="flex justify-between items-center mt-3">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                id="rememberMe"
                                                checked={formData.rememberMe}
                                                onChange={handleChange}
                                                className="peer sr-only"
                                            />
                                            <div className="w-4 h-4 border-2 border-gray-300 rounded transition-colors peer-checked:bg-primary peer-checked:border-primary peer-focus:ring-2 peer-focus:ring-primary/20"></div>
                                            <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                                                <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                                            </span>
                                        </div>
                                        <span className="text-xs font-bold text-[#5C4D42] group-hover:text-primary transition-colors">Remember me</span>
                                    </label>
                                    <a href="#" className="text-xs font-bold text-primary hover:text-orange-600 transition-colors">Forgot Password?</a>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="mt-2 w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:scale-[1.02] shadow-lg shadow-primary/25 transition-all"
                            >
                                Sign In
                            </Button>
                        </form>

                        {/* Social Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase">
                                <span className="bg-[#FFFBF5] px-3 text-gray-400 font-bold tracking-widest">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="text-sm font-bold border-gray-200 hover:bg-white text-[#2D241E] !py-3">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
                                Google
                            </Button>
                            <Button variant="outline" className="text-sm font-bold border-gray-200 hover:bg-white text-[#2D241E] !py-3">
                                <img src="https://www.svgrepo.com/show/452286/microsoft-official.svg" alt="Microsoft" className="w-5 h-5 mr-2" />
                                Microsoft
                            </Button>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-[#5C4D42] font-medium">
                                Don't have an account? {' '}
                                <Link to="/register" className="font-extrabold text-primary hover:text-orange-600 transition-colors">Sign up now</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Login;

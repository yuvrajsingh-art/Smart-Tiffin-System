import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

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
     * Currently mimics an API call with setTimeout.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // Simulate API Call (Replace with axios.post in future)
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsLoading(false);
        // Navigate or show success (For now, just log)
        console.log("Logged in with:", formData);

        // Redirect to Dashboard (Assuming successful login)
        navigate('/student/dashboard');
    };

    return (
        <div className="font-display bg-white min-h-screen relative flex items-center justify-center overflow-x-hidden overflow-y-auto tracking-tight antialiased selection:bg-primary/10 selection:text-primary py-10 px-4">
            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob w-[300px] h-[300px] md:w-[900px] md:h-[900px] bg-orange-200/20 -top-[10%] -left-[10%] mix-blend-multiply opacity-50 blur-[80px] md:blur-[100px]"></div>
                <div className="blob w-[300px] h-[300px] md:w-[700px] md:h-[700px] bg-rose-200/20 top-1/4 right-0 mix-blend-multiply opacity-50 blur-[80px] md:blur-[90px]"></div>
                <div className="blob w-[300px] h-[300px] md:w-[900px] md:h-[900px] bg-amber-100/30 bottom-0 left-1/4 mix-blend-multiply opacity-60 blur-[80px] md:blur-[100px]"></div>
            </div>

            <div className="w-full max-w-[340px] md:max-w-sm relative z-10 mx-auto">
                {/* Back Link */}
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary mb-4 transition-colors group">
                    <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Back to Home
                </Link>

                <div className="glass-panel p-6 rounded-3xl w-full animate-[fadeIn_0.5s_ease-out]">
                    <div className="text-center mb-5">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-2">
                            <span className="material-symbols-outlined text-xl">account_circle</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 mb-0.5">Welcome Back</h1>
                        <p className="text-xs text-gray-500">Enter your credentials to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
                            <div className="flex justify-between items-center mt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            id="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                            className="peer sr-only"
                                        />
                                        <div className="w-3.5 h-3.5 border-2 border-gray-300 rounded transition-colors peer-checked:bg-primary peer-checked:border-primary peer-focus:ring-2 peer-focus:ring-primary/20"></div>
                                        <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                                            <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                                        </span>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
                                </label>
                                <a href="#" className="text-xs font-bold text-primary hover:text-orange-600 transition-colors">Forgot?</a>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="mt-1"
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Social Divider */}
                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase">
                            <span className="bg-white px-2 text-gray-400 font-bold tracking-wider">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="text-sm font-semibold !py-2.5">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Google
                        </Button>
                        <Button variant="outline" className="text-sm font-semibold !py-2.5">
                            <img src="https://www.svgrepo.com/show/452286/microsoft-official.svg" alt="Microsoft" className="w-5 h-5" />
                            Microsoft
                        </Button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account? {' '}
                            <Link to="/register" className="font-bold text-primary hover:text-orange-600 transition-colors">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;

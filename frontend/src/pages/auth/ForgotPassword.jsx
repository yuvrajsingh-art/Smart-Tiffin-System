import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Logo from '../../components/common/Logo';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post('/api/auth/forgot-password', { email });

            if (data.success) {
                // ⚠️ DEMO: Showing OTP in Toast as requested
                toast.success(`OTP Sent! Your code is: ${data.otp}`, {
                    duration: 10000,
                    icon: '🔐',
                    style: {
                        background: '#2D241E',
                        color: '#fff',
                        fontWeight: 'bold'
                    }
                });

                // Navigate to Reset Password page
                navigate('/reset-password');
            }
        } catch (error) {
            console.error("Forgot Password Error:", error);
            const msg = error.response?.data?.message || "Failed to send OTP";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col items-center min-h-screen text-[#2D241E] bg-[#FFFBF5] overflow-x-hidden font-outfit">

            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="blob blob-1 blob-primary opacity-50"></div>
                <div className="blob blob-2 blob-secondary opacity-50"></div>
            </div>

            {/* Header */}
            <header className="w-full max-w-7xl px-6 py-6 flex justify-between items-center z-50">
                <Logo />
                <Link to="/login" className="text-sm font-bold text-primary hover:text-orange-600 transition-colors">
                    Back to Login
                </Link>
            </header>

            {/* Main Content */}
            <main className="w-full flex justify-center items-center pt-10 pb-12 px-4 z-10 flex-grow">
                <div className="glass-panel w-full max-w-md rounded-[2.5rem] p-8 md:p-10 bg-white/70 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-primary/5 mx-auto">

                    <div className="mb-8 text-center">
                        <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                            <span className="material-symbols-outlined text-4xl">lock_reset</span>
                        </div>
                        <h1 className="text-2xl font-black text-[#2D241E] mb-2">Forgot Password?</h1>
                        <p className="text-sm text-[#2D241E]/60 font-medium">
                            Enter your email to receive a customized OTP for password reset.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#5C4D42] ml-1">Email Address</label>
                            <div className="relative flex flex-col group">
                                <span className="material-symbols-outlined absolute left-4 top-4 text-[#2D241E]/40 group-focus-within:text-primary transition-colors">mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/50 border border-white group-focus-within:border-primary/30 rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all duration-300 focus:ring-4 focus:ring-primary/5 font-medium placeholder:text-gray-400"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-gradient-to-r from-primary to-orange-500 hover:to-orange-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Sending...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>Get OTP</span>
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;

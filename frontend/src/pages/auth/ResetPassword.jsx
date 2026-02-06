import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Logo from '../../components/common/Logo';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        otp: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.otp || !formData.password || !formData.confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post('/api/auth/reset-password', formData);

            if (data.success) {
                toast.success(data.message);
                navigate('/login');
            }
        } catch (error) {
            console.error("Reset Password Error:", error);
            const msg = error.response?.data?.message || "Failed to reset password";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col items-center min-h-screen text-[#2D241E] bg-[#FFFBF5] overflow-x-hidden font-outfit">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="blob blob-1 blob-primary opacity-50"></div>
                <div className="blob blob-2 blob-secondary opacity-50"></div>
            </div>

            <header className="w-full max-w-7xl px-6 py-6 flex justify-between items-center z-50">
                <Logo />
            </header>

            <main className="w-full flex justify-center items-center pt-10 pb-12 px-4 z-10 flex-grow">
                <div className="glass-panel w-full max-w-md rounded-[2.5rem] p-8 md:p-10 bg-white/70 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-primary/5 mx-auto">

                    <div className="mb-8 text-center">
                        <div className="size-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
                            <span className="material-symbols-outlined text-4xl">key</span>
                        </div>
                        <h1 className="text-2xl font-black text-[#2D241E] mb-2">Reset Password</h1>
                        <p className="text-sm text-[#2D241E]/60 font-medium">
                            Enter the OTP from the notification and your new password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#5C4D42] ml-1">OTP Code</label>
                            <input
                                id="otp"
                                type="text"
                                value={formData.otp}
                                onChange={handleChange}
                                className="w-full bg-white/50 border border-white focus:border-primary/30 rounded-2xl px-4 py-3.5 outline-none transition-all font-medium text-center tracking-widest text-lg"
                                placeholder="123456"
                                maxLength={6}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#5C4D42] ml-1">New Password</label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white/50 border border-white focus:border-primary/30 rounded-2xl px-4 py-3.5 outline-none transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-[#5C4D42] ml-1">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-white/50 border border-white focus:border-primary/30 rounded-2xl px-4 py-3.5 outline-none transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-gradient-to-r from-primary to-orange-500 hover:to-orange-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ResetPassword;

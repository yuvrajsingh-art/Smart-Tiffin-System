import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const Profile = () => {
    // Mock user data
    const [user, setUser] = useState({
        name: 'Rohan Das',
        email: 'rohan.das@college.edu',
        phone: '+91 98765 43210',
        address: 'Room 304, Boys Hostel Block A, Fergusson College Road, Pune',
        diet: 'Pure Veg',
        memberSince: 'Oct 2025'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const stats = [
        { label: 'Member Since', value: user.memberSince, icon: 'calendar_month' },
        { label: 'Total Spent', value: '₹4,250', icon: 'payments', color: 'text-primary' },
        { label: 'Loyalty Level', value: 'Silver', icon: 'military_tech', color: 'text-orange-500' },
    ];

    const handleSave = () => {
        setIsEditing(false);
        setShowSuccessModal(true);
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">

            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="blob blob-1 blob-primary opacity-30 scale-75"></div>
                <div className="blob blob-2 blob-secondary opacity-30 scale-75"></div>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-1 mb-8 pt-4">
                <Link to="/customer/dashboard" className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1 w-fit transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-black text-[#2D241E]">My Profile</h1>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-panel p-5 rounded-2xl border border-white/60 flex items-center gap-4 hover:translate-y-[-2px] transition-all cursor-default text-left">
                        <div className="size-12 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">{stat.label}</p>
                            <p className={`text-xl font-black ${stat.color || 'text-[#2D241E]'}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left: Avatar Card */}
                <div className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-8">
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-white/60 flex flex-col items-center text-center relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-orange-100/50 to-transparent"></div>

                        <div className="relative z-10 w-32 h-32 rounded-full p-1 bg-white shadow-xl mb-4 group cursor-pointer">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-4 border-orange-50 group-hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <span className="material-symbols-outlined text-white text-3xl drop-shadow-md">photo_camera</span>
                            </div>
                            <button className="absolute bottom-0 right-0 size-10 bg-[#2D241E] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg border-4 border-white z-30">
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                        </div>

                        <h2 className="text-2xl font-black text-[#2D241E] mb-1">{user.name}</h2>
                        <p className="text-xs font-bold text-primary opacity-60 uppercase tracking-widest mb-6">Student ID: #ST-ROH882</p>

                        <div className="flex gap-2 w-full">
                            <div className="flex-1 bg-green-50 rounded-xl p-3 border border-green-100 text-left">
                                <span className="block text-[8px] font-black text-green-700 uppercase tracking-widest mb-1">Status</span>
                                <span className="font-black text-[#2D241E] text-sm flex items-center gap-1">
                                    <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Active
                                </span>
                            </div>
                            <div className="flex-1 bg-orange-50 rounded-xl p-3 border border-orange-100 text-left">
                                <span className="block text-[8px] font-black text-orange-700 uppercase tracking-widest mb-1">Diet</span>
                                <span className="font-black text-[#2D241E] text-sm">{user.diet}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Menu */}
                    <div className="glass-panel p-6 rounded-[2rem] border border-white/60 space-y-4">
                        <Link to="/customer/wallet" className="w-full flex items-center justify-between p-3 hover:bg-white/50 rounded-xl transition-colors group">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">account_balance_wallet</span>
                                <span className="font-bold text-[#2D241E] text-sm">Wallet Settings</span>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 text-sm">arrow_forward_ios</span>
                        </Link>
                        <button className="w-full flex items-center justify-between p-3 hover:bg-white/50 rounded-xl transition-colors group">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">shield</span>
                                <span className="font-bold text-[#2D241E] text-sm">Security & Privacy</span>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 text-sm">arrow_forward_ios</span>
                        </button>
                        <button className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-xl transition-colors group">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-300 group-hover:text-red-500">logout</span>
                                <span className="font-bold text-red-500 text-sm">Log Out Account</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Right: Details Form */}
                <div className="flex-1 w-full glass-panel p-8 sm:p-10 rounded-[2.5rem] border border-white/60 relative shadow-xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h3 className="text-xl font-black text-[#2D241E]">Personal Information</h3>
                            <p className="text-xs font-medium text-gray-400">Update your delivery and contact details</p>
                        </div>
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={`px-6 py-2.5 rounded-full font-black text-xs transition-all uppercase tracking-widest ${isEditing
                                    ? 'bg-primary text-white shadow-lg shadow-orange-500/20'
                                    : 'bg-[#2D241E] text-white hover:bg-black'
                                }`}
                        >
                            {isEditing ? 'Save Profile' : 'Edit Details'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                            <input
                                type="text"
                                value={user.name}
                                disabled={!isEditing}
                                onChange={e => setUser({ ...user, name: e.target.value })}
                                className="w-full bg-white/40 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-5 py-4 font-bold text-[#2D241E] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                            <input
                                type="text"
                                value={user.phone}
                                disabled={!isEditing}
                                onChange={e => setUser({ ...user, phone: e.target.value })}
                                className="w-full bg-white/40 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-5 py-4 font-bold text-[#2D241E] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-300"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled={!isEditing}
                                onChange={e => setUser({ ...user, email: e.target.value })}
                                className="w-full bg-white/40 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-5 py-4 font-bold text-[#2D241E] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-300"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Delivery Address</label>
                            <textarea
                                value={user.address}
                                disabled={!isEditing}
                                onChange={e => setUser({ ...user, address: e.target.value })}
                                rows="3"
                                className="w-full bg-white/40 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-5 py-4 font-bold text-[#2D241E] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed resize-none placeholder:text-gray-300"
                                placeholder="House no, Street Name, Area..."
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2 mt-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Food Preference</label>
                            <div className="flex gap-4">
                                {['Pure Veg', 'Non-Veg'].map(d => (
                                    <button
                                        key={d}
                                        disabled={!isEditing}
                                        onClick={() => setUser({ ...user, diet: d })}
                                        className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${user.diet === d
                                                ? 'bg-[#2D241E] text-white shadow-xl shadow-black/10'
                                                : 'bg-white/40 text-gray-400 border-2 border-transparent hover:bg-white'
                                            } ${!isEditing && 'cursor-default'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-base">
                                                {d === 'Pure Veg' ? 'psychiatry' : 'lunch_dining'}
                                            </span>
                                            {d}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* Success Modal */}
            {showSuccessModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg animate-[fadeIn_0.3s]" onClick={() => setShowSuccessModal(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl animate-[scaleIn_0.3s] relative overflow-hidden z-10 text-center border border-white/20">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-100 rounded-full blur-[80px] -translate-y-1/2 pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="size-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/30 animate-[bounce_1s_infinite]">
                                <span className="material-symbols-outlined text-4xl text-white font-bold">verified</span>
                            </div>
                            <h3 className="text-2xl font-black text-[#2D241E] mb-2">Profile Updated!</h3>
                            <p className="text-[#5C4D42] text-sm font-medium leading-relaxed mb-8 opacity-80">
                                Your changes have been successfully saved to our servers.
                            </p>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Great, Thanks!
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Profile;

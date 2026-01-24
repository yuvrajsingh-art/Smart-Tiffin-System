import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
    // Mock user data
    const [user, setUser] = useState({
        name: 'Rohan Das',
        email: 'rohan.das@college.edu',
        phone: '+91 98765 43210',
        address: 'Room 304, Boys Hostel Block A, Fergusson College Road, Pune',
        diet: 'Pure Veg'
    });

    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/customer/dashboard" className="size-10 rounded-full bg-white flex items-center justify-center text-[#2D241E] shadow-sm hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-2xl font-black text-[#2D241E]">My Profile</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-8">

                {/* Left: Avatar Card */}
                <div className="md:w-1/3 space-y-6">
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-white/60 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-orange-100/50 to-transparent"></div>

                        <div className="relative z-10 w-32 h-32 rounded-full p-1 bg-white shadow-xl mb-4">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-4 border-orange-50"
                            />
                            <button className="absolute bottom-0 right-0 size-10 bg-[#2D241E] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg border-4 border-white">
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                        </div>

                        <h2 className="text-2xl font-black text-[#2D241E] mb-1">{user.name}</h2>
                        <p className="text-sm font-medium text-[#5C4D42] mb-6">Student • Computer Science</p>

                        <div className="flex gap-2 w-full">
                            <div className="flex-1 bg-green-50 rounded-xl p-3 border border-green-100">
                                <span className="block text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Status</span>
                                <span className="font-black text-[#2D241E]">Active</span>
                            </div>
                            <div className="flex-1 bg-orange-50 rounded-xl p-3 border border-orange-100">
                                <span className="block text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">Plan</span>
                                <span className="font-black text-[#2D241E]">Monthly</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-[2rem] border border-white/60 space-y-4">
                        <button className="w-full flex items-center justify-between p-3 hover:bg-white/50 rounded-xl transition-colors group">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">settings</span>
                                <span className="font-bold text-[#2D241E]">Settings</span>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 text-sm">arrow_forward_ios</span>
                        </button>
                        <button className="w-full flex items-center justify-between p-3 hover:bg-white/50 rounded-xl transition-colors group">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">help</span>
                                <span className="font-bold text-[#2D241E]">Help & Support</span>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 text-sm">arrow_forward_ios</span>
                        </button>
                        <button className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-xl transition-colors group">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-400 group-hover:text-red-500">logout</span>
                                <span className="font-bold text-red-500">Log Out</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Right: Details Form */}
                <div className="flex-1 glass-panel p-8 rounded-[2.5rem] border border-white/60 relative">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-[#2D241E]">Personal Information</h3>
                        <button onClick={() => setIsEditing(!isEditing)} className="text-sm font-bold text-primary hover:underline">
                            {isEditing ? 'Save Changes' : 'Edit Details'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                type="text"
                                value={user.name}
                                disabled={!isEditing}
                                onChange={e => setUser({ ...user, name: e.target.value })}
                                className="w-full bg-white/50 border border-transparent focus:border-orange-200 focus:bg-white rounded-xl px-4 py-3 font-bold text-[#2D241E] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <input
                                type="text"
                                value={user.phone}
                                disabled={!isEditing}
                                onChange={e => setUser({ ...user, phone: e.target.value })}
                                className="w-full bg-white/50 border border-transparent focus:border-orange-200 focus:bg-white rounded-xl px-4 py-3 font-bold text-[#2D241E] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled={!isEditing}
                                onChange={e => setUser({ ...user, email: e.target.value })}
                                className="w-full bg-white/50 border border-transparent focus:border-orange-200 focus:bg-white rounded-xl px-4 py-3 font-bold text-[#2D241E] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Delivery Address</label>
                            <textarea
                                value={user.address}
                                disabled={!isEditing}
                                onChange={e => setUser({ ...user, address: e.target.value })}
                                rows="3"
                                className="w-full bg-white/50 border border-transparent focus:border-orange-200 focus:bg-white rounded-xl px-4 py-3 font-bold text-[#2D241E] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Diet Preference</label>
                            <div className="flex gap-2">
                                {['Pure Veg', 'Non-Veg'].map(d => (
                                    <button
                                        key={d}
                                        disabled={!isEditing}
                                        onClick={() => setUser({ ...user, diet: d })}
                                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${user.diet === d ? 'bg-[#2D241E] text-white shadow-lg' : 'bg-white/50 text-gray-400 hover:bg-white'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;

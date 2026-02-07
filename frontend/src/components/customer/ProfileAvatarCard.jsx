import React from 'react';
import { Link } from 'react-router-dom';

const ProfileAvatarCard = ({ name, id, diet, onLogout, onEditAvatar, profileImage, activeTab, setActiveTab }) => {
    return (
        <div className="w-full lg:w-1/3 space-y-4 lg:sticky lg:top-8">
            <div className="glass-panel p-5 rounded-[2rem] border border-white/60 flex flex-col items-center text-center relative overflow-hidden shadow-lg">
                <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-orange-100/50 to-transparent"></div>

                <div className="relative z-10 w-24 h-24 rounded-full p-1 bg-white shadow-lg mb-3 group cursor-pointer overflow-hidden" onClick={onEditAvatar}>
                    <img
                        src={profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-2 border-orange-50 group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-black/30">
                        <span className="material-symbols-outlined text-white text-2xl drop-shadow-md">edit</span>
                    </div>
                </div>

                <h2 className="text-xl font-black text-[#2D241E] mb-0.5">{name}</h2>
                <p className="text-[10px] font-bold text-primary opacity-60 uppercase tracking-widest mb-4">Student ID: #{id || 'ST-ROH882'}</p>

                <div className="flex gap-2 w-full">
                    <div className="flex-1 bg-green-50 rounded-lg p-2 border border-green-100 text-left">
                        <span className="block text-[8px] font-black text-green-700 uppercase tracking-widest mb-0.5">Status</span>
                        <span className="font-black text-[#2D241E] text-xs flex items-center gap-1">
                            <span className="size-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Active
                        </span>
                    </div>
                    <div className="flex-1 bg-orange-50 rounded-lg p-2 border border-orange-100 text-left">
                        <span className="block text-[8px] font-black text-orange-700 uppercase tracking-widest mb-0.5">Diet</span>
                        <span className="font-black text-[#2D241E] text-xs">{diet}</span>
                    </div>
                </div>
            </div>

            {/* Quick Menu */}
            <div className="glass-panel p-4 rounded-[1.5rem] border border-white/60 space-y-2">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-colors group ${activeTab === 'details' ? 'bg-orange-50/80 shadow-inner' : 'hover:bg-white/50'}`}
                >
                    <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-xl transition-colors ${activeTab === 'details' ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>person</span>
                        <span className={`font-bold text-xs transition-colors ${activeTab === 'details' ? 'text-[#2D241E]' : 'text-[#2D241E]'}`}>Personal Details</span>
                    </div>
                    {activeTab === 'details' && <span className="material-symbols-outlined text-primary text-xs font-black">check</span>}
                </button>

                <Link to="/customer/wallet" className="w-full flex items-center justify-between p-2.5 hover:bg-white/50 rounded-lg transition-colors group text-left">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary text-xl">account_balance_wallet</span>
                        <span className="font-bold text-[#2D241E] text-xs">Wallet Settings</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-300 text-xs text-right">arrow_forward_ios</span>
                </Link>

                <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-colors group ${activeTab === 'security' ? 'bg-blue-50/80 shadow-inner' : 'hover:bg-white/50'}`}
                >
                    <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-xl transition-colors ${activeTab === 'security' ? 'text-blue-500' : 'text-gray-400 group-hover:text-primary'}`}>shield</span>
                        <span className={`font-bold text-xs transition-colors ${activeTab === 'security' ? 'text-[#2D241E]' : 'text-[#2D241E]'}`}>Security & Privacy</span>
                    </div>
                    {activeTab === 'security' && <span className="material-symbols-outlined text-blue-500 text-xs font-black">check</span>}
                </button>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-red-50 rounded-lg transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-300 group-hover:text-red-500 text-xl">logout</span>
                        <span className="font-bold text-red-500 text-xs">Log Out Account</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ProfileAvatarCard;

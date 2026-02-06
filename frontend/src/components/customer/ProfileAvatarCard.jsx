import React from 'react';
import { Link } from 'react-router-dom';

const ProfileAvatarCard = ({ name, id, diet, onLogout }) => {
    return (
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

                <h2 className="text-2xl font-black text-[#2D241E] mb-1">{name}</h2>
                <p className="text-xs font-bold text-primary opacity-60 uppercase tracking-widest mb-6">Student ID: #{id || 'ST-ROH882'}</p>

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
                        <span className="font-black text-[#2D241E] text-sm">{diet}</span>
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
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-xl transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-300 group-hover:text-red-500">logout</span>
                        <span className="font-bold text-red-500 text-sm">Log Out Account</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ProfileAvatarCard;

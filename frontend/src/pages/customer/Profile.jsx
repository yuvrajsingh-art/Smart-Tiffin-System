import React from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Profile = () => {
    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">My Profile 👤</h2>
                <Button variant="outline" className="!py-2 text-xs">Edit Profile</Button>
            </div>

            {/* Profile Header */}
            <div className="glass-panel p-6 rounded-3xl flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-orange-400 p-[2px]">
                    <img
                        src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"
                        alt="Profile"
                        className="w-full h-full rounded-full border-2 border-white bg-white"
                    />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Sumit Kumar</h3>
                    <p className="text-sm text-gray-500">Student • VIT Pune</p>
                    <p className="text-xs text-primary font-bold mt-1">+91 98765 43210</p>
                </div>
            </div>

            {/* Details Form (Read Only for now) */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 ml-1">Full Name</label>
                        <div className="p-3 bg-white/50 rounded-xl text-sm font-medium text-gray-900 border border-transparent">Sumit Kumar</div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 ml-1">Email Address</label>
                        <div className="p-3 bg-white/50 rounded-xl text-sm font-medium text-gray-900 border border-transparent">sumit@example.com</div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 ml-1">Current Address</label>
                        <div className="p-3 bg-white/50 rounded-xl text-sm font-medium text-gray-900 border border-transparent">Room 402, Boys Hostel, VIT Campus</div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 ml-1">Dietary Preference</label>
                        <div className="p-3 bg-white/50 rounded-xl text-sm font-medium text-gray-900 border border-transparent">Pure Veg</div>
                    </div>
                </div>
            </div>

            <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50">Log Out</Button>
        </div>
    );
};

export default Profile;

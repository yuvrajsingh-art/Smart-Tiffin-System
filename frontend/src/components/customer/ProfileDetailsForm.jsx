import React from 'react';
import useGeolocation from '../../hooks/useGeolocation';

const ProfileDetailsForm = ({ formData, setFormData, isEditing, setIsEditing, onSave, saving }) => {
    const { getLocation, reverseGeocode, loading: locationLoading } = useGeolocation();

    const handleAutoDetect = async () => {
        try {
            const coords = await getLocation();
            const addr = await reverseGeocode(coords.latitude, coords.longitude);

            // Construct a flat address string or update individual fields if profile supports components
            const fullAddr = `${addr.street}, ${addr.city} - ${addr.pincode}`;
            setFormData({ ...formData, address: fullAddr });

        } catch (err) {
            console.error("Location detection failed:", err);
        }
    };

    return (
        <div className="flex-1 w-full glass-panel p-5 sm:p-6 rounded-[2rem] border border-white/60 relative shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                    <h3 className="text-lg font-black text-[#2D241E]">Personal Information</h3>
                    <p className="text-[10px] font-medium text-gray-400">Update your delivery and contact details</p>
                </div>
                <button
                    onClick={() => isEditing ? onSave() : setIsEditing(true)}
                    disabled={saving}
                    className={`px-4 py-1.5 rounded-full font-black text-[10px] transition-all uppercase tracking-widest ${isEditing
                        ? 'bg-primary text-white shadow-lg shadow-orange-500/20'
                        : 'bg-[#2D241E] text-white hover:bg-black'
                        } disabled:opacity-50`}
                >
                    {saving ? 'Saving...' : (isEditing ? 'Save Profile' : 'Edit Details')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 relative z-10">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        disabled={!isEditing}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/40 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 py-2.5 font-bold text-sm text-[#2D241E] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-300"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                    <input
                        type="text"
                        value={formData.phone}
                        disabled={!isEditing}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/40 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 py-2.5 font-bold text-sm text-[#2D241E] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-300"
                    />
                </div>

                <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <input
                        type="email"
                        value={formData.email}
                        disabled={!isEditing}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/40 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 py-2.5 font-bold text-sm text-[#2D241E] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-300"
                    />
                </div>

                <div className="space-y-1 md:col-span-2">
                    <div className="flex justify-between items-center mb-0.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Delivery Address</label>
                        {isEditing && (
                            <button
                                onClick={handleAutoDetect}
                                disabled={locationLoading}
                                className="text-[9px] font-black text-primary flex items-center gap-1 hover:underline disabled:opacity-50"
                            >
                                <span className={`material-symbols-outlined text-[10px] ${locationLoading ? 'animate-spin' : ''}`}>my_location</span>
                                {locationLoading ? 'Detecting...' : 'Auto-Detect'}
                            </button>
                        )}
                    </div>
                    {isEditing && (
                        <div className="flex gap-2 mb-1.5">
                            {['Home', 'Work', 'Hostel', 'Other'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFormData({ ...formData, address: `[${type}] ` + formData.address.replace(/^\[.*?\]\s*/, '') })}
                                    className="px-2.5 py-0.5 bg-orange-50 text-orange-600 rounded-md text-[9px] font-bold hover:bg-orange-100 transition-colors"
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    )}
                    <textarea
                        value={formData.address}
                        disabled={!isEditing}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        rows="2"
                        className="w-full bg-white/40 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 py-2.5 font-bold text-sm text-[#2D241E] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed resize-none placeholder:text-gray-300"
                        placeholder="House no, Street Name, Area..."
                    />
                </div>

                <div className="space-y-1 md:col-span-2 mt-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Food Preference</label>
                    <div className="flex gap-3">
                        {['Pure Veg', 'Non-Veg'].map(d => (
                            <button
                                key={d}
                                disabled={!isEditing}
                                onClick={() => setFormData({ ...formData, diet: d })}
                                className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.diet === d
                                    ? 'bg-[#2D241E] text-white shadow-lg shadow-black/10'
                                    : 'bg-white/40 text-gray-400 border border-transparent hover:bg-white'
                                    } ${!isEditing && 'cursor-default'}`}
                            >
                                <div className="flex items-center justify-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">
                                        {d === 'Pure Veg' ? 'psychiatry' : 'lunch_dining'}
                                    </span>
                                    {d}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-1 md:col-span-2 mt-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Taste Profile</label>
                    <div className="glass-panel bg-white/30 p-3 rounded-xl border border-white/50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold text-[#2D241E]">Spice Level</span>
                            <div className="flex gap-1.5">
                                {['Low', 'Medium', 'High'].map(level => (
                                    <button
                                        key={level}
                                        disabled={!isEditing}
                                        onClick={() => setFormData({ ...formData, spiceLevel: level })}
                                        className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${formData.spiceLevel === level
                                            ? (level === 'High' ? 'bg-red-500 text-white' : level === 'Medium' ? 'bg-orange-400 text-white' : 'bg-green-500 text-white')
                                            : 'bg-white text-gray-400 hover:bg-gray-50'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-pink-500 text-sm">icecream</span>
                                <span className="text-[10px] font-bold text-[#2D241E]">Sweet Tooth? <span className="text-[8px] font-normal text-gray-500">(Get dessert often)</span></span>
                            </div>
                            <button
                                disabled={!isEditing}
                                onClick={() => setFormData({ ...formData, sweetTooth: !formData.sweetTooth })}
                                className={`w-9 h-4.5 rounded-full p-0.5 transition-colors ${formData.sweetTooth ? 'bg-pink-500' : 'bg-gray-300'}`}
                            >
                                <div className={`size-3.5 bg-white rounded-full shadow-sm transition-transform ${formData.sweetTooth ? 'translate-x-4.5' : ''}`}></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetailsForm;

import React from 'react';

const ProfileDetailsForm = ({ formData, setFormData, isEditing, setIsEditing, onSave, saving }) => {
    return (
        <div className="flex-1 w-full glass-panel p-8 sm:p-10 rounded-[2.5rem] border border-white/60 relative shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex items-center justify-between mb-10 relative z-10">
                <div>
                    <h3 className="text-xl font-black text-[#2D241E]">Personal Information</h3>
                    <p className="text-xs font-medium text-gray-400">Update your delivery and contact details</p>
                </div>
                <button
                    onClick={() => isEditing ? onSave() : setIsEditing(true)}
                    disabled={saving}
                    className={`px-6 py-2.5 rounded-full font-black text-xs transition-all uppercase tracking-widest ${isEditing
                        ? 'bg-primary text-white shadow-lg shadow-orange-500/20'
                        : 'bg-[#2D241E] text-white hover:bg-black'
                        } disabled:opacity-50`}
                >
                    {saving ? 'Saving...' : (isEditing ? 'Save Profile' : 'Edit Details')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        disabled={!isEditing}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/40 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-5 py-4 font-bold text-[#2D241E] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-300"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                    <input
                        type="text"
                        value={formData.phone}
                        disabled={!isEditing}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/40 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-5 py-4 font-bold text-[#2D241E] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-300"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <input
                        type="email"
                        value={formData.email}
                        disabled={!isEditing}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/40 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-5 py-4 font-bold text-[#2D241E] outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-300"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Delivery Address</label>
                    <textarea
                        value={formData.address}
                        disabled={!isEditing}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
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
                                onClick={() => setFormData({ ...formData, diet: d })}
                                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${formData.diet === d
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
    );
};

export default ProfileDetailsForm;

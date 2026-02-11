import React from 'react';
import { IoClose, IoPersonOutline, IoCallOutline, IoMailOutline, IoLocationOutline, IoFastFoodOutline, IoAlertCircleOutline } from 'react-icons/io5';

const CustomerProfileModal = ({ isOpen, onClose, customer }) => {
    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-white rounded-[2.5rem] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-br from-[#2D241E] to-[#1a1512] p-8 text-white relative">
                    <div className="absolute top-0 right-0 p-6">
                        <button onClick={onClose} className="size-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-md">
                            <IoClose className="text-2xl" />
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="size-20 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white shadow-xl ring-4 ring-white/10">
                            {customer.avatar}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight">{customer.name}</h3>
                            <p className="text-orange-400 font-bold text-xs uppercase tracking-widest mt-1 italic">{customer.plan} Subscriber</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Contact Section */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Contact Information</h4>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100/50 group hover:border-orange-200 transition-all">
                                <div className="size-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm group-hover:scale-110 transition-transform">
                                    <IoCallOutline className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Phone Number</p>
                                    <p className="text-sm font-bold text-[#2D241E]">{customer.phone}</p>
                                </div>
                                <a href={`tel:${customer.phone}`} className="ml-auto size-8 bg-black text-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-sm">call</span>
                                </a>
                            </div>

                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100/50 group hover:border-blue-200 transition-all">
                                <div className="size-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform">
                                    <IoMailOutline className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Email Address</p>
                                    <p className="text-sm font-bold text-[#2D241E] truncate max-w-[200px]">{customer.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100/50 group hover:border-emerald-200 transition-all">
                                <div className="size-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                                    <IoLocationOutline className="text-xl" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Delivery Address</p>
                                    <p className="text-sm font-bold text-[#2D241E] leading-relaxed">{customer.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Meal Preferences</h4>
                        <div className="flex flex-wrap gap-3">
                            <div className="px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3">
                                <IoFastFoodOutline className="text-indigo-600" />
                                <span className="text-xs font-black text-indigo-900 uppercase italic">{customer.mealType || 'General'}</span>
                            </div>

                            {customer.preferences?.map((pref, i) => (
                                <div key={i} className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3">
                                    <span className="size-2 rounded-full bg-amber-500"></span>
                                    <span className="text-xs font-black text-amber-900 uppercase italic">{pref}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Allergies Section */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Health & Allergies</h4>
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4">
                            <div className="size-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                                <IoAlertCircleOutline className="text-xl" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-rose-900 mb-1">Cautions / Allergies</p>
                                <p className="text-[11px] font-medium text-rose-700 italic leading-relaxed">
                                    {customer.allergies?.length > 0
                                        ? customer.allergies.join(', ')
                                        : 'No allergies reported by customer. Still, maintain basic hygiene standards.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                    <button
                        onClick={() => window.open(`https://wa.me/${customer.phone?.replace(/[^0-9]/g, '')}`, '_blank')}
                        className="flex-1 py-4 bg-[#25D366] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#25D366]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">chat</span>
                        WhatsApp
                    </button>
                    <button
                        onClick={() => window.open(`tel:${customer.phone}`, '_blank')}
                        className="flex-1 py-4 bg-[#2D241E] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">call</span>
                        Direct Call
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfileModal;

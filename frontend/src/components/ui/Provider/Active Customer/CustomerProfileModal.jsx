import React, { useState, useEffect } from 'react';
import { IoClose, IoPersonOutline, IoCallOutline, IoMailOutline, IoLocationOutline, IoFastFoodOutline, IoAlertCircleOutline, IoCalendarOutline, IoTimeOutline } from 'react-icons/io5';
import ProviderApi from '../../../../services/ProviderApi';
import { toast } from 'react-hot-toast';

const CustomerProfileModal = ({ isOpen, onClose, customer }) => {
    const [loading, setLoading] = useState(false);
    const [fullCustomerData, setFullCustomerData] = useState(null);

    useEffect(() => {
        if (isOpen && customer) {
            fetchCustomerDetails();
        }
    }, [isOpen, customer]);

    const fetchCustomerDetails = async () => {
        setLoading(true);
        try {
            const response = await ProviderApi.get(`/provider-subscription/${customer.id}`);
            if (response.data && response.data.data) {
                setFullCustomerData(response.data.data);
            } else {
                setFullCustomerData(customer);
            }
        } catch (error) {
            console.error('Error fetching customer details:', error);
            setFullCustomerData(customer);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !customer) return null;

    const displayData = fullCustomerData || customer;
    const customerInfo = displayData.customer || {};
    const subscriptionInfo = displayData;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
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
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${customer.status === 'active' ? 'bg-green-500/20 text-green-300' : customer.status === 'paused' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                                    {customer.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : (
                    <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
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
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Email Address</p>
                                        <p className="text-sm font-bold text-[#2D241E] truncate">{customer.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100/50 group hover:border-emerald-200 transition-all">
                                    <div className="size-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                                        <IoLocationOutline className="text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Delivery Address</p>
                                        <p className="text-sm font-bold text-[#2D241E] leading-relaxed">
                                            {displayData.deliveryAddress?.street && displayData.deliveryAddress?.city && displayData.deliveryAddress?.pincode
                                                ? `${displayData.deliveryAddress.street}, ${displayData.deliveryAddress.city} - ${displayData.deliveryAddress.pincode}`
                                                : customer.address || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subscription Details */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Subscription Details</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <IoCalendarOutline className="text-purple-600" />
                                        <p className="text-[10px] font-bold text-purple-600 uppercase">Join Date</p>
                                    </div>
                                    <p className="text-sm font-black text-purple-900">{new Date(customer.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-2xl border border-orange-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <IoTimeOutline className="text-orange-600" />
                                        <p className="text-[10px] font-bold text-orange-600 uppercase">Ends On</p>
                                    </div>
                                    <p className="text-sm font-black text-orange-900">{new Date(customer.lastOrder).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <IoFastFoodOutline className="text-blue-600" />
                                        <p className="text-[10px] font-bold text-blue-600 uppercase">Plan Type</p>
                                    </div>
                                    <p className="text-sm font-black text-blue-900">{customer.plan}</p>
                                </div>

                                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-2xl border border-red-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <IoAlertCircleOutline className="text-red-600" />
                                        <p className="text-[10px] font-bold text-red-600 uppercase">Skipped Meals</p>
                                    </div>
                                    <p className="text-sm font-black text-red-900">{customer.totalOrders || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Meal Preferences */}
                        {(subscriptionInfo.mealType || subscriptionInfo.preferences) && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Meal Preferences</h4>
                                <div className="flex flex-wrap gap-3">
                                    {subscriptionInfo.mealType && (
                                        <div className="px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3">
                                            <IoFastFoodOutline className="text-indigo-600" />
                                            <span className="text-xs font-black text-indigo-900 uppercase italic">{subscriptionInfo.mealType}</span>
                                        </div>
                                    )}

                                    {subscriptionInfo.preferences?.map((pref, i) => (
                                        <div key={i} className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3">
                                            <span className="size-2 rounded-full bg-amber-500"></span>
                                            <span className="text-xs font-black text-amber-900 uppercase italic">{pref}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Info */}
                        {(customerInfo.allergies || subscriptionInfo.specialInstructions) && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Additional Information</h4>
                                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4">
                                    <div className="size-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                                        <IoAlertCircleOutline className="text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-rose-900 mb-1">Special Notes</p>
                                        <p className="text-[11px] font-medium text-rose-700 italic leading-relaxed">
                                            {customerInfo.allergies || subscriptionInfo.specialInstructions || 'No special instructions provided.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}


            </div>
        </div>
    );
};

export default CustomerProfileModal;

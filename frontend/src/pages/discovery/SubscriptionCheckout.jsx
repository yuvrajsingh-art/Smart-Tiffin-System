import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';

const SubscriptionCheckout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { buySubscription } = useSubscription();

    const planType = searchParams.get('plan') || 'monthly';
    const planName = planType === 'monthly' ? 'Monthly Complete' : 'Weekly Trial';
    const basePrice = planType === 'monthly' ? 3500 : 900;

    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // Form State
    const [config, setConfig] = useState({
        startDate: new Date().toISOString().split('T')[0],
        mealType: 'both',
    });
    const [addons, setAddons] = useState({
        extraRoti: 0,
        extraRice: 0,
        curd: false,
    });
    const [delivery, setDelivery] = useState({
        address: { street: '', city: 'Pune', pincode: '' },
        lunchTime: '12:30 PM',
        dinnerTime: '08:30 PM'
    });

    // Calculations
    const getBasePrice = () => {
        if (config.mealType === 'both') return basePrice;
        return Math.round(basePrice * 0.6);
    };

    const getAddonsTotal = () => {
        let total = 0;
        if (addons.extraRoti) total += addons.extraRoti * 150;
        if (addons.extraRice) total += addons.extraRice * 200;
        if (addons.curd) total += 300;
        return total;
    };

    const grandTotal = getBasePrice() + getAddonsTotal();

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            buySubscription(planName, grandTotal);
            setTimeout(() => {
                setCurrentStep(5); // Success
                setIsProcessing(false);
            }, 1000);
        }, 2000);
    };

    const handleAutoDetect = () => {
        setDelivery(prev => ({
            ...prev,
            address: { ...prev.address, street: 'Shivaji Nagar, FC Road', city: 'Pune', pincode: '411005' }
        }));
    };

    // Sub-components
    const StepTitle = ({ title, subtitle }) => (
        <div className="mb-4">
            <h2 className="text-xl font-black text-[#2D241E] leading-tight">{title}</h2>
            <p className="text-[#5C4D42] font-medium text-xs">{subtitle}</p>
        </div>
    );

    const SelectionCard = ({ selected, onClick, children, className }) => (
        <div
            onClick={onClick}
            className={`relative p-3 rounded-xl border cursor-pointer transition-all duration-300 group ${selected ? 'border-[#2D241E] bg-[#2D241E] text-white shadow-md scale-[1.01]' : 'border-transparent bg-white/60 hover:bg-white text-[#5C4D42] hover:shadow-sm'} ${className}`}
        >
            {children}
            {selected && (
                <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md rounded-full p-0.5">
                    <span className="material-symbols-outlined text-[10px] font-bold text-white block">check</span>
                </div>
            )}
        </div>
    );

    // Render Steps
    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Customization
                return (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <StepTitle title="Tailor Your Plan" subtitle="Choose what works best for you." />

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Meal Preference</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['both', 'lunch', 'dinner'].map((type) => (
                                        <SelectionCard
                                            key={type}
                                            selected={config.mealType === type}
                                            onClick={() => setConfig({ ...config, mealType: type })}
                                            className="flex flex-col items-center justify-center gap-1 py-3"
                                        >
                                            <span className="material-symbols-outlined text-xl mb-0.5">
                                                {type === 'both' ? 'restaurant' : type === 'lunch' ? 'wb_sunny' : 'nights_stay'}
                                            </span>
                                            <span className="capitalize font-bold text-xs">{type === 'both' ? 'Full Day' : type}</span>
                                            {type === 'both' && <span className="text-[8px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full">Best</span>}
                                        </SelectionCard>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Start Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full bg-white/60 border-none rounded-xl px-4 py-2.5 font-bold text-[#2D241E] outline-none focus:ring-2 focus:ring-[#2D241E]/10 transition-shadow text-sm"
                                        value={config.startDate}
                                        onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">calendar_month</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button onClick={() => setCurrentStep(2)} className="w-full py-3 bg-[#2D241E] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm">
                                Next Step <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                );
            case 2: // Add-ons
                return (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <StepTitle title="Add Extras" subtitle="Customize your daily tiffin." />

                        <div className="space-y-3">
                            {/* Roti */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 shadow-sm transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">🥙</div>
                                    <div>
                                        <p className="font-black text-[#2D241E] text-sm">Extra Roti</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Daily 1 • ₹150/mo</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                    <button onClick={() => setAddons(p => ({ ...p, extraRoti: Math.max(0, p.extraRoti - 1) }))} className="size-6 hover:bg-white rounded shadow-sm text-[#2D241E] font-bold text-sm transition-colors">-</button>
                                    <span className="text-sm font-black w-4 text-center">{addons.extraRoti}</span>
                                    <button onClick={() => setAddons(p => ({ ...p, extraRoti: p.extraRoti + 1 }))} className="size-6 hover:bg-white rounded shadow-sm text-[#2D241E] font-bold text-sm transition-colors">+</button>
                                </div>
                            </div>

                            {/* Curd */}
                            <div
                                onClick={() => setAddons(p => ({ ...p, curd: !p.curd }))}
                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300 group ${addons.curd ? 'border-blue-500 bg-blue-50/50' : 'border-transparent bg-white hover:border-blue-200'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-lg flex items-center justify-center text-xl transition-transform group-hover:scale-105 ${addons.curd ? 'bg-blue-500 text-white' : 'bg-blue-100'}`}>🥛</div>
                                    <div>
                                        <p className="font-black text-[#2D241E] text-sm">Fresh Curd</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Daily • ₹300/mo</p>
                                    </div>
                                </div>
                                <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${addons.curd ? 'border-blue-500 bg-blue-500 text-white scale-100' : 'border-gray-200 bg-gray-50'}`}>
                                    {addons.curd && <span className="material-symbols-outlined text-[10px] font-bold">check</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setCurrentStep(1)} className="px-5 text-xs font-bold text-gray-400 hover:text-[#2D241E] transition-colors">Back</button>
                            <button onClick={() => setCurrentStep(3)} className="flex-1 py-3 bg-[#2D241E] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm">
                                Continue
                            </button>
                        </div>
                    </div>
                );
            case 3: // Delivery
                return (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <StepTitle title="Delivery Details" subtitle="Where should we send your tiffin?" />

                        <div className="space-y-3">
                            <button onClick={handleAutoDetect} className="w-full py-2.5 border border-dashed border-[#2D241E]/20 text-[#2D241E] hover:bg-[#2D241E]/5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group text-xs">
                                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">my_location</span>
                                Auto-Fill Location
                            </button>

                            <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 space-y-1">
                                <input
                                    placeholder="Apartment, Street Area"
                                    className="w-full h-10 bg-transparent px-3 font-bold text-[#2D241E] placeholder:text-gray-300 outline-none text-sm border-b border-gray-100"
                                    value={delivery.address.street}
                                    onChange={e => setDelivery({ ...delivery, address: { ...delivery.address, street: e.target.value } })}
                                />
                                <div className="flex gap-2">
                                    <input
                                        placeholder="City"
                                        className="w-1/2 h-10 bg-transparent px-3 font-bold text-[#2D241E] placeholder:text-gray-300 outline-none border-r border-gray-100 text-sm"
                                        value={delivery.address.city}
                                        readOnly
                                    />
                                    <input
                                        placeholder="Pincode"
                                        className="w-1/2 h-10 bg-transparent px-3 font-bold text-[#2D241E] placeholder:text-gray-300 outline-none text-sm"
                                        value={delivery.address.pincode}
                                        onChange={e => setDelivery({ ...delivery, address: { ...delivery.address, pincode: e.target.value } })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setCurrentStep(2)} className="px-5 text-xs font-bold text-gray-400 hover:text-[#2D241E] transition-colors">Back</button>
                            <button onClick={() => setCurrentStep(4)} className="flex-1 py-3 bg-[#2D241E] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm">
                                Review Payment
                            </button>
                        </div>
                    </div>
                );
            case 4: // Payment
                return (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <StepTitle title="Secure Payment" subtitle="Complete your subscription safely." />

                        <div className="space-y-3">
                            <div className="border border-orange-200 bg-orange-50/50 rounded-xl p-4 flex items-center gap-3 cursor-pointer ring-1 ring-primary relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">Fast</div>
                                <div className="size-4 rounded-full border-[4px] border-primary bg-white"></div>
                                <div className="flex-1">
                                    <p className="font-black text-[#2D241E] text-sm">UPI / QR Payment</p>
                                    <p className="text-[10px] font-bold text-[#5C4D42]">Instant • No Fee</p>
                                </div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png" className="h-4 opacity-80" alt="UPI" />
                            </div>

                            <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3 opacity-40 cursor-not-allowed">
                                <div className="size-4 rounded-full border-2 border-gray-300 bg-white"></div>
                                <div className="flex-1">
                                    <p className="font-black text-gray-500 text-sm">Credit / Debit Card</p>
                                    <p className="text-[10px] font-bold text-gray-400">Unavailable</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setCurrentStep(3)} className="px-5 text-xs font-bold text-gray-400 hover:text-[#2D241E] transition-colors">Back</button>
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-[#e05d00] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                {isProcessing ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-base">lock</span> Pay ₹{grandTotal}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                );
            case 5: // Success
                return (
                    <div className="text-center py-8 animate-[scaleIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 animate-pulse"></div>
                            <div className="size-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                                <span className="material-symbols-outlined text-4xl text-white">check_circle</span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-[#2D241E] mb-1 tracking-tight">You're Awesome! 🎉</h2>
                        <p className="text-[#5C4D42] font-medium text-sm mb-6 max-w-xs mx-auto">Subscription activated successfully.</p>

                        <div className="bg-white p-1 rounded-xl shadow-sm inline-block w-full max-w-[200px] mb-6">
                            <div className="border border-dashed border-gray-200 bg-gray-50 rounded-lg p-2.5">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Delivering To</p>
                                <p className="text-xs font-bold text-[#2D241E] truncate">{delivery.address.street || 'Your Location'}</p>
                            </div>
                        </div>

                        <button onClick={() => navigate('/customer/dashboard')} className="w-full py-3 bg-[#2D241E] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm">
                            Go to My Dashboard
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 items-start justify-center relative">

                {/* Background Blobs - Toned down */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 opacity-60">
                    <div className="blob w-[500px] h-[500px] bg-primary/5 top-0 left-0 blur-3xl"></div>
                </div>

                {/* Left: Compact Dark Panel (Sticky) */}
                <div className="md:w-[280px] shrink-0 sticky top-20">
                    <div className="bg-[#1a1a1a]/95 backdrop-blur-xl p-5 rounded-[2rem] shadow-xl text-white border border-white/10 ring-1 ring-black/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-8 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm">receipt_long</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-sm leading-none">Order Summary</h2>
                                <p className="text-[10px] text-white/40 font-medium mt-0.5">Smart Tiffin</p>
                            </div>
                        </div>

                        {/* Plan Card */}
                        <div className="bg-white/5 rounded-xl p-3 mb-4 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-5">
                                <span className="material-symbols-outlined text-4xl">lunch_dining</span>
                            </div>
                            <p className="text-orange-400 text-[8px] font-black uppercase tracking-widest mb-1">Selected Plan</p>
                            <h3 className="text-base font-black mb-0.5">{planName}</h3>
                            <p className="text-xs text-white/60 font-medium mb-0 capitalize">{config.mealType === 'both' ? 'Lunch + Dinner' : config.mealType}</p>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-xs items-center">
                                <span className="text-white/60">Base Price</span>
                                <span className="font-bold">₹{getBasePrice()}</span>
                            </div>
                            {addons.extraRoti > 0 && (
                                <div className="flex justify-between text-xs items-center text-orange-200">
                                    <span>+ {addons.extraRoti} Extra Roti</span>
                                    <span className="font-bold">₹{addons.extraRoti * 150}</span>
                                </div>
                            )}
                            {addons.curd && (
                                <div className="flex justify-between text-xs items-center text-blue-200">
                                    <span>+ Curd Bowl</span>
                                    <span className="font-bold">₹300</span>
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-white/10 mb-5"></div>

                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-0.5">Total</p>
                            </div>
                            <span className="text-2xl font-black tracking-tight">₹{grandTotal}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Steps Content (Compact) */}
                <div className="flex-1 w-full max-w-[500px]">
                    {currentStep < 5 && (
                        <div className="flex items-center gap-1.5 mb-4 px-1 overflow-x-hidden">
                            {[1, 2, 3, 4].map((s) => (
                                <div key={s} className="flex items-center gap-1.5">
                                    <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${currentStep >= s ? 'bg-[#2D241E] text-white scale-100' : 'bg-white border border-gray-200 text-gray-300 scale-90'}`}>
                                        {currentStep > s ? <span className="material-symbols-outlined text-[12px]">check</span> : s}
                                    </div>
                                    {s < 4 && <div className={`w-8 h-0.5 rounded-full transition-all duration-300 ${currentStep > s ? 'bg-[#2D241E]' : 'bg-gray-200'}`}></div>}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] shadow-xl border-white/80 relative overflow-hidden min-h-[420px] flex flex-col justify-center bg-white/70 backdrop-blur-3xl">
                        {renderStepContent()}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SubscriptionCheckout;

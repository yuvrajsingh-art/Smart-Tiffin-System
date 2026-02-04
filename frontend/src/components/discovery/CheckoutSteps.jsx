import React from 'react';

// Shared Components
const StepTitle = ({ title, subtitle }) => (
    <div className="mb-4">
        <h2 className="text-xl font-black text-[#2D241E] leading-tight flex items-center gap-2">
            {title}
        </h2>
        <p className="text-[#5C4D42] font-medium text-xs opacity-70">{subtitle}</p>
    </div>
);

const SelectionCard = ({ selected, onClick, children, className }) => (
    <div
        onClick={onClick}
        className={`relative p-3 rounded-xl border cursor-pointer transition-all duration-300 group ${selected ? 'border-[#2D241E] bg-[#2D241E] text-white shadow-md scale-[1.01]' : 'border-transparent bg-white/60 hover:bg-white text-[#5C4D42] hover:shadow-sm'} ${className}`}
    >
        {children}
        {selected && (
            <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md rounded-full p-0.5 animate-scaleIn">
                <span className="material-symbols-outlined text-[10px] font-bold text-white block">check</span>
            </div>
        )}
    </div>
);

// --- Step 1: Customization ---
export const StepCustomization = ({ config, setConfig, onNext }) => {
    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <StepTitle title="Tailor Your Plan" subtitle="Choose what works best for you." />

            <div className="space-y-5">
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Meal Preference</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['both', 'lunch', 'dinner'].map((type) => (
                            <SelectionCard
                                key={type}
                                selected={config.mealType === type}
                                onClick={() => setConfig({ ...config, mealType: type })}
                                className="flex flex-col items-center justify-center gap-1.5 py-4"
                            >
                                <span className="material-symbols-outlined text-2xl mb-0.5 transition-transform group-hover:scale-110">
                                    {type === 'both' ? 'restaurant' : type === 'lunch' ? 'wb_sunny' : 'nights_stay'}
                                </span>
                                <span className="capitalize font-bold text-xs">{type === 'both' ? 'Full Day' : type}</span>
                                {type === 'both' && <span className="text-[8px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full absolute -top-1.5 -right-1.5 shadow-sm z-10">Best Value</span>}
                            </SelectionCard>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Start Date</label>
                    <div className="relative group">
                        <input
                            type="date"
                            className="w-full bg-white/60 border-2 border-transparent focus:border-[#2D241E]/10 rounded-xl px-4 py-3 font-bold text-[#2D241E] outline-none transition-all text-sm shadow-sm"
                            value={config.startDate}
                            onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-[#2D241E] transition-colors">calendar_month</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <button onClick={onNext} className="w-full py-3.5 bg-[#2D241E] text-white rounded-[1.2rem] font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm group">
                    Next Step <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

// --- Step 2: Addons ---
export const StepAddons = ({ addons, setAddons, onBack, onNext }) => {
    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <StepTitle title="Add Extras" subtitle="Customize your daily tiffin." />

            <div className="space-y-3">
                {/* Roti */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-white shadow-sm transition-all hover:bg-white hover:shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">🥙</div>
                        <div>
                            <p className="font-black text-[#2D241E] text-sm">Extra Roti</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Daily 1 • ₹150/mo</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white rounded-lg p-1.5 border border-gray-100 shadow-sm">
                        <button onClick={() => setAddons(p => ({ ...p, extraRoti: Math.max(0, p.extraRoti - 1) }))} className="size-6 hover:bg-gray-50 rounded shadow-sm text-[#2D241E] font-bold text-lg flex items-center justify-center transition-colors">-</button>
                        <span className="text-sm font-black w-4 text-center">{addons.extraRoti}</span>
                        <button onClick={() => setAddons(p => ({ ...p, extraRoti: p.extraRoti + 1 }))} className="size-6 hover:bg-gray-50 rounded shadow-sm text-[#2D241E] font-bold text-lg flex items-center justify-center transition-colors">+</button>
                    </div>
                </div>

                {/* Rice */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-white shadow-sm transition-all hover:bg-white hover:shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">🍚</div>
                        <div>
                            <p className="font-black text-[#2D241E] text-sm">Extra Rice</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Daily 1 • ₹200/mo</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white rounded-lg p-1.5 border border-gray-100 shadow-sm">
                        <button onClick={() => setAddons(p => ({ ...p, extraRice: Math.max(0, p.extraRice - 1) }))} className="size-6 hover:bg-gray-50 rounded shadow-sm text-[#2D241E] font-bold text-lg flex items-center justify-center transition-colors">-</button>
                        <span className="text-sm font-black w-4 text-center">{addons.extraRice}</span>
                        <button onClick={() => setAddons(p => ({ ...p, extraRice: p.extraRice + 1 }))} className="size-6 hover:bg-gray-50 rounded shadow-sm text-[#2D241E] font-bold text-lg flex items-center justify-center transition-colors">+</button>
                    </div>
                </div>


                {/* Curd */}
                <div
                    onClick={() => setAddons(p => ({ ...p, curd: !p.curd }))}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300 group ${addons.curd ? 'border-primary bg-primary/5' : 'border-transparent bg-white/60 hover:bg-white hover:shadow-md'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`size-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-105 ${addons.curd ? 'bg-primary text-white shadow-lg' : 'bg-blue-100 text-blue-500'}`}>🥛</div>
                        <div>
                            <p className="font-black text-[#2D241E] text-sm">Fresh Curd</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Daily • ₹300/mo</p>
                        </div>
                    </div>
                    <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${addons.curd ? 'border-primary bg-primary text-white scale-100 shadow-md' : 'border-gray-200 bg-transparent'}`}>
                        {addons.curd && <span className="material-symbols-outlined text-[14px] font-black">check</span>}
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-8">
                <button onClick={onBack} className="px-6 py-3 text-xs font-bold text-[#5C4D42] hover:bg-[#2D241E]/5 rounded-xl transition-colors">Back</button>
                <button onClick={onNext} className="flex-1 py-3.5 bg-[#2D241E] text-white rounded-[1.2rem] font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm">
                    Continue
                </button>
            </div>
        </div>
    );
};

// --- Step 3: Delivery ---
export const StepDelivery = ({ delivery, setDelivery, config, provider, handleAutoDetect, onBack, onNext }) => {
    const isValid = delivery.address.street && delivery.address.pincode && delivery.phone && delivery.phone.length >= 10;

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <StepTitle title="Delivery Details" subtitle="Where should we send your tiffin?" />

            <div className="space-y-4">
                <button onClick={handleAutoDetect} className="w-full py-3 border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group text-xs shadow-sm">
                    <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">my_location</span>
                    Auto-Fill Current Location
                </button>

                <div className="bg-white/70 backdrop-blur-sm p-2 rounded-2xl shadow-sm border border-white/60 space-y-2">
                    <input
                        placeholder="Apartment, Street Area"
                        className="w-full h-11 bg-transparent px-3 font-bold text-[#2D241E] placeholder:text-gray-400 outline-none text-sm border-b border-gray-100 focus:border-primary/50 transition-colors"
                        value={delivery.address.street}
                        onChange={e => setDelivery({ ...delivery, address: { ...delivery.address, street: e.target.value } })}
                    />
                    <div className="flex gap-2 border-b border-gray-100">
                        <input
                            placeholder="City"
                            className="w-1/2 h-11 bg-transparent px-3 font-bold text-[#2D241E] placeholder:text-gray-400 outline-none border-r border-gray-100 text-sm focus:border-primary/50 transition-colors"
                            value={delivery.address.city}
                            onChange={e => setDelivery({ ...delivery, address: { ...delivery.address, city: e.target.value } })}
                        />
                        <input
                            placeholder="Pincode"
                            className="w-1/2 h-11 bg-transparent px-3 font-bold text-[#2D241E] placeholder:text-gray-400 outline-none text-sm focus:border-primary/50 transition-colors"
                            value={delivery.address.pincode}
                            onChange={e => setDelivery({ ...delivery, address: { ...delivery.address, pincode: e.target.value } })}
                        />
                    </div>
                    <input
                        placeholder="Phone Number (Required)"
                        className="w-full h-11 bg-transparent px-3 font-bold text-[#2D241E] placeholder:text-gray-400 outline-none text-sm"
                        maxLength={10}
                        value={delivery.phone || ''}
                        onChange={e => setDelivery({ ...delivery, phone: e.target.value.replace(/\D/g, '') })}
                    />
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-3">
                    {(config.mealType === 'both' || config.mealType === 'lunch') && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lunch Time</label>
                            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 group hover:border-orange-200 transition-colors">
                                <span className="material-symbols-outlined text-lg text-orange-400 bg-orange-50 p-1 rounded-md">wb_sunny</span>
                                <input
                                    type="text"
                                    value={delivery.lunchTime}
                                    onChange={e => setDelivery({ ...delivery, lunchTime: e.target.value })}
                                    className="bg-transparent outline-none font-bold text-xs w-full text-[#2D241E]"
                                    placeholder="e.g. 12:30 PM"
                                />
                            </div>
                            {provider && <p className="text-[8px] text-gray-400 font-bold px-1">Window: {provider.timings.lunch}</p>}
                        </div>
                    )}
                    {(config.mealType === 'both' || config.mealType === 'dinner') && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dinner Time</label>
                            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 group hover:border-blue-200 transition-colors">
                                <span className="material-symbols-outlined text-lg text-blue-400 bg-blue-50 p-1 rounded-md">nights_stay</span>
                                <input
                                    type="text"
                                    value={delivery.dinnerTime}
                                    onChange={e => setDelivery({ ...delivery, dinnerTime: e.target.value })}
                                    className="bg-transparent outline-none font-bold text-xs w-full text-[#2D241E]"
                                    placeholder="e.g. 08:30 PM"
                                />
                            </div>
                            {provider && <p className="text-[8px] text-gray-400 font-bold px-1">Window: {provider.timings.dinner}</p>}
                        </div>
                    )}
                </div>
                <p className="text-[9px] text-[#5C4D42] italic px-2 opacity-70">
                    <span className="material-symbols-outlined text-[10px] align-middle mr-1">info</span> Note: Exact delivery depends on kitchen load.
                </p>
            </div>

            <div className="flex gap-3 mt-8">
                <button onClick={onBack} className="px-6 py-3 text-xs font-bold text-[#5C4D42] hover:bg-[#2D241E]/5 rounded-xl transition-colors">Back</button>
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="flex-1 py-3.5 bg-[#2D241E] text-white rounded-[1.2rem] font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
                >
                    Review Payment
                </button>
            </div>
        </div>
    );
};

// --- Step 4: Payment ---
export const StepPayment = ({ isProcessing, onBack, onPay, grandTotal }) => {
    return (
        <div className="animate-[fadeIn_0.5s_ease-out] relative">
            {isProcessing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center rounded-[2.5rem]">
                    <div className="size-16 border-4 border-gray-200 border-t-[#2D241E] rounded-full animate-spin mb-4"></div>
                    <h3 className="text-[#2D241E] font-black text-lg animate-pulse">Processing...</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Please do not close</p>
                </div>
            )}

            <StepTitle title="Secure Payment" subtitle="Complete your subscription safely." />

            <div className="space-y-4">
                <div className="border-2 border-primary/20 bg-primary/5 rounded-[1.5rem] p-5 flex items-center gap-4 cursor-pointer ring-1 ring-primary relative overflow-hidden group hover:bg-primary/10 transition-colors shadow-md">
                    <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">Recommended</div>
                    <div className="size-6 rounded-full border-[6px] border-primary bg-white shadow-sm"></div>
                    <div className="flex-1">
                        <p className="font-black text-[#2D241E] text-base mb-0.5">UPI / QR Payment</p>
                        <p className="text-xs font-bold text-[#5C4D42] opacity-80">Instant Activation • Zero Fees</p>
                    </div>
                    <div className="h-8 w-12 bg-white rounded flex items-center justify-center shadow-sm opacity-80">
                        <span className="font-black text-xs text-[#2D241E]">UPI</span>
                    </div>
                </div>

                <div className="border border-dashed border-gray-300 rounded-[1.5rem] p-5 flex items-center gap-4 opacity-50 cursor-not-allowed">
                    <div className="size-6 rounded-full border-2 border-gray-300 bg-transparent"></div>
                    <div className="flex-1">
                        <p className="font-black text-gray-500 text-base mb-0.5">Credit / Debit Card</p>
                        <p className="text-xs font-bold text-gray-400">Coming Soon</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-400">credit_card</span>
                </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-2xl border border-green-100 flex items-start gap-3">
                <span className="material-symbols-outlined text-green-600">verified_user</span>
                <div>
                    <p className="text-xs font-black text-[#2D241E]">100% Secure Payment</p>
                    <p className="text-[10px] text-[#5C4D42] leading-tight mt-0.5">Your payment is encrypted and secured. No card details are stored.</p>
                </div>
            </div>

            <div className="flex gap-3 mt-8">
                <button onClick={onBack} className="px-6 py-3 text-xs font-bold text-[#5C4D42] hover:bg-[#2D241E]/5 rounded-xl transition-colors">Back</button>
                <button
                    onClick={onPay}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-[#2D241E] text-white rounded-[1.2rem] font-black shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm group"
                >
                    <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">lock</span> Pay ₹{grandTotal}
                </button>
            </div>
        </div>
    );
};

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

    const [steps, setSteps] = useState(1); // 1: Config, 2: Delivery, 3: Payment, 4: Success
    const [config, setConfig] = useState({
        startDate: new Date().toISOString().split('T')[0],
        mealType: 'both', // both, lunch, dinner
    });

    // Delivery State
    const [delivery, setDelivery] = useState({
        address: {
            street: '',
            landmark: '',
            city: '',
            pincode: ''
        },
        lunchTime: '12:30 PM',
        dinnerTime: '8:30 PM'
    });
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const calculateTotal = () => {
        let price = basePrice;
        if (config.mealType !== 'both') {
            price = Math.round(basePrice * 0.6); // Discount for single meal
        }
        return price;
    };

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate Payment Gateway
        setTimeout(() => {
            buySubscription(planName, calculateTotal());
            setTimeout(() => {
                setSteps(4); // Success Screen
                setIsProcessing(false);
            }, 1000);
        }, 2000);
    };

    // Location Logic
    const handleAutoDetect = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported");
            return;
        }
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();
                setDelivery(prev => ({
                    ...prev,
                    address: {
                        street: data.address.road || '',
                        landmark: data.address.suburb || '',
                        city: data.address.city || data.address.town || '',
                        pincode: data.address.postcode || ''
                    }
                }));
            } catch (error) {
                console.error("Geo error", error);
                alert("Could not fetch address");
            }
            setLoadingLocation(false);
        }, () => {
            alert("Location access denied");
            setLoadingLocation(false);
        });
    };

    return (
        <div className="max-w-3xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out]">
            {/* Header */}
            <div className="py-8 text-center">
                <h1 className="text-3xl font-black text-[#2D241E] mb-2">Secure Checkout</h1>
                <p className="text-[#5C4D42]">Complete your subscription setup</p>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-center gap-4 mb-10 overflow-x-auto px-4">
                <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${steps >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <div className={`w-8 h-1 rounded-full ${steps >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${steps >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <div className={`w-8 h-1 rounded-full ${steps >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${steps >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                <div className={`w-8 h-1 rounded-full ${steps >= 4 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${steps >= 4 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>4</div>
            </div>

            <div className="glass-panel p-8 rounded-[2rem] shadow-xl">

                {/* Step 1: Configuration */}
                {steps === 1 && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-[#2D241E] mb-6">Customize Your Plan</h2>

                            {/* Meal Type Selection */}
                            <div className="space-y-3 mb-6">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Meal Type</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {['both', 'lunch', 'dinner'].map((type) => (
                                        <label key={type} className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${config.mealType === type ? 'border-primary bg-orange-50 text-primary' : 'border-gray-100 hover:border-orange-200 text-gray-600'}`}>
                                            <input type="radio" name="mealType" value={type} checked={config.mealType === type} onChange={(e) => setConfig({ ...config, mealType: e.target.value })} className="hidden" />
                                            <span className="capitalize font-bold">{type === 'both' ? 'Lunch & Dinner' : type}</span>
                                            {type === 'both' ? (
                                                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded">Best Value</span>
                                            ) : (
                                                <span className="text-xs">40% Off</span>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-primary"
                                    value={config.startDate}
                                    onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[#5C4D42] font-medium">Base Plan ({planName})</span>
                                <span className="text-[#2D241E] font-bold">₹{basePrice}</span>
                            </div>
                            {config.mealType !== 'both' && (
                                <div className="flex justify-between items-center mb-2 text-green-600">
                                    <span className="font-medium">Single Meal Discount</span>
                                    <span className="font-bold">- ₹{basePrice - calculateTotal()}</span>
                                </div>
                            )}
                            <div className="h-px bg-gray-200 my-4"></div>
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-[#2D241E] font-black">Total to Pay</span>
                                <span className="text-primary font-black">₹{calculateTotal()}</span>
                            </div>
                        </div>

                        <button onClick={() => setSteps(2)} className="w-full py-4 bg-[#111716] text-white rounded-xl font-bold text-lg hover:bg-black transition-colors shadow-xl">
                            Next: Delivery Details
                        </button>
                    </div>
                )}

                {/* Step 2: Delivery Details */}
                {steps === 2 && (
                    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                        <h2 className="text-xl font-bold text-[#2D241E] mb-6">Delivery Preferences</h2>

                        {/* Location Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery Address</label>
                                <button
                                    onClick={handleAutoDetect}
                                    disabled={loadingLocation}
                                    className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
                                >
                                    {loadingLocation ? 'Detecting...' : <><span className="material-symbols-outlined text-sm">my_location</span> Use Current Location</>}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    placeholder="Street / Area"
                                    className="bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary w-full"
                                    value={delivery.address.street}
                                    onChange={e => setDelivery({ ...delivery, address: { ...delivery.address, street: e.target.value } })}
                                />
                                <input
                                    placeholder="Landmark (Optional)"
                                    className="bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary w-full"
                                    value={delivery.address.landmark}
                                    onChange={e => setDelivery({ ...delivery, address: { ...delivery.address, landmark: e.target.value } })}
                                />
                                <input
                                    placeholder="City"
                                    className="bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary w-full"
                                    value={delivery.address.city}
                                    onChange={e => setDelivery({ ...delivery, address: { ...delivery.address, city: e.target.value } })}
                                />
                                <input
                                    placeholder="Pincode"
                                    className="bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary w-full"
                                    value={delivery.address.pincode}
                                    onChange={e => setDelivery({ ...delivery, address: { ...delivery.address, pincode: e.target.value } })}
                                />
                            </div>
                        </div>

                        {/* Time Slot Section */}
                        <div className="space-y-6">
                            {(config.mealType === 'both' || config.mealType === 'lunch') && (
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">Preferred Lunch Time</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM'].map(time => (
                                            <button
                                                key={time}
                                                onClick={() => setDelivery({ ...delivery, lunchTime: time })}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${delivery.lunchTime === time ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(config.mealType === 'both' || config.mealType === 'dinner') && (
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">Preferred Dinner Time</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'].map(time => (
                                            <button
                                                key={time}
                                                onClick={() => setDelivery({ ...delivery, dinnerTime: time })}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${delivery.dinnerTime === time ? 'bg-[#111716] text-white border-[#111716]' : 'bg-white text-gray-600 border-gray-200 hover:border-black/50'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setSteps(1)} className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                                Back
                            </button>
                            <button onClick={() => setSteps(3)} className="flex-1 py-4 bg-[#111716] text-white rounded-xl font-bold text-lg hover:bg-black transition-colors shadow-xl">
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Payment */}
                {steps === 3 && (
                    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                        <div>
                            <h2 className="text-xl font-bold text-[#2D241E] mb-6">Select Payment Method</h2>
                            <div className="space-y-4">
                                <div className="border border-orange-200 bg-orange-50 rounded-xl p-4 flex items-center gap-4 cursor-pointer ring-1 ring-primary">
                                    <div className="size-6 rounded-full border-4 border-primary bg-white"></div>
                                    <div className="flex-1">
                                        <p className="font-bold text-[#2D241E]">UPI / QR Code</p>
                                        <p className="text-xs text-[#5C4D42]">Instant payment via GPay, PhonePe</p>
                                    </div>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png" className="h-4 opacity-70" alt="UPI" />
                                </div>
                                <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 cursor-pointer opacity-50">
                                    <div className="size-6 rounded-full border-2 border-gray-300 bg-white"></div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-500">Credit / Debit Card</p>
                                        <p className="text-xs text-gray-400">Unavailable momentarily</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setSteps(2)} className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                                Back
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="flex-1 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-[#e05d00] transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Processing Payment...
                                    </>
                                ) : (
                                    `Pay ₹${calculateTotal()}`
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Success */}
                {steps === 4 && (
                    <div className="text-center py-10">
                        <div className="size-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-[scaleIn_0.5s_ease-out]">
                            <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
                        </div>
                        <h2 className="text-3xl font-black text-[#2D241E] mb-2">Subscription Activated!</h2>
                        <div className="bg-orange-50 p-4 rounded-xl max-w-sm mx-auto mb-8 border border-orange-100">
                            <p className="text-sm font-bold text-primary mb-1">Delivering to:</p>
                            <p className="text-xs text-[#5C4D42] truncate">{delivery.address.street || 'Your Location'}, {delivery.address.city}</p>
                            <div className="flex justify-center gap-4 mt-3">
                                {config.mealType !== 'dinner' && <span className="text-xs font-bold text-gray-600 px-2 py-1 bg-white rounded-lg border">Lunch: {delivery.lunchTime}</span>}
                                {config.mealType !== 'lunch' && <span className="text-xs font-bold text-gray-600 px-2 py-1 bg-white rounded-lg border">Dinner: {delivery.dinnerTime}</span>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button onClick={() => navigate('/customer/dashboard')} className="w-full py-4 bg-[#111716] text-white rounded-xl font-bold shadow-xl hover:-translate-y-0.5 transition-transform">
                                Go to Dashboard
                            </button>
                            <button onClick={() => navigate('/customer/menu')} className="w-full py-4 bg-white border border-gray-200 text-[#2D241E] rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                View Today's Menu
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionCheckout;

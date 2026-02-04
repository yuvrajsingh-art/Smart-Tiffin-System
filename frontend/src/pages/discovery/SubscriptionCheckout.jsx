import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/UserContext';
import PaymentModal from '../../components/common/PaymentModal';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    CheckoutSummary,
    CheckoutStepIndicator,
    StepCustomization,
    StepAddons,
    StepDelivery,
    StepPayment
} from '../../components/discovery';

const SubscriptionCheckout = () => {
    const { id: providerId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { buySubscription, hasActiveSubscription } = useSubscription();
    const { user } = useAuth();

    const [provider, setProvider] = useState(null);
    const [loadingProvider, setLoadingProvider] = useState(true);

    const planType = searchParams.get('plan') || 'monthly';
    const planName = planType === 'monthly' ? 'Monthly Complete' : 'Weekly Trial';

    // Use provider pricing if available, else fallback to defaults
    const basePrice = provider
        ? (planType === 'monthly' ? provider.monthlyPrice : provider.weeklyPrice)
        : (planType === 'monthly' ? 3500 : 900);

    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

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
        address: { street: '', city: user?.city || '', pincode: user?.pincode || '' },
        lunchTime: '12:30 PM',
        dinnerTime: '08:30 PM',
        phone: user?.mobile || ''
    });

    // Calculations
    const getBasePrice = () => {
        if (config.mealType === 'both') return basePrice;
        return Math.round(basePrice * 0.6);
    };

    const getAddonsTotal = () => {
        let total = 0;
        // Cost of addons (Adjusted for Plan Type)
        const isWeekly = planType === 'weekly';
        const multiplier = isWeekly ? (7 / 30) : 1;

        if (addons.extraRoti) total += Math.round(addons.extraRoti * 150 * multiplier);
        if (addons.extraRice) total += Math.round(addons.extraRice * 200 * multiplier);
        if (addons.curd) total += Math.round(300 * multiplier);
        return total;
    };

    const grandTotal = getBasePrice() + getAddonsTotal();

    const handlePayment = () => {
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async (details) => {
        setIsProcessing(true);

        const subscriptionData = {
            providerId,
            planName,
            totalAmount: grandTotal,
            durationInDays: planType === 'weekly' ? 7 : 30,
            startDate: config.startDate,
            mealType: config.mealType,
            lunchTime: delivery.lunchTime,
            dinnerTime: delivery.dinnerTime,
            deliveryAddress: {
                ...delivery.address,
                phone: delivery.phone
            },
            planType: 'veg' // Mapping to model's category/planType
        };

        try {
            const result = await buySubscription(subscriptionData);
            if (result.success) {
                toast.success("Subscription activated!");
                setCurrentStep(5);
            } else {
                toast.error(result.message || "Payment failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAutoDetect = () => {
        if (user) {
            setDelivery(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    street: user.address || '',
                    city: user.city || '',
                    pincode: user.pincode || ''
                },
                phone: user.mobile || ''
            }));
            if (!user.address) toast('Please add address in your profile first');
        } else {
            toast.error("Please login to use this feature");
        }
    };

    // Fetch provider details for timings
    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const { data } = await axios.get(`/api/discovery/mess/${providerId}`);
                if (data.success) {
                    setProvider(data.data);
                    setDelivery(prev => ({
                        ...prev,
                        lunchTime: data.data.timings.lunch.split(' - ')[0],
                        dinnerTime: data.data.timings.dinner.split(' - ')[0]
                    }));
                }
            } catch (error) {
                console.error("Error fetching provider:", error);
                toast.error("Failed to load mess timings");
            } finally {
                setLoadingProvider(false);
            }
        };
        fetchProvider();
    }, [providerId]);

    // PREVENT RENDER IF UNSUBSCRIBED TO AVOID FLASH (Better to have loading state)
    // Removed hasActiveSubscription check for now or handle it better - 
    // Actually letting user access this page even if subscribed might be confusing, keeping check but improving UI
    if (hasActiveSubscription()) {
        return (
            <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 animate-[fadeIn_0.5s_ease-out]">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center border border-white/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>

                    <div className="size-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <span className="material-symbols-outlined text-5xl text-orange-500">warning</span>
                    </div>

                    <h2 className="text-2xl font-black text-[#2D241E] mb-2">Active Subscription Found</h2>
                    <p className="text-[#5C4D42] font-medium text-sm mb-8 leading-relaxed">
                        You already have an active meal plan. Please cancel your current subscription before purchasing a new one.
                    </p>

                    <button
                        onClick={() => navigate('/customer/dashboard')}
                        className="w-full py-4 bg-[#2D241E] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        Manage My Subscription
                    </button>
                </div>
            </div>
        );
    }

    // Render Steps
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <StepCustomization config={config} setConfig={setConfig} onNext={() => setCurrentStep(2)} />;
            case 2:
                return <StepAddons addons={addons} setAddons={setAddons} onBack={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} />;
            case 3:
                return <StepDelivery delivery={delivery} setDelivery={setDelivery} config={config} provider={provider} handleAutoDetect={handleAutoDetect} onBack={() => setCurrentStep(2)} onNext={() => setCurrentStep(4)} />;
            case 4:
                return <StepPayment isProcessing={isProcessing} onBack={() => setCurrentStep(3)} onPay={handlePayment} grandTotal={grandTotal} />;
            case 5: // Success
                return (
                    <div className="text-center py-8 animate-[scaleIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 animate-pulse"></div>
                            <div className="size-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                                <span className="material-symbols-outlined text-5xl text-white">check_circle</span>
                            </div>
                        </div>

                        <h2 className="text-3xl font-black text-[#2D241E] mb-2 tracking-tight">You're Awesome! 🎉</h2>
                        <p className="text-[#5C4D42] font-medium text-sm mb-8 max-w-xs mx-auto">
                            Your subscription has been activated. <br /> Get ready for some delicious food!
                        </p>

                        <button onClick={() => navigate('/customer/dashboard')} className="w-full py-4 bg-[#2D241E] text-white rounded-[1.2rem] font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2">
                            Go to My Dashboard <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-start justify-center relative">

                {/* Background Blobs */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 opacity-60">
                    <div className="blob w-[500px] h-[500px] bg-primary/5 top-0 left-0 blur-3xl"></div>
                </div>

                {/* Left: Summary */}
                <CheckoutSummary
                    planName={planName}
                    config={config}
                    addons={addons}
                    priceBreakdown={{ basePrice: getBasePrice(), grandTotal }}
                />

                {/* Right: Steps Content */}
                <div className="flex-1 w-full max-w-[500px]">
                    {currentStep < 5 && (
                        <CheckoutStepIndicator currentStep={currentStep} />
                    )}

                    <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] shadow-xl border-white/80 relative overflow-hidden min-h-[450px] flex flex-col justify-center bg-white/70 backdrop-blur-3xl ring-1 ring-white/50">
                        {renderStepContent()}
                    </div>
                </div>

            </div>
            {/* Payment Modal Integration */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                amount={grandTotal}
                onSuccess={handlePaymentSuccess}
                title={`Subscribe to ${planName}`}
            />

        </div>
    );
};

export default SubscriptionCheckout;

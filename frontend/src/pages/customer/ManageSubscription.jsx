import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSubscription } from '../../context/SubscriptionContext';

// Modular Components
import SubscriptionCalendar from '../../components/customer/manage-subscription/SubscriptionCalendar';
import PlanInfoCards from '../../components/customer/manage-subscription/PlanInfoCards';
import SubscriptionModals from '../../components/customer/manage-subscription/SubscriptionModals';
import PaymentModal from '../../components/common/PaymentModal';

const ManageSubscription = () => {
    const { hasActiveSubscription, subscription, fetchSubscription } = useSubscription();
    const navigate = useNavigate();

    // Calendar & Selection Logic
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const [selectedDays, setSelectedDays] = useState([]);
    const [loadingPause, setLoadingPause] = useState(false);

    // Modals State
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successData, setSuccessData] = useState({ title: '', sub: '' });

    // Upgrade State
    const [upgradeAmount, setUpgradeAmount] = useState(0);
    const [selectedUpgradePlan, setSelectedUpgradePlan] = useState(null);

    useEffect(() => {
        if (subscription?.pausedDates) {
            const pausedDayNumbers = subscription.pausedDates.map(dateStr => new Date(dateStr).getDate());
            setSelectedDays(pausedDayNumbers);
        }
    }, [subscription]);

    const toggleDay = (day) => {
        if (day < today.getDate() && today.getMonth() === new Date().getMonth()) return;
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleCancelSubscription = async () => {
        try {
            const { data } = await axios.put('/api/customer/subscription/cancel', {
                reason: 'User requested cancellation'
            });
            if (data.success) {
                setShowCancelModal(false);
                setSuccessData({ title: 'Subscription Cancelled', sub: 'Refund initiated to wallet.' });
                setShowSuccessModal(true);
                fetchSubscription();
            }
        } catch (error) {
            console.error("Cancellation failed:", error);
            setShowCancelModal(false);
        }
    };

    const handlePaymentSuccess = async (details) => {
        try {
            const { data } = await axios.put('/api/customer/subscription/upgrade', {
                newPlanName: selectedUpgradePlan?.name || 'Premium Non-Veg'
            });
            if (data.success) {
                setShowPaymentModal(false);
                setSuccessData({ title: 'Plan Upgraded!', sub: 'Successfully upgraded your plan.' });
                setShowSuccessModal(true);
                fetchSubscription();
            }
        } catch (error) {
            console.error("Upgrade failed:", error);
            setShowPaymentModal(false);
        }
    };

    if (!hasActiveSubscription()) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-[fadeIn_0.5s_ease-out] px-4">
                <div className="size-24 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-4xl text-gray-400">lock</span>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#2D241E]">Feature Locked</h2>
                    <p className="text-[#5C4D42] mt-2 max-w-md mx-auto font-medium">You need an active subscription to manage your plan.</p>
                </div>
                <Link to="/customer/find-mess" className="px-8 py-3 bg-[#2D241E] text-white rounded-xl font-bold shadow-lg">Find a Mess</Link>
            </div>
        );
    }

    return (
        <div className="w-full pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="blob blob-1 blob-primary opacity-20"></div>
                <div className="blob blob-2 blob-secondary opacity-20"></div>
            </div>

            <div className="flex flex-col gap-1 mb-6 pt-4 max-w-5xl mx-auto">
                <Link to="/customer/dashboard" className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1 w-fit">
                    <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Dashboard
                </Link>
                <h1 className="text-xl font-black text-[#2D241E]">Manage Subscription</h1>
            </div>

            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                <PlanInfoCards
                    selectedDaysCount={selectedDays.length}
                    onUpgrade={() => setShowUpgradeModal(true)}
                    onCancel={() => setShowCancelModal(true)}
                    expiryDate={subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}
                />

                <SubscriptionCalendar
                    days={days}
                    today={today}
                    selectedDays={selectedDays}
                    toggleDay={toggleDay}
                />
            </div>

            <SubscriptionModals
                showCancelModal={showCancelModal}
                setShowCancelModal={setShowCancelModal}
                handleCancelSubscription={handleCancelSubscription}
                showUpgradeModal={showUpgradeModal}
                setShowUpgradeModal={setShowUpgradeModal}
                initiateUpgradePayment={(amt) => { setUpgradeAmount(amt); setShowUpgradeModal(false); setShowPaymentModal(true); }}
                showSuccessModal={showSuccessModal}
                setShowSuccessModal={setShowSuccessModal}
                successData={successData}
            />

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                amount={upgradeAmount}
                onSuccess={handlePaymentSuccess}
                title="Pay for Upgrade"
            />
        </div>
    );
};

export default ManageSubscription;

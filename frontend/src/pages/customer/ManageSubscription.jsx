import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/UserContext';
import { toast } from 'react-hot-toast';

// Modular Components
import SubscriptionCalendar from '../../components/customer/manage-subscription/SubscriptionCalendar';
import PlanInfoCards from '../../components/customer/manage-subscription/PlanInfoCards';
import SubscriptionModals from '../../components/customer/manage-subscription/SubscriptionModals';
import PaymentModal from '../../components/common/PaymentModal';

const ManageSubscription = () => {
    const { hasActiveSubscription, subscription, fetchSubscription } = useSubscription();
    const { user } = useAuth();
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

    const handlePauseSubscription = async () => {
        setLoadingPause(true);
        try {
            // Convert selected day numbers back to dates for the current month
            const year = today.getFullYear();
            const month = today.getMonth();

            const pausedDates = selectedDays.map(day => {
                const date = new Date(year, month, day);
                // Adjust for timezone offset to avoid previous day issues
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                return date.toISOString().split('T')[0];
            });

            const { data } = await axios.put('/api/customer/subscription/pause', {
                pausedDates
            });

            if (data.success) {
                setSuccessData({
                    title: 'Subscription Updated',
                    sub: data.data.message || 'Your schedule has been updated.'
                });
                setShowSuccessModal(true);
                fetchSubscription();
            }
        } catch (error) {
            console.error("Pause update failed:", error);
            const msg = error.response?.data?.message || "Failed to update subscription";
            // Use toast
            toast.error(msg);
        } finally {
            setLoadingPause(false);
        }
    };

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
                planId: selectedUpgradePlan?.id, // Send ID, not name
                paymentDetails: details
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
                <div className="flex justify-between items-end">
                    <div>
                        <Link to="/customer/dashboard" className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1 w-fit">
                            <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Dashboard
                        </Link>
                        <h1 className="text-xl font-black text-[#2D241E]">Manage Subscription</h1>
                    </div>
                    <Link to="/customer/history" className="text-xs font-bold text-[#5C4D42] bg-white/50 hover:bg-white px-3 py-2 rounded-xl border border-white/60 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">history</span>
                        View History
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                <PlanInfoCards
                    selectedDaysCount={selectedDays.length}
                    onUpgrade={() => setShowUpgradeModal(true)}
                    onCancel={() => setShowCancelModal(true)}
                    onSave={handlePauseSubscription}
                    expiryDate={subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}
                    loading={loadingPause}
                />

                <SubscriptionCalendar
                    days={days}
                    today={today}
                    selectedDays={selectedDays}
                    toggleDay={toggleDay}
                    isCutoffExceeded={new Date().getHours() >= 20}
                />
            </div>

            <SubscriptionModals
                showCancelModal={showCancelModal}
                setShowCancelModal={setShowCancelModal}
                handleCancelSubscription={handleCancelSubscription}
                showUpgradeModal={showUpgradeModal}
                setShowUpgradeModal={setShowUpgradeModal}
                initiateUpgradePayment={(amt, plan) => {
                    setUpgradeAmount(amt);
                    setSelectedUpgradePlan(plan);
                    setShowUpgradeModal(false);
                    setShowPaymentModal(true);
                }}
                showSuccessModal={showSuccessModal}
                setShowSuccessModal={setShowSuccessModal}
                successData={successData}
                upgradePlans={subscription?.upgradePlans || []}
            />

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                amount={upgradeAmount}
                onSuccess={handlePaymentSuccess}
                title="Pay for Upgrade"
                showWallet={true}
                walletBalance={user?.walletBalance || 0}
                showPayLater={true}
            />
        </div>
    );
};

export default ManageSubscription;

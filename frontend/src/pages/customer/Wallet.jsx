import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
    PaymentModal,
    BackgroundBlobs,
    PageHeader
} from '../../components/common';
import {
    WalletBalanceCard,
    WalletTransactionList,
    PinModal,
    WalletSettingsModal,
    SpendingChart,
    SavingsMeter
} from '../../components/customer';
import { WalletSkeleton } from '../../components/common';

const Wallet = () => {
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [bankData, setBankData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [isPinSet, setIsPinSet] = useState(false);
    const [settings, setSettings] = useState(null);
    const [stats, setStats] = useState({ chartData: [], totalSavings: 0 });
    const [amountToAdd, setAmountToAdd] = useState('');

    const fetchWalletDetails = async () => {
        try {
            const { data } = await axios.get('/api/customer/wallet');
            if (data.success) {
                setBalance(data.data.balance || 0);
                setBankData(data.data.bank || null);
                setTransactions(data.data.transactions || []);
                setIsPinSet(data.data.isPinSet || false);
                setSettings(data.data.settings || null);
            }
        } catch (error) {
            console.error("Failed to fetch wallet contents:", error);
            toast.error("Failed to load wallet. Please refresh.", { duration: 3000 });
        } finally {
            setLoading(false);
        }
    };


    const fetchWalletStats = async () => {
        try {
            const { data } = await axios.get('/api/customer/wallet/stats');
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch wallet stats:", error);
        }
    };

    useEffect(() => {
        fetchWalletDetails();
        fetchWalletStats();
    }, []);

    const handleUpdateSettings = async (newSettings) => {
        const toastId = toast.loading('Updating settings...');
        try {
            const { data } = await axios.post('/api/customer/wallet/update-settings', newSettings);
            if (data.success) {
                setSettings(data.data);
                toast.success('Settings updated!', { id: toastId });
                setShowSettingsModal(false);
            }
        } catch (error) {
            toast.error('Failed to update settings', { id: toastId });
        }
    };

    const [pinFlow, setPinFlow] = useState('verify');
    const [oldPinValue, setOldPinValue] = useState('');

    const handleSetPin = async (pinValue) => {
        try {
            if (isPinSet && pinFlow === 'verify') {
                await axios.post('/api/customer/wallet/verify-pin', { pin: pinValue });
                setOldPinValue(pinValue);
                setPinFlow('set');
                toast.success("Now enter your new PIN");
                return;
            }

            const { data } = await axios.post('/api/customer/wallet/set-pin', {
                pin: pinValue,
                oldPin: isPinSet ? oldPinValue : undefined
            });

            if (data.success) {
                setIsPinSet(true);
                toast.success(isPinSet ? 'PIN updated successfully!' : 'PIN set successfully!');
                setShowPinModal(false);
                setPinFlow('verify');
                setOldPinValue('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
            if (pinFlow === 'verify') throw new Error("Incorrect current PIN");
        }
    };

    const handleAddMoneySuccess = async (details) => {
        const toastId = toast.loading('Processing transaction...');
        try {
            const { data } = await axios.post('/api/customer/wallet/add-money', {
                amount: parseFloat(details.totalAmount),
                transactionId: details.transactionId
            });

            if (data.success) {
                setBalance(data.data.newBalance);
                fetchWalletDetails();
                toast.success('Funds added successfully!', { id: toastId });
                setShowAddMoneyModal(false);
                setAmountToAdd('');
            }
        } catch (error) {
            console.error("Failed to add money:", error);
            toast.error(error.response?.data?.message || 'Transaction failed. Please try again.', { id: toastId });
            // Do NOT close modal on error so user can retry? 
            // Current PaymentModal logic closes it immediately before calling onSuccess.
            // So we can't keep it open easily without refactoring PaymentModal.
            setShowAddMoneyModal(false);
        }
    };

    const handleExportStatement = async () => {
        try {
            const response = await axios.get('/api/customer/wallet/statement?format=pdf', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `wallet-statement-${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('PDF Statement downloaded!');
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export statement");
        }
    };

    const quickAmounts = [100, 500, 1000, 2000];

    return (
        <div className="w-full pb-20 animate-[fadeIn_0.5s_ease-out] relative px-4">
            <BackgroundBlobs />
            <PageHeader title="My Wallet" />

            {loading ? (
                <WalletSkeleton />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <WalletBalanceCard
                            balance={balance}
                            amountToAdd={amountToAdd}
                            setAmountToAdd={setAmountToAdd}
                            onAddMoney={() => setShowAddMoneyModal(true)}
                            quickAmounts={quickAmounts}
                        />

                        {/* Security & Settings Card */}
                        <div className="glass-panel p-4 rounded-[1.5rem] border border-white/60">
                            <h3 className="text-[10px] font-black text-[#2D241E] uppercase tracking-[0.2em] mb-3">Security & Settings</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setShowPinModal(true)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/50 hover:bg-white transition-all group border border-transparent hover:border-gray-100"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className={`size-8 rounded-lg flex items-center justify-center ${isPinSet ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-primary'}`}>
                                            <span className="material-symbols-outlined text-lg">
                                                {isPinSet ? 'verified_user' : 'lock_reset'}
                                            </span>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[11px] font-black text-[#2D241E]">{isPinSet ? 'Update PIN' : 'Set PIN'}</p>
                                            <p className="text-[9px] font-medium text-gray-400">Secure transactions</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-300 text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
                                </button>

                                <button
                                    onClick={() => setShowSettingsModal(true)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/50 hover:bg-white transition-all group border border-transparent hover:border-gray-100"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="size-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-lg">settings</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[11px] font-black text-[#2D241E]">Wallet Settings</p>
                                            <p className="text-[9px] font-medium text-gray-400">Auto-recharge & Alerts</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-300 text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-4 rounded-[1.5rem] border border-white/60">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-[10px] font-black text-[#2D241E] uppercase tracking-[0.2em]">Spending Insights</h3>
                                <p className="text-[9px] font-bold text-gray-400 mt-0.5 italic">Last 7 days</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <SavingsMeter amount={stats.totalSavings} />
                                <button
                                    onClick={handleExportStatement}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#2D241E] text-white text-[10px] font-black rounded-xl hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95 group"
                                >
                                    <span className="material-symbols-outlined text-[16px] group-hover:translate-y-[-1px] transition-transform">download</span>
                                    EXPORT
                                </button>
                            </div>
                        </div>

                        <SpendingChart data={stats.chartData} />

                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100/50">
                            <div className="bg-gray-50/50 p-2 rounded-xl">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Weekly Spend</p>
                                <p className="text-sm font-black text-[#2D241E]">₹{stats.totalSpent?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div className="text-right flex flex-col justify-center gap-1">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                                <div>
                                    <span className="inline-flex items-center gap-1 text-[8px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                        <span className="size-1 bg-green-600 rounded-full animate-pulse"></span>
                                        SMART SAVER
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <WalletTransactionList transactions={transactions} />
                </div>
            )}

            <PaymentModal
                isOpen={showAddMoneyModal}
                onClose={() => setShowAddMoneyModal(false)}
                amount={parseInt(amountToAdd) || 0}
                onSuccess={handleAddMoneySuccess}
                title="Add Money to Wallet"
                initialMethod="UPI"
            />

            <PinModal
                isOpen={showPinModal}
                onClose={() => {
                    setShowPinModal(false);
                    setPinFlow('verify');
                }}
                onSuccess={handleSetPin}
                title={isPinSet ? (pinFlow === 'verify' ? "Verify Current PIN" : "Setup New PIN") : "Set Transaction PIN"}
                subtitle={isPinSet ? (pinFlow === 'verify' ? "Enter current 4-digit PIN" : "Enter new 4-digit PIN") : "Choose a 4-digit PIN for security"}
                isSetting={true}
            />

            <WalletSettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                settings={settings}
                onUpdate={handleUpdateSettings}
            />
        </div>
    );
};

export default Wallet;

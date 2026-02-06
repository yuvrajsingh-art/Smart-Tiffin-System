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
    WalletTransactionList
} from '../../components/customer';
import { WalletSkeleton } from '../../components/common';

const Wallet = () => {
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [bankData, setBankData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const [amountToAdd, setAmountToAdd] = useState('');

    const fetchWalletDetails = async () => {
        try {
            const { data } = await axios.get('/api/customer/wallet');
            if (data.success) {
                setBalance(data.data.balance || 0);
                setBankData(data.data.bank || null);
                setTransactions(data.data.transactions || []);
            }
        } catch (error) {
            console.error("Failed to fetch wallet contents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletDetails();
    }, []);

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

    const quickAmounts = [100, 500, 1000, 2000];

    return (
        <div className="w-full pb-20 animate-[fadeIn_0.5s_ease-out] relative px-4">
            <BackgroundBlobs />
            <PageHeader title="My Wallet" />

            {loading ? (
                <WalletSkeleton />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <WalletBalanceCard
                            balance={balance}
                            amountToAdd={amountToAdd}
                            setAmountToAdd={setAmountToAdd}
                            onAddMoney={() => setShowAddMoneyModal(true)}
                            quickAmounts={quickAmounts}
                        />
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
        </div>
    );
};

export default Wallet;

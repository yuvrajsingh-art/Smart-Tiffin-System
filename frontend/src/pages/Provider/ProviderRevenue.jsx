import { useState, useEffect } from 'react';
import ProviderSidebar from '../../components/ui/Provider/ProviderSidebar';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import RevenueStats from '../../components/ui/Provider/Revenue/RevenueStats';
import RevenueChart from '../../components/ui/Provider/Revenue/RevenueChart';
import TransactionList from '../../components/ui/Provider/Revenue/TransactionList';
import ProviderApi from '../../services/ProviderApi';

function ProviderRevenue() {
    const [timeRange, setTimeRange] = useState('week');
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [revenueData, setRevenueData] = useState({
        totalRevenue: 0,
        todayRevenue: 0,
        weekRevenue: 0,
        monthRevenue: 0,
        growth: 0,
        transactions: []
    });

    useEffect(() => {
        fetchRevenueData();
    }, [timeRange]);

    const fetchRevenueData = async () => {
        try {
            const [walletRes, transactionsRes] = await Promise.all([
                ProviderApi.get('/provider-wallet/summary'),
                ProviderApi.get('/provider-wallet/transactions?limit=10')
            ]);
            
            const wallet = walletRes.data?.data || {};
            const transactions = transactionsRes.data?.data || [];
            
            const formattedTransactions = transactions.map(txn => ({
                id: txn._id,
                customer: txn.referenceId || 'N/A',
                amount: Math.abs(txn.amount),
                status: txn.status.toLowerCase(),
                date: new Date(txn.date).toLocaleDateString('en-IN'),
                time: new Date(txn.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            }));
            
            setRevenueData({
                totalRevenue: wallet.totalEarnings || 0,
                todayRevenue: wallet.withdrawableBalance || 0,
                weekRevenue: (wallet.totalEarnings || 0) * 0.3,
                monthRevenue: wallet.totalEarnings || 0,
                growth: wallet.monthlyChange || 0,
                transactions: formattedTransactions
            });
        } catch (error) {
            console.error('Error fetching revenue:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#FFFBF5]">
            <ProviderSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col">
                <ProviderHeader
                    title="Revenue Management"
                    subtitle="Track your earnings and transactions"
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTimeRange('week')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    timeRange === 'week'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                This Week
                            </button>
                            <button
                                onClick={() => setTimeRange('month')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    timeRange === 'month'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                This Month
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                        </div>
                    ) : (
                        <>
                            <RevenueStats revenueData={revenueData} timeRange={timeRange} />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <RevenueChart revenueData={revenueData} timeRange={timeRange} />
                                <TransactionList transactions={revenueData.transactions} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProviderRevenue;

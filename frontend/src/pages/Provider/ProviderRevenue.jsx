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
        transactions: [],
        chartData: []
    });

    useEffect(() => {
        fetchRevenueData();
    }, [timeRange]);

    const fetchRevenueData = async () => {
        try {
            const [walletRes, transactionsRes] = await Promise.all([
                ProviderApi.get('/provider-wallet/summary'),
                ProviderApi.get('/provider-wallet/transactions?limit=100')
            ]);
            
            const wallet = walletRes.data?.data || {};
            const transactions = transactionsRes.data?.data || [];
            
            console.log('=== API Response ===');
            console.log('Wallet:', wallet);
            console.log('Transactions:', transactions);
            console.log('Sample Transaction:', transactions[0]);
            
            const formattedTransactions = transactions.slice(0, 10).map(txn => ({
                id: txn._id,
                customer: txn.referenceId || 'N/A',
                amount: Math.abs(txn.amount),
                status: txn.status.toLowerCase(),
                date: new Date(txn.date).toLocaleDateString('en-IN'),
                time: new Date(txn.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            }));
            
            // Generate chart data from actual transactions
            const chartData = timeRange === 'week' 
                ? generateWeeklyDataFromTransactions(transactions)
                : generateMonthlyDataFromTransactions(transactions);
            
            console.log('Chart Data:', chartData);
            
            // Calculate actual week revenue from transactions
            const weekRevenue = calculateWeekRevenue(transactions);
            
            setRevenueData({
                totalRevenue: wallet.totalEarnings || 0,
                todayRevenue: wallet.withdrawableBalance || 0,
                weekRevenue: weekRevenue,
                monthRevenue: wallet.totalEarnings || 0,
                growth: wallet.monthlyChange || 0,
                transactions: formattedTransactions,
                chartData: chartData
            });
        } catch (error) {
            console.error('Error fetching revenue:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateWeekRevenue = (transactions) => {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1);
        
        let weekTotal = 0;
        transactions.forEach(txn => {
            const txnDate = new Date(txn.date || txn.createdAt);
            if (txnDate >= weekStart && txnDate <= today) {
                if (txn.status === 'Success' || txn.status === 'Completed') {
                    weekTotal += Math.abs(txn.amount);
                }
            }
        });
        
        return weekTotal;
    };

    const generateWeeklyDataFromTransactions = (transactions) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1);
        
        const dailyRevenue = {};
        days.forEach(day => dailyRevenue[day] = 0);
        
        console.log('=== Weekly Revenue Calculation ===');
        console.log('Week Start:', weekStart);
        console.log('Today:', today);
        console.log('Total Transactions:', transactions.length);
        
        transactions.forEach(txn => {
            const txnDate = new Date(txn.date || txn.createdAt);
            if (txnDate >= weekStart && txnDate <= today) {
                const dayIndex = txnDate.getDay();
                const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1];
                const amount = Math.abs(txn.amount);
                
                console.log(`Transaction on ${txnDate.toDateString()} (${dayName}): ₹${amount}, Status: ${txn.status}`);
                
                // Only count successful transactions
                if (txn.status === 'Success' || txn.status === 'Completed') {
                    dailyRevenue[dayName] += amount;
                }
            }
        });
        
        console.log('Daily Revenue:', dailyRevenue);
        
        return days.map(day => ({
            label: day,
            amount: Math.round(dailyRevenue[day]),
            percentage: 0
        }));
    };

    const generateMonthlyDataFromTransactions = (transactions) => {
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const weeklyRevenue = [0, 0, 0, 0];
        
        transactions.forEach(txn => {
            const txnDate = new Date(txn.date || txn.createdAt);
            if (txnDate >= monthStart && txnDate <= today) {
                const weekIndex = Math.min(Math.floor((txnDate.getDate() - 1) / 7), 3);
                if (txn.status === 'Success' || txn.status === 'Completed') {
                    weeklyRevenue[weekIndex] += Math.abs(txn.amount);
                }
            }
        });
        
        return weeks.map((week, index) => ({
            label: week,
            amount: Math.round(weeklyRevenue[index]),
            percentage: 0
        }));
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

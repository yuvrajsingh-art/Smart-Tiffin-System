import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/UserContext';
import {
    BackgroundBlobs,
    PageHeader
} from '../../components/common';
import {
    HistoryStats,
    HistoryList,
    InvoiceModal,
    MealTicketModal,
    ReportIssueModal
} from '../../components/customer';
import { HistorySkeleton } from '../../components/common';

const History = () => {
    const { hasActiveSubscription } = useSubscription();
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('Meals');
    const [filter, setFilter] = useState('All');

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        Meals: [],
        Transactions: [],
        Plans: []
    });

    const [stats, setStats] = useState({
        Meals: [],
        Transactions: [],
        Plans: []
    });

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [reportOrder, setReportOrder] = useState(null);
    const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));

    const fetchData = async (tab, currentFilter) => {
        if (!token) return;
        setLoading(true);
        try {
            const endpointMap = {
                'Meals': `/api/customer/history/meals${currentFilter !== 'All' ? `?filter=${currentFilter}` : ''}`,
                'Transactions': '/api/customer/history/wallet',
                'Plans': '/api/customer/history/plans'
            };

            const res = await axios.get(endpointMap[tab], {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                const fetchedData = res.data.data;
                setData(prev => ({
                    ...prev,
                    [tab]: tab === 'Meals' ? fetchedData.mealsHistory :
                        tab === 'Transactions' ? fetchedData.walletHistory :
                            fetchedData.plansHistory
                }));
                setStats(prev => ({
                    ...prev,
                    [tab]: fetchedData.stats
                }));
            }
        } catch (error) {
            console.error(`Error fetching ${tab} history`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasActiveSubscription()) {
            fetchData(activeTab, filter);
        }
    }, [activeTab, filter, token, hasActiveSubscription]);

    if (!hasActiveSubscription()) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-[fadeIn_0.5s_ease-out] px-4">
                <BackgroundBlobs />
                <div className="size-24 bg-gray-100 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-transparent"></div>
                    <span className="material-symbols-outlined text-4xl text-gray-400 relative z-10">lock</span>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#2D241E]">History Locked</h2>
                    <p className="text-[#5C4D42] mt-2 max-w-md mx-auto font-medium leading-relaxed">
                        Order history and transaction logs are only available for active subscribers.
                    </p>
                </div>
                <Link to="/customer/find-mess" className="px-8 py-3 bg-[#111716] text-white rounded-xl font-bold shadow-xl hover:scale-105 transition-all">
                    Find a Mess
                </Link>
            </div>
        );
    }

    const tabs = [
        { name: 'Meals', icon: 'restaurant_menu' },
        { name: 'Transactions', icon: 'receipt_long' },
        { name: 'Plans', icon: 'settings_suggest' }
    ];

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">
            <BackgroundBlobs />
            <PageHeader title="Activity History" />

            <div className="flex p-1.5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl mb-8 max-w-md shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => { setActiveTab(tab.name); setFilter('All'); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-300 ${activeTab === tab.name
                            ? 'bg-[#2D241E] text-white shadow-lg'
                            : 'text-[#5C4D42] hover:bg-white/50'
                            }`}
                    >
                        <span className="material-symbols-outlined text-base">{tab.icon}</span>
                        {tab.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <HistorySkeleton />
            ) : (
                <div className="space-y-4">
                    <HistoryStats stats={stats[activeTab]} />

                    <div className="flex justify-between items-center mb-6 px-2">
                        <h2 className="font-black text-[#2D241E] opacity-30 uppercase tracking-[0.2em] text-[10px]">
                            Recent {activeTab} Activity
                        </h2>
                        <div className="flex items-center gap-3">
                            {activeTab === 'Transactions' && (
                                <button
                                    onClick={async () => {
                                        try {
                                            const response = await axios.get('/api/customer/wallet/statement?format=pdf', {
                                                responseType: 'blob',
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            const url = window.URL.createObjectURL(new Blob([response.data]));
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.setAttribute('download', `wallet-statement-${Date.now()}.pdf`);
                                            document.body.appendChild(link);
                                            link.click();
                                            link.remove();
                                            toast.success('PDF Statement exported!');
                                        } catch (error) {
                                            console.error("Export failed:", error);
                                            toast.error("Failed to export statements");
                                        }
                                    }}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#2D241E] text-white text-[10px] font-black rounded-xl hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95 group"
                                >
                                    <span className="material-symbols-outlined text-[16px] group-hover:translate-y-[-1px] transition-transform">download</span>
                                    EXPORT
                                </button>
                            )}
                            {activeTab === 'Meals' && (
                                <div className="flex gap-2 p-1 bg-white/40 rounded-full border border-white/60">
                                    {['All', 'Delivered', 'Skipped'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${filter === f
                                                ? 'bg-primary text-white shadow-md'
                                                : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <HistoryList
                        activeTab={activeTab}
                        data={data[activeTab]}
                        onViewInvoice={(transaction) => setSelectedTransaction(transaction)}
                        onViewMeal={(meal) => setSelectedMeal(meal)}
                    />
                </div>
            )}

            <InvoiceModal
                isOpen={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                transaction={selectedTransaction}
                user={user}
            />

            <MealTicketModal
                isOpen={!!selectedMeal}
                onClose={() => setSelectedMeal(null)}
                meal={selectedMeal}
                onReportIssue={() => {
                    const meal = selectedMeal;
                    setSelectedMeal(null); // Close ticket modal
                    // Open report modal (need state for it)
                    // We need to add state for report modal:
                    // [reportOrder, setReportOrder] = useState(null)
                    setReportOrder(meal);
                }}
            />

            {/* We need to add ReportIssueModal here and state at top */}
            <ReportIssueModal
                isOpen={!!reportOrder}
                onClose={() => setReportOrder(null)}
                order={reportOrder}
                onSuccess={() => fetchData(activeTab, filter)}
            />
        </div>
    );
};

export default History;


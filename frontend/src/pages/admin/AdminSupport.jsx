import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const AdminSupport = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/feedbacks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setFeedbacks(res.data.data);
            }
        } catch (err) {
            console.error('Fetch Feedbacks Error:', err);
            setFeedbacks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesSearch = searchQuery === '' || 
            f.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.provider?.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (filter === 'All') return matchesSearch;
        if (filter === 'Low') return matchesSearch && f.rating <= 2;
        if (filter === 'Medium') return matchesSearch && f.rating === 3;
        if (filter === 'High') return matchesSearch && f.rating >= 4;
        return matchesSearch;
    });

    const stats = {
        total: feedbacks.length,
        low: feedbacks.filter(f => f.rating <= 2).length,
        medium: feedbacks.filter(f => f.rating === 3).length,
        high: feedbacks.filter(f => f.rating >= 4).length,
        avgRating: feedbacks.length > 0 ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : 0
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-[#2D241E] tracking-tight uppercase">Customer Feedback</h1>
                    <p className="text-[#897a70] text-xs font-bold uppercase tracking-wider opacity-60">
                        Monitor customer satisfaction and reviews
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/60 backdrop-blur-md">
                    <div className="relative group">
                        <span className="absolute left-3 top-2.5 material-symbols-outlined text-[18px] text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-[10px] font-bold text-[#2D241E] p-2.5 pl-9 w-32 focus:w-48 transition-all"
                        />
                    </div>
                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                    <div className="flex gap-1">
                        {['All', 'Low', 'Medium', 'High'].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === t ? 'bg-[#2D241E] text-white' : 'text-[#897a70] hover:bg-white'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                    { l: 'Total Feedback', v: stats.total, c: 'blue', i: 'rate_review' },
                    { l: 'Low Rating', v: stats.low, c: 'red', i: 'sentiment_dissatisfied' },
                    { l: 'Medium Rating', v: stats.medium, c: 'yellow', i: 'sentiment_neutral' },
                    { l: 'High Rating', v: stats.high, c: 'green', i: 'sentiment_satisfied' },
                    { l: 'Avg Rating', v: stats.avgRating, c: 'purple', i: 'star' },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-5 rounded-[2.5rem] border border-white/60 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform">
                        <div>
                            <p className="text-xs font-bold text-[#5C4D42]/60 uppercase tracking-wider">{s.l}</p>
                            <h3 className="text-2xl font-bold text-[#2D241E] mt-1">{s.v}</h3>
                        </div>
                        <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <span className={`material-symbols-outlined text-2xl text-${s.c}-500`}>{s.i}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/50 sticky top-0">
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase">Customer</th>
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase">Provider</th>
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase">Rating</th>
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase">Feedback</th>
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50">
                            {loading ? (
                                <tr><td colSpan="5"><SkeletonLoader type="table-row" count={5} /></td></tr>
                            ) : filteredFeedbacks.length > 0 ? (
                                filteredFeedbacks.map((fb) => (
                                    <tr key={fb._id} className="hover:bg-white/80 transition-all">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-[#2D241E]">{fb.customer}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-[#2D241E]">{fb.provider}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`material-symbols-outlined text-[16px] ${i < fb.rating ? 'text-amber-400' : 'text-gray-200'}`}>star</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-gray-600 line-clamp-2">{fb.feedback || 'No comment'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-gray-500">{new Date(fb.date).toLocaleDateString()}</p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="flex flex-col items-center opacity-50">
                                            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inbox</span>
                                            <p className="text-base font-bold text-[#2D241E]">No Feedback Found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminSupport;

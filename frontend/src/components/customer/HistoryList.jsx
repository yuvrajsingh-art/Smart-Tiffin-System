import React from 'react';

const HistoryList = ({ activeTab, data, onViewInvoice, onViewMeal }) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-20 opacity-30 animate-[fadeIn_0.5s]">
                <span className="material-symbols-outlined text-5xl mb-2">history_off</span>
                <p className="text-sm font-black uppercase tracking-widest">No {activeTab} history found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activeTab === 'Meals' && data.map((item, idx) => (
                <div
                    key={item.id || idx}
                    className="group glass-panel p-4 rounded-3xl border border-white/60 flex items-center justify-between hover:bg-white transition-all cursor-pointer animate-[slideUp_0.4s_ease-out]"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                    onClick={() => onViewMeal(item)}
                >
                    <div className="flex items-center gap-4">
                        <div className={`size-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${item.status === 'Skipped' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-600'
                            } group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="font-bold text-[#2D241E] text-sm">{item.item}</h3>
                                <span className="text-[9px] font-bold text-gray-300 bg-gray-50 px-1.5 py-0.5 rounded-md">{item.orderId}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <span className="text-primary">{item.mess}</span>
                                <span className="opacity-30">•</span>
                                <span>{item.type}</span>
                                <span className="opacity-30">•</span>
                                <span>{item.date}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider outline outline-1 ${item.status === 'Skipped' ? 'bg-red-50 text-red-500 outline-red-100' : 'bg-green-50 text-green-600 outline-green-100'
                            }`}>
                            {item.status}
                        </span>
                        <button
                            onClick={(e) => { e.stopPropagation(); onViewMeal(item); }}
                            className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-gray-400 group-hover:text-primary transition-colors mt-1"
                        >
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            View Ticket
                        </button>
                    </div>
                </div>
            ))}

            {activeTab === 'Transactions' && data.map((item, idx) => (
                <div
                    key={item.id || idx}
                    className="group glass-panel p-4 rounded-3xl border border-white/60 flex items-center justify-between hover:bg-white transition-all animate-[slideUp_0.4s_ease-out] relative overflow-hidden"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className={`size-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-110 ${item.type === 'Credit' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-[#2D241E]'
                            }`}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-[#2D241E] text-sm">{item.title}</h3>
                                {item.isPending && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-yellow-100 text-yellow-700 text-[9px] font-black uppercase tracking-wider">Pending</span>
                                )}
                                {item.isFailed && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-wider">Failed</span>
                                )}
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.subtitle} • {item.date}</p>
                        </div>
                    </div>
                    <div className="text-right relative z-10 flex flex-col items-end gap-1">
                        <p className={`font-black text-lg ${item.type === 'Credit' ? 'text-green-600' : 'text-[#2D241E]'}`}>
                            {item.type === 'Credit' ? '+' : '-'}₹{item.amount.toLocaleString()}
                        </p>
                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">{item.status}</p>

                        {item.status === 'Success' && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onViewInvoice(item); }}
                                className="mt-1 flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-primary hover:text-black transition-colors"
                            >
                                <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                                Invoice
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {activeTab === 'Plans' && data.map((item, idx) => (
                <div
                    key={item.id || idx}
                    className="group glass-panel p-4 rounded-3xl border border-white/60 flex items-center justify-between hover:bg-white transition-all animate-[slideUp_0.4s_ease-out]"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                >
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[#2D241E]">{item.icon}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#2D241E] text-sm mb-0.5">{item.title}</h3>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                {item.detail} • {item.date}
                            </p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${item.status === 'Active' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-500'
                        }`}>
                        {item.status}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default HistoryList;

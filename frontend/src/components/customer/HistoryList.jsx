import React from 'react';

const HistoryList = ({ activeTab, data }) => {
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
                    className="group glass-panel p-5 rounded-[2.5rem] border border-white/60 flex items-center justify-between hover:bg-white transition-all cursor-pointer animate-[slideUp_0.4s_ease-out]"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                >
                    <div className="flex items-center gap-5">
                        <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${item.status === 'Skipped' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-600'
                            } group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-[#2D241E] text-base">{item.item}</h3>
                                <span className="text-[10px] font-bold text-gray-300">({item.orderId})</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                <span className="text-primary">{item.mess}</span>
                                <span className="opacity-30">•</span>
                                <span className="uppercase">{item.type}</span>
                                <span className="opacity-30">•</span>
                                <span>{item.date}</span>
                            </div>
                        </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider outline outline-1 ${item.status === 'Skipped' ? 'bg-red-50 text-red-500 outline-red-100' : 'bg-green-50 text-green-600 outline-green-100'
                        }`}>
                        {item.status}
                    </span>
                </div>
            ))}

            {activeTab === 'Wallet' && data.map((item, idx) => (
                <div
                    key={item.id || idx}
                    className="group glass-panel p-5 rounded-[2.5rem] border border-white/60 flex items-center justify-between hover:bg-white transition-all animate-[slideUp_0.4s_ease-out]"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                >
                    <div className="flex items-center gap-5">
                        <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${item.type === 'Credit' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-primary'
                            } group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#2D241E] text-base mb-1">{item.title}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.date}</p>
                        </div>
                    </div>
                    <p className={`font-black text-xl ${item.type === 'Credit' ? 'text-green-600' : 'text-[#2D241E]'}`}>
                        {item.type === 'Credit' ? '+' : '-'}{item.amount}
                    </p>
                </div>
            ))}

            {activeTab === 'Plans' && data.map((item, idx) => (
                <div
                    key={item.id || idx}
                    className="group glass-panel p-5 rounded-[2.5rem] border border-white/60 flex items-center justify-between hover:bg-white transition-all animate-[slideUp_0.4s_ease-out]"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                >
                    <div className="flex items-center gap-5">
                        <div className="size-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[#2D241E]">{item.icon}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#2D241E] text-base mb-1">{item.title}</h3>
                            <p className="text-xs font-bold text-gray-500 mb-1">{item.detail}</p>
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{item.date}</p>
                        </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'active' ? 'bg-green-500 text-white' : 'bg-[#2D241E] text-white'
                        }`}>
                        {item.status}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default HistoryList;

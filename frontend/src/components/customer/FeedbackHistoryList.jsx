import React from 'react';

const FeedbackHistoryList = ({ history }) => {
    const getEmoji = (r) => {
        if (r >= 5) return '😍';
        if (r >= 4) return '😊';
        if (r >= 3) return '😐';
        if (r >= 2) return '🙁';
        return '🤮';
    };

    return (
        <div className="lg:col-span-2 space-y-4">
            <h2 className="font-black text-[#2D241E] opacity-40 uppercase tracking-[0.2em] text-[10px] px-2">
                Recent Feedbacks
            </h2>
            {history.length > 0 ? (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                    {history.map(item => (
                        <div key={item.id} className="glass-panel p-5 rounded-[2rem] border border-white/60 hover:bg-white transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-lg">
                                        {getEmoji(item.rating)}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[#2D241E] text-sm">{item.meal}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{item.date}</p>
                                    </div>
                                </div>
                                <div className="flex text-amber-400">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-sm fill-1">star</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs font-medium text-[#5C4D42] mb-3 leading-relaxed">"{item.comment}"</p>

                            {item.response && (
                                <div className="mt-2 mb-3 bg-orange-50/50 p-3 rounded-xl border border-orange-100 flex gap-2 items-start">
                                    <span className="material-symbols-outlined text-orange-400 text-sm mt-0.5">reply</span>
                                    <div>
                                        <p className="text-[10px] font-bold text-orange-800 uppercase mb-0.5">Kitchen Response</p>
                                        <p className="text-xs text-[#5C4D42] opacity-80 leading-relaxed">{item.response}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-1">
                                {item.tags.map(t => (
                                    <span key={t} className="px-2 py-0.5 rounded-full bg-gray-100 text-[8px] font-black text-gray-400 uppercase tracking-tighter">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 opacity-50">
                    <span className="material-symbols-outlined text-4xl mb-2">history_off</span>
                    <p className="text-sm font-bold">No past reviews</p>
                </div>
            )}
        </div>
    );
};

export default FeedbackHistoryList;

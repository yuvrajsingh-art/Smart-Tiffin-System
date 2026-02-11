import React from 'react';

const FeedbackHistoryList = ({ history, onEdit }) => {
    const getEmoji = (r) => {
        if (r >= 5) return '😍';
        if (r >= 4) return '😊';
        if (r >= 3) return '😐';
        if (r >= 2) return '🙁';
        return '🤮';
    };

    return (
        <div className="space-y-6">
            <h2 className="font-black text-[#2D241E] opacity-40 uppercase tracking-[0.3em] text-[10px] px-6">
                Feedback Archive
            </h2>
            {history.length > 0 ? (
                <div className="space-y-6 max-h-[850px] overflow-y-auto pr-6 custom-scrollbar px-2">
                    {history.map((item, index) => (
                        <div
                            key={item.id}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className="group glass-panel p-7 rounded-[2.8rem] border border-white/60 bg-white/40 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-2xl hover:translate-y-[-4px] animate-[slideUp_0.5s_ease-out_both] overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex justify-between items-start mb-5 relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="size-14 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 text-orange-600 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        {getEmoji(item.rating)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-black text-[#2D241E] text-lg tracking-tight">{item.meal}</h4>
                                            {!item.response && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all flex items-center gap-1.5 group/btn border border-transparent hover:border-primary/10"
                                                    title="Edit Review"
                                                >
                                                    <span className="material-symbols-outlined text-sm">edit_square</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest hidden group-hover/btn:block">Refine</span>
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5 opacity-60">{item.date}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5 bg-amber-400/10 p-2 rounded-2xl border border-amber-400/20 shadow-sm group-hover:bg-amber-400/20 transition-colors">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`material-symbols-outlined text-[16px] ${i < item.rating ? 'text-amber-400 fill-1' : 'text-gray-200'}`}>star</span>
                                    ))}
                                </div>
                            </div>

                            <div className="relative mb-6">
                                <span className="absolute -top-4 -left-2 text-4xl text-primary/5 font-serif select-none">"</span>
                                <p className="text-[15px] font-bold text-[#5C4D42] leading-relaxed px-1 relative z-10 italic">
                                    {item.comment}
                                </p>
                            </div>

                            {item.response && (
                                <div className="mt-6 mb-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/40 p-6 rounded-[2rem] border border-blue-100 flex gap-4 items-start backdrop-blur-md shadow-sm group-hover:shadow-md transition-all">
                                    <div className="size-10 rounded-xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
                                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-blue-800 uppercase tracking-[0.2em] mb-1.5 opacity-80">Message from Chef</p>
                                        <p className="text-sm font-bold text-[#5C4D42] opacity-90 leading-relaxed italic">{item.response}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 px-1">
                                {item.tags.map(t => (
                                    <span key={t} className="px-4 py-1.5 rounded-xl bg-white/80 border border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest shadow-sm group-hover:border-primary/20 group-hover:text-primary/60 transition-all">
                                        # {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white/40 border-2 border-dashed border-gray-100 rounded-[4rem] relative overflow-hidden group">
                    <div className="absolute inset- mesh-gradient opacity-10"></div>
                    <div className="relative z-10">
                        <span className="material-symbols-outlined text-7xl text-gray-200 mb-6 animate-float">rate_review</span>
                        <h3 className="text-xl font-black text-gray-400 mb-2">No reviews found</h3>
                        <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.3em] italic">Your history will appear here</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackHistoryList;

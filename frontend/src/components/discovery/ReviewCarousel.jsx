import React from 'react';

const ReviewCarousel = ({ reviews }) => {
    // Mock reviews if none provided
    const displayReviews = reviews && reviews.length > 0 ? reviews : [
        { id: 1, name: "Rahul S.", rating: 5, comment: "Best homemade food in the area! The chapatus are super soft.", date: "2 days ago" },
        { id: 2, name: "Priya M.", rating: 4, comment: "Good variety in the weekly menu. Weekend specials are amazing.", date: "1 week ago" },
        { id: 3, name: "Amit K.", rating: 5, comment: "Very hygienic packaging and timely delivery. Highly recommended for students.", date: "2 weeks ago" }
    ];

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-[#2D241E] flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 fill-current">star</span>
                    Student Reviews
                </h3>
                <span className="text-xs font-bold text-primary cursor-pointer hover:underline">View All</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayReviews.map((review) => (
                    <div key={review.id} className="bg-white/40 p-5 rounded-[1.5rem] border border-white/60 hover:bg-white/60 transition-colors shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[#2D241E] font-black text-sm">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#2D241E] text-sm">{review.name}</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">{review.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-0.5 bg-[#FFBF00]/10 px-2 py-0.5 rounded-lg border border-[#FFBF00]/20">
                                <span className="text-xs font-black text-[#B8860B]">{review.rating}</span>
                                <span className="material-symbols-outlined text-[10px] text-[#B8860B] fill-current">star</span>
                            </div>
                        </div>
                        <p className="text-xs md:text-sm text-[#5C4D42] leading-relaxed font-medium opacity-90">
                            "{review.comment}"
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewCarousel;

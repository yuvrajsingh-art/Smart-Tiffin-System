function FeedbackRatingDistribution( {feedbacks}) {
 const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        feedbacks.forEach(feedback => {
            distribution[feedback.rating]++;
        });
        return distribution;
    };

    const ratingDistribution = getRatingDistribution();
    return(
        <>
  {/* Rating Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h3>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center gap-3">
                                <span className="text-sm font-medium w-8">{rating} ★</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-orange-500 h-2 rounded-full" 
                                        style={{ width: `${(ratingDistribution[rating] / feedbacks.length) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating]}</span>
                            </div>
                        ))}
                    </div>
                </div>
        </>
    )
}
export default FeedbackRatingDistribution;
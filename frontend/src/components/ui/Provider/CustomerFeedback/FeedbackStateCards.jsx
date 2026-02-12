import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import RenderStars from "./RenderStars";

function FeedbackStateCards({ feedbacks }) {
    const getAverageRating = () => {
        if (feedbacks.length === 0) return 0;
        const total = feedbacks.reduce((sum, f) => sum + f.rating, 0);
        return (total / feedbacks.length).toFixed(1);
    };



    return (
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Average Rating */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-orange-600">
                            {getAverageRating()}
                        </p>
                        <div className="flex justify-center gap-1 my-2">
                            <RenderStars rating={Math.round(parseFloat(getAverageRating()))} />
                             
                        </div>
                        <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                </div>

                {/* Total Reviews */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                            {feedbacks.length}
                        </p>
                        <p className="text-sm text-gray-600">Total Reviews</p>
                    </div>
                </div>

                {/* Positive Reviews */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {feedbacks.filter((f) => f.rating >= 4).length}
                        </p>
                        <p className="text-sm text-gray-600">Positive Reviews</p>
                    </div>
                </div>

                {/* Pending Replies */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                            {feedbacks.filter((f) => !f.replied).length}
                        </p>
                        <p className="text-sm text-gray-600">Pending Replies</p>
                    </div>
                </div>
            </div>
     );
}

export default FeedbackStateCards;

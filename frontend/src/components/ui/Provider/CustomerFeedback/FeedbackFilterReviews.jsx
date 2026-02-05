import { useState } from "react";
import { FaThumbsUp, FaReply } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import RenderStars from "./RenderStars"; // adjust path if needed

function FeedbackFiltereReviews({ feedbacks }) {
    const [filter, setFilter] = useState("all");
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");

    const filteredFeedbacks = feedbacks.filter((feedback) => {
        if (filter === "all") return true;
        if (filter === "high") return feedback.rating >= 4;
        if (filter === "low") return feedback.rating <= 3;
        if (filter === "replied") return feedback.replied;
        if (filter === "pending") return !feedback.replied;
        return true;
    });

    const getRatingColor = (rating) => {
        if (rating >= 4) return "text-green-600";
        if (rating >= 3) return "text-yellow-600";
        return "text-red-600";
    };

    const handleReply = (feedbackId) => {
        console.log(`Replying to feedback ${feedbackId}: ${replyText}`);
        setReplyingTo(null);
        setReplyText("");
    };

    return (
        <>
            {/* Filter Tabs */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <MdFilterList className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                        Filter Reviews:
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "all"
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        All ({feedbacks.length})
                    </button>
                    <button
                        onClick={() => setFilter("high")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "high"
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        High Rating (4-5 ★)
                    </button>
                    <button
                        onClick={() => setFilter("low")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "low"
                                ? "bg-red-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Low Rating (1-3 ★)
                    </button>
                    <button
                        onClick={() => setFilter("pending")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "pending"
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Pending Reply
                    </button>
                    <button
                        onClick={() => setFilter("replied")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "replied"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Replied
                    </button>
                </div>
            </div>



        </>
    );
}

export default FeedbackFiltereReviews
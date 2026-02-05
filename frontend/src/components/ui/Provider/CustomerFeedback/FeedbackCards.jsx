import { FaReply, FaThumbsUp } from "react-icons/fa6";
import RenderStars from "./RenderStars";

function FeedackCards({ feedbacks, replyingTo, setReplyingTo, replyText, setReplyText, handleReply, getRatingColor }) {
    return (
        <>
            <div className="space-y-4">
                {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        {/* Feedback Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {feedback.avatar}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{feedback.customer}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <RenderStars rating={(feedback.rating)} />
                                        </div>
                                        <span className={`font-semibold ${getRatingColor(<RenderStars rating={feedback.rating} />)
                                            }`}>
                                             
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                                <p>{feedback.date}</p>
                                <p>{feedback.time}</p>
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                            <p className="text-sm text-gray-600">
                                Order #{feedback.orderId} - {feedback.item}
                            </p>
                        </div>

                        {/* Comment */}
                        <p className="text-gray-700 mb-4">{feedback.comment}</p>

                        {/* Helpful Count */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaThumbsUp className="text-green-500" />
                                <span>{feedback.helpful} found this helpful</span>
                            </div>
                        </div>

                        {/* Reply Section */}
                        {feedback.replied && feedback.reply && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaReply className="text-blue-500" />
                                    <span className="font-medium text-blue-800">Your Reply:</span>
                                </div>
                                <p className="text-blue-700">{feedback.reply}</p>
                            </div>
                        )}

                        {/* Reply Form */}
                        {replyingTo === feedback.id && (
                            <div className="border-t pt-4">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write your reply..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                    rows={3}
                                />
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => handleReply(feedback.id)}
                                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        Send Reply
                                    </button>
                                    <button
                                        onClick={() => setReplyingTo(null)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {!feedback.replied && replyingTo !== feedback.id && (
                            <div className="border-t pt-4">
                                <button
                                    onClick={() => setReplyingTo(feedback.id)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                >
                                    <FaReply />
                                    Reply to Customer
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}
export default FeedackCards;
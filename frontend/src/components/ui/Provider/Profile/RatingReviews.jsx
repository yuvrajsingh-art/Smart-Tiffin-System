import { FaStar } from "react-icons/fa6"

function RatingReviews({profileData} ) {
    return(
        <>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating & Reviews</h3>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <FaStar className="text-yellow-400 text-2xl" />
                                    <span className="text-3xl font-bold text-gray-800">{profileData.rating}</span>
                                </div>
                                <p className="text-gray-600">{profileData.totalReviews} reviews</p>
                                <div className="mt-4">
                                    <div className="flex justify-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={star <= Math.floor(profileData.rating) ? 'text-yellow-400' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
        </>
    )
}
export default RatingReviews

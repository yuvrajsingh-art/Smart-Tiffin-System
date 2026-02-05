import { FaCamera, FaStore } from "react-icons/fa6";

function ProfilePicture({ }) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture</h3>
                <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                        <FaStore />
                    </div>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 mx-auto">
                        <FaCamera />
                        Change Photo
                    </button>
                </div>
            </div>
        </>
    )
}
export default ProfilePicture;
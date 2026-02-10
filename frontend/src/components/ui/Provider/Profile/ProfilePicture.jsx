import { FaCamera } from "react-icons/fa6";
import { useAuth } from '../../../../context/UserContext';

function ProfilePicture({ profileData }) {
    const { user } = useAuth();
    
    const getProfileImage = () => {
        if (profileData?.profileImage) return profileData.profileImage;
        if (user?.profile_image) return user.profile_image;
        return `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || user?.businessName || 'Provider'}`;
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture</h3>
                <div className="text-center">
                    <img
                        src={getProfileImage()}
                        alt="Profile"
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-orange-100"
                    />
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
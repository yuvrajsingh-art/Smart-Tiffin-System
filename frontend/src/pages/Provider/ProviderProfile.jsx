import React, { useState } from 'react';
import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar";
import { FaEdit, FaSave, FaTimes, FaCamera, FaStore, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaStar } from 'react-icons/fa';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import StateCards from '../../components/ui/Provider/Profile/StateCards';
import ProviderInformation from '../../components/ui/Provider/Profile/ProviderInformation';
import OperatingHours from '../../components/ui/Provider/Profile/OperatingHours';
import ProfilePicture from '../../components/ui/Provider/Profile/ProfilePicture';
import RatingReviews from '../../components/ui/Provider/Profile/RatingReviews';
import BuisnessDetails from '../../components/ui/Provider/Profile/BuisnessDetails';

function ProviderProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        businessName: 'Tasty Tiffin Service',
        ownerName: 'Rajesh Kumar',
        email: 'rajesh@tastytiffin.com',
        phone: '+91 9876543210',
        address: 'Shop No. 15, Sector 22, Gurgaon, Haryana - 122001',
        description: 'We provide fresh, homemade tiffin services with authentic Indian flavors. Our kitchen maintains the highest hygiene standards and uses only fresh ingredients.',
        operatingHours: {
            open: '08:00',
            close: '22:00'
        },
        cuisineTypes: ['North Indian', 'South Indian', 'Gujarati', 'Punjabi'],
        specialties: ['Dal Rice', 'Roti Sabzi', 'Biryani', 'Thali'],
        rating: 4.6,
        totalReviews: 234,
        established: '2020',
        licenseNumber: 'FSSAI-12345678901234'
    });

    const [editData, setEditData] = useState({ ...profileData });

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...profileData });
    };

    const handleSave = () => {
        setProfileData({ ...editData });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({ ...profileData });
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleOperatingHoursChange = (type, value) => {
        setEditData(prev => ({
            ...prev,
            operatingHours: {
                ...prev.operatingHours,
                [type]: value
            }
        }));
    };



    return (
        <div className="flex h-screen bg-gray-50">
            <ProviderSidebar />
            <div className="flex-1 p-6 overflow-y-auto">
                <ProviderHeader />
                <div className="flex justify-between items-center mb-6">

                    <div className="flex gap-2">
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                            >
                                <FaEdit />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                                >
                                    <FaSave />
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                                >
                                    <FaTimes />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <StateCards />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Profile Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Business Information */}
                        <ProviderInformation
                            isEditing={isEditing}
                            profileData={profileData}

                        />

                        {/* Operating Hours */}
                        <OperatingHours
                            isEditing={isEditing}
                            profileData={profileData}
                        />
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Profile Picture */}
                        <ProfilePicture />

                        {/* Rating & Reviews */}

                        <RatingReviews
                            profileData={profileData} />
                        {/* Business Details */}
                        
                        <BuisnessDetails profileData={profileData}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProviderProfile;

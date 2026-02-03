import React, { useState } from 'react';
import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar";
import { FaEdit, FaSave, FaTimes, FaCamera, FaStore, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaStar } from 'react-icons/fa';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';

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

    const stats = [
        { label: 'Total Orders', value: '1,234', color: 'text-blue-600' },
        { label: 'Active Customers', value: '156', color: 'text-green-600' },
        { label: 'Monthly Revenue', value: '₹45,600', color: 'text-orange-600' },
        { label: 'Years in Business', value: '4+', color: 'text-purple-600' }
    ];

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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-center">
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Profile Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Business Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Information</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.businessName}
                                                onChange={(e) => handleInputChange('businessName', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        ) : (
                                            <p className="text-gray-800 font-medium">{profileData.businessName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.ownerName}
                                                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        ) : (
                                            <p className="text-gray-800 font-medium">{profileData.ownerName}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <FaEnvelope className="text-gray-400" />
                                                <p className="text-gray-800">{profileData.email}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={editData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <FaPhone className="text-gray-400" />
                                                <p className="text-gray-800">{profileData.phone}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                    {isEditing ? (
                                        <textarea
                                            value={editData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                        />
                                    ) : (
                                        <div className="flex items-start gap-2">
                                            <FaMapMarkerAlt className="text-gray-400 mt-1" />
                                            <p className="text-gray-800">{profileData.address}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    {isEditing ? (
                                        <textarea
                                            value={editData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                        />
                                    ) : (
                                        <p className="text-gray-700">{profileData.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Operating Hours */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Operating Hours</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time</label>
                                    {isEditing ? (
                                        <input
                                            type="time"
                                            value={editData.operatingHours.open}
                                            onChange={(e) => handleOperatingHoursChange('open', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FaClock className="text-gray-400" />
                                            <p className="text-gray-800">{profileData.operatingHours.open} AM</p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time</label>
                                    {isEditing ? (
                                        <input
                                            type="time"
                                            value={editData.operatingHours.close}
                                            onChange={(e) => handleOperatingHoursChange('close', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FaClock className="text-gray-400" />
                                            <p className="text-gray-800">{profileData.operatingHours.close} PM</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Profile Picture */}
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

                        {/* Rating & Reviews */}
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

                        {/* Business Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Established</p>
                                    <p className="font-medium text-gray-800">{profileData.established}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">License Number</p>
                                    <p className="font-medium text-gray-800">{profileData.licenseNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Cuisine Types</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {profileData.cuisineTypes.map((cuisine, index) => (
                                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                                {cuisine}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Specialties</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {profileData.specialties.map((specialty, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProviderProfile;

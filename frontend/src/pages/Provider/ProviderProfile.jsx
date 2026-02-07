import React, { useState, useEffect } from 'react';
import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar";
import { FaEdit, FaSave, FaTimes, FaCamera, FaStore, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaStar } from 'react-icons/fa';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import StateCards from '../../components/ui/Provider/Profile/StateCards';
import ProviderInformation from '../../components/ui/Provider/Profile/ProviderInformation';
import OperatingHours from '../../components/ui/Provider/Profile/OperatingHours';
import ProfilePicture from '../../components/ui/Provider/Profile/ProfilePicture';
import RatingReviews from '../../components/ui/Provider/Profile/RatingReviews';
import BuisnessDetails from '../../components/ui/Provider/Profile/BuisnessDetails';
import ProviderApi from '../../services/ProviderApi';

function ProviderProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        businessName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        operatingHours: { open: '08:00', close: '22:00' },
        cuisineTypes: [],
        specialties: [],
        rating: 0,
        totalReviews: 0,
        established: '',
        licenseNumber: ''
    });

    const [editData, setEditData] = useState({ ...profileData });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await ProviderApi.get('/provider-store');
            console.log('Profile Response:', response.data);
            if (response.data && response.data.profile) {
                const profile = response.data.profile;
                const formatted = {
                    businessName: profile.messName || profile.businessName || '',
                    ownerName: profile.ownerName || '',
                    email: profile.email || profile.contactEmail || '',
                    phone: profile.phone || profile.contactPhone || '',
                    address: profile.address || '',
                    description: profile.description || '',
                    operatingHours: {
                        open: profile.kitchenTimings?.open || '08:00',
                        close: profile.kitchenTimings?.close || '22:00'
                    },
                    cuisineTypes: profile.cuisineTypes || [],
                    specialties: profile.specialties || [],
                    rating: profile.rating || 0,
                    totalReviews: profile.totalReviews || 0,
                    established: profile.established || '',
                    licenseNumber: profile.fssaiLicense || profile.licenseNumber || ''
                };
                setProfileData(formatted);
                setEditData(formatted);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...profileData });
    };

    const handleSave = async () => {
        try {
            await ProviderApi.put('/provider-store', {
                messName: editData.businessName,
                contactEmail: editData.email,
                contactPhone: editData.phone,
                address: editData.address,
                description: editData.description,
                cuisineTypes: editData.cuisineTypes,
                specialties: editData.specialties
            });
            setProfileData({ ...editData });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile');
        }
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

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
}

export default ProviderProfile;

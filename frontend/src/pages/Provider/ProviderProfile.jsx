import React, { useState, useEffect } from 'react';
import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar";
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
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
            if (response.data && response.data.data) {
                const profile = response.data.data;
                const addressStr = typeof profile.address === 'object' 
                    ? `${profile.address.street || ''}, ${profile.address.city || ''}, ${profile.address.pincode || ''}`.replace(/^,\s*|,\s*$/g, '')
                    : profile.address || '';
                
                const formatted = {
                    businessName: profile.mess_name || '',
                    ownerName: profile.provider?.fullName || '',
                    email: profile.provider?.email || '',
                    phone: profile.contact_number || '',
                    address: addressStr,
                    description: profile.description || '',
                    profileImage: profile.store_image || profile.provider?.profile_image || '',
                    operatingHours: {
                        open: profile.lunch_start || '08:00',
                        close: profile.dinner_end || '22:00'
                    },
                    cuisineTypes: profile.cuisines || [],
                    specialties: profile.specialties || [],
                    rating: profile.rating || 0,
                    totalReviews: profile.reviewCount || 0,
                    established: profile.established || '',
                    licenseNumber: profile.fssai_license || ''
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
                mess_name: editData.businessName,
                contact_number: editData.phone,
                address: editData.address,
                description: editData.description,
                cuisines: editData.cuisineTypes
            });
            setProfileData({ ...editData });
            setIsEditing(false);
            alert('Profile updated successfully!');
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
        setEditData({ ...editData, [field]: value });
    };

    const handleOperatingHoursChange = (field, value) => {
        setEditData({ ...editData, operatingHours: { ...editData.operatingHours, [field]: value } });
    };

    return (
        <div className="flex h-screen bg-[#FFFBF5]">
            <ProviderSidebar />
            <div className="flex-1 flex flex-col">
                <ProviderHeader
                    title="Profile"
                    subtitle="Manage your business profile and settings"
                />
                <div className="flex-1 p-6 overflow-y-auto">
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
                            <StateCards />
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <ProviderInformation 
                                        isEditing={isEditing} 
                                        profileData={profileData} 
                                        editData={editData}
                                        handleInputChange={handleInputChange}
                                    />
                                    <OperatingHours 
                                        isEditing={isEditing} 
                                        profileData={profileData}
                                        editData={editData}
                                        handleOperatingHoursChange={handleOperatingHoursChange}
                                    />
                                </div>
                                <div className="space-y-6">
                                    <ProfilePicture profileData={profileData} />
                                    <RatingReviews profileData={profileData} />
                                    <BuisnessDetails profileData={profileData} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProviderProfile;

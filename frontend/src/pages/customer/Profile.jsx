import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/UserContext';
import axios from 'axios';
import { ProfileStats, ProfileAvatarCard, ProfileDetailsForm, AvatarSelectorModal, SecurityPrivacyForm } from '../../components/customer';
import {
    ProfileSkeleton,
    BackgroundBlobs,
    PageHeader
} from '../../components/common';

const Profile = () => {
    const { logout, user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('details'); // 'details' or 'security'
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', address: '', diet: 'Pure Veg', spiceLevel: 'Medium', sweetTooth: false, memberSince: ''
    });
    const [stats, setStats] = useState([
        { label: 'Member Since', value: '...', icon: 'calendar_month' },
        { label: 'Total Spent', value: '₹0', icon: 'payments', color: 'text-primary' },
        { label: 'Loyalty Level', value: 'Bronze', icon: 'military_tech', color: 'text-orange-500' },
    ]);

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/customer/profile');
            if (data.success) {
                const { profile, stats: apiStats } = data.data;
                setFormData({
                    name: profile.name || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    address: profile.address || '',
                    diet: profile.diet || 'Pure Veg',
                    spiceLevel: profile.spiceLevel || 'Medium',
                    sweetTooth: profile.sweetTooth || false,
                    memberSince: profile.memberSince || 'Oct 2025',
                    profileImage: profile.profileImage,
                    securitySettings: profile.securitySettings || { enhancedEncryption: false, loginAlerts: true }
                });
                if (apiStats) setStats(apiStats);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            const { data } = await axios.put('/api/customer/profile/update', formData);
            if (data.success) {
                setIsEditing(false);
                setShowSuccessModal(true);
                fetchProfileData(); // Refresh to update stats/profile
            }
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto pb-20 px-4 mt-6">
            <PageHeader title="My Profile" />
            <ProfileSkeleton />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">
            <BackgroundBlobs />
            <PageHeader title="My Profile" />

            <ProfileStats stats={stats} />

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <ProfileAvatarCard
                    name={formData.name}
                    id={`ST-${user?.id?.slice(-6)?.toUpperCase() || 'USER'}`}
                    diet={formData.diet}
                    profileImage={formData.profileImage}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onLogout={() => setShowLogoutModal(true)}
                    onEditAvatar={() => setShowAvatarModal(true)}
                />

                {activeTab === 'details' ? (
                    <ProfileDetailsForm
                        formData={formData}
                        setFormData={setFormData}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        onSave={handleSave}
                        saving={saving}
                    />
                ) : (
                    <SecurityPrivacyForm
                        user={user}
                        securitySettings={formData.securitySettings}
                        onSettingsUpdate={(newSettings) => setFormData({ ...formData, securitySettings: newSettings })}
                    />
                )}
            </div>

            {/* Avatar Selector Modal */}
            <AvatarSelectorModal
                isOpen={showAvatarModal}
                onClose={() => setShowAvatarModal(false)}
                currentAvatar={formData.profileImage}
                onSelect={async (newAvatar) => {
                    // Optimistic update
                    setFormData(prev => ({ ...prev, profileImage: newAvatar }));

                    try {
                        // Backend requires 'imageUrl'
                        await axios.post('/api/customer/profile/upload-image', { imageUrl: newAvatar });
                        setShowAvatarModal(false);
                    } catch (error) {
                        console.error("Failed to update avatar", error);
                        // Revert on failure if needed (skipped for simplicity)
                    }
                }}
            />

            {/* Success Modal */}
            {
                showSuccessModal && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg" onClick={() => setShowSuccessModal(false)}></div>
                        <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl relative overflow-hidden z-10 text-center">
                            <div className="size-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <span className="material-symbols-outlined text-4xl text-white">verified</span>
                            </div>
                            <h3 className="text-2xl font-black mb-2">Profile Updated!</h3>
                            <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold">Great!</button>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* Logout Modal */}
            {
                showLogoutModal && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg" onClick={() => setShowLogoutModal(false)}></div>
                        <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl relative z-10 text-center">
                            <h3 className="text-2xl font-black mb-2">Logout?</h3>
                            <p className="mb-8 opacity-70">Are you sure you want to log out?</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-4 bg-gray-100 rounded-[1.5rem] font-bold">Cancel</button>
                                <button onClick={logout} className="flex-1 py-4 bg-red-500 text-white rounded-[1.5rem] font-bold">Logout</button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div >
    );
};
export default Profile;

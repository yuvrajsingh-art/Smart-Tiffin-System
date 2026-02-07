import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import PinModal from './PinModal';

const SecurityPrivacyForm = ({ user, securitySettings, onSettingsUpdate }) => {
    const [exporting, setExporting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [isPinSetting, setIsPinSetting] = useState(false);

    const [pin, setPin] = useState('');
    const [deleteReason, setDeleteReason] = useState('');

    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

    const handleToggleSetting = async (key) => {
        try {
            const newSettings = { ...securitySettings, [key]: !securitySettings[key] };
            onSettingsUpdate(newSettings); // Optimistic

            await axios.post('/api/customer/profile/security-settings', newSettings);
            toast.success("Preferences saved");
        } catch (error) {
            toast.error("Failed to save preference");
            onSettingsUpdate(securitySettings); // Revert
        }
    };

    const handlePasswordChange = async () => {
        if (passwords.new !== passwords.confirm) {
            toast.error("Passwords do not match");
            return;
        }
        if (passwords.new.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            const { data } = await axios.post('/api/auth/update-password', {
                oldPassword: passwords.old,
                newPassword: passwords.new
            });
            if (data.success) {
                toast.success("Password updated successfully");
                setShowPasswordModal(false);
                setPasswords({ old: '', new: '', confirm: '' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update password");
        }
    };

    const [pinFlow, setPinFlow] = useState('verify'); // 'verify' or 'set'
    const [oldPinValue, setOldPinValue] = useState('');

    const handlePinUpdate = async (pinValue) => {
        try {
            if (pinFlow === 'verify') {
                // Verify old PIN first using the dedicated endpoint
                const { data } = await axios.post('/api/customer/wallet/verify-pin', { pin: pinValue });

                // If verified, proceed to collect new PIN
                setOldPinValue(pinValue);
                setPinFlow('set');
                toast.success("Now enter your new PIN");
                return;
            }

            // Now set the new PIN using both old and new
            const { data } = await axios.post('/api/customer/wallet/set-pin', {
                pin: pinValue,
                oldPin: oldPinValue
            });

            if (data.success) {
                toast.success("Transaction PIN updated successfully");
                setShowPinModal(false);
                setPinFlow('verify');
                setOldPinValue('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
            // If verification failed, don't proceed to 'set'
            if (pinFlow === 'verify') {
                throw new Error("Incorrect current PIN");
            }
        }
    };

    const handleExportData = async () => {
        // ... existing handleExportData logic ...
        try {
            setExporting(true);
            const response = await axios.get('/api/customer/profile/export-data', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `my-data-${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Your data report is ready!');
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export data");
        } finally {
            setExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        // ... existing handleDeleteAccount logic ...
        if (!pin || pin.length !== 4) {
            toast.error("Please enter your 4-digit Transaction PIN");
            return;
        }

        try {
            setDeleting(true);
            const { data } = await axios.post('/api/customer/profile/delete-account', {
                pin,
                reason: deleteReason
            });

            if (data.success) {
                toast.success("Account deleted successfully");
                setTimeout(() => window.location.href = '/login', 2000);
            }
        } catch (error) {
            console.error("Deletion failed:", error);
            toast.error(error.response?.data?.message || "Failed to delete account");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex-1 w-full space-y-6">
            {/* Security Checkup Card */}
            <div className="glass-panel p-6 rounded-[2rem] border border-white/60 relative shadow-lg overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                    <div className="size-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-500">verified_user</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-[#2D241E]">Security Checkup</h3>
                        <p className="text-[10px] font-medium text-gray-400">Keep your account guarded</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-transparent hover:border-blue-100 transition-all group">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-green-500 group-hover:scale-110 transition-transform">check_circle</span>
                            <div>
                                <p className="text-xs font-bold text-[#2D241E]">Password Strength</p>
                                <p className="text-[10px] text-gray-400">Changed recently</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="text-[10px] font-black text-primary hover:underline uppercase tracking-wider"
                        >
                            Change
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-transparent hover:border-blue-100 transition-all group">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-orange-400 group-hover:scale-110 transition-transform">lock</span>
                            <div>
                                <p className="text-xs font-bold text-[#2D241E]">Transaction PIN</p>
                                <p className="text-[10px] text-gray-400">4-digit PIN is active</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPinModal(true)}
                            className="text-[10px] font-black text-primary hover:underline uppercase tracking-wider"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>

            {/* Privacy & Data Card */}
            <div className="glass-panel p-6 rounded-[2rem] border border-white/60 relative shadow-lg overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                    <div className="size-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-500">visibility_off</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-[#2D241E]">Privacy & Data</h3>
                        <p className="text-[10px] font-medium text-gray-400">Manage your digital footprint</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-[11px] font-bold text-[#2D241E] mb-2 uppercase tracking-widest opacity-40">Data Control</p>
                        <div className="p-4 bg-purple-50/30 border border-purple-100/50 rounded-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-[#2D241E]">Download Personal Data</p>
                                    <p className="text-[10px] text-gray-500 max-w-[200px]">Get a complete record of your profile, orders, and wallet history.</p>
                                </div>
                                <button
                                    onClick={handleExportData}
                                    disabled={exporting}
                                    className="px-4 py-2 bg-white rounded-xl shadow-sm border border-purple-100 text-[10px] font-black text-purple-600 hover:bg-purple-50 transition-colors disabled:opacity-50"
                                >
                                    {exporting ? 'PREPARING...' : 'EXPORT PDF'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-gray-400 text-xl">encrypted</span>
                            <span className="text-[11px] font-bold text-[#2D241E]">Enhanced Data Encryption</span>
                        </div>
                        <button
                            onClick={() => handleToggleSetting('enhancedEncryption')}
                            className={`w-10 h-5 rounded-full p-1 relative transition-colors ${securitySettings?.enhancedEncryption ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <div className={`size-3 bg-white rounded-full absolute transition-all ${securitySettings?.enhancedEncryption ? 'right-1' : 'left-1'}`}></div>
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-gray-400 text-xl">notifications_active</span>
                            <span className="text-[11px] font-bold text-[#2D241E]">Real-time Login Alerts</span>
                        </div>
                        <button
                            onClick={() => handleToggleSetting('loginAlerts')}
                            className={`w-10 h-5 rounded-full p-1 relative transition-colors ${securitySettings?.loginAlerts ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                            <div className={`size-3 bg-white rounded-full absolute transition-all ${securitySettings?.loginAlerts ? 'right-1' : 'left-1'}`}></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Account Management Card */}
            <div className="glass-panel p-6 rounded-[2rem] border border-white/60 bg-red-50/10 shadow-lg overflow-hidden border-b-red-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-red-600">Danger Zone</h3>
                        <p className="text-[10px] font-medium text-red-400/80 uppercase tracking-widest">Irreversible actions</p>
                    </div>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-[10px] font-black hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                    >
                        DELETE ACCOUNT
                    </button>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#2D241E]/90 backdrop-blur-md">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl relative animate-[modalPop_0.3s_ease-out]">
                        <h3 className="text-2xl font-black mb-6">Change Password</h3>
                        <div className="space-y-4 mb-8">
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={passwords.old}
                                onChange={e => setPasswords({ ...passwords, old: e.target.value })}
                                className="w-full bg-gray-50 border border-transparent focus:border-primary/20 rounded-2xl px-5 py-4 font-bold text-sm outline-none transition-all"
                            />
                            <div className="h-px bg-gray-100 mx-4"></div>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={passwords.new}
                                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                className="w-full bg-gray-50 border border-transparent focus:border-primary/20 rounded-2xl px-5 py-4 font-bold text-sm outline-none transition-all"
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={passwords.confirm}
                                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                className="w-full bg-gray-50 border border-transparent focus:border-primary/20 rounded-2xl px-5 py-4 font-bold text-sm outline-none transition-all"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-4 bg-gray-100 rounded-[1.5rem] font-bold">Cancel</button>
                            <button onClick={handlePasswordChange} className="flex-1 py-4 bg-primary text-white rounded-[1.5rem] font-black shadow-lg shadow-orange-500/20">Update</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Pin Modal for Updates */}
            <PinModal
                isOpen={showPinModal}
                onClose={() => {
                    setShowPinModal(false);
                    setPinFlow('verify');
                }}
                onSuccess={handlePinUpdate}
                title={pinFlow === 'verify' ? "Verify Current PIN" : "Setup New PIN"}
                subtitle={pinFlow === 'verify' ? "Enter your current 4-digit security PIN" : "Enter your new 4-digit transaction PIN"}
                isSetting={true}
            />

            {/* Deletion Modal */}
            {showDeleteModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#2D241E]/90 backdrop-blur-xl transition-all duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl relative overflow-hidden animate-[modalPop_0.3s_ease-out]">
                        <div className="size-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-red-500 text-3xl">delete_forever</span>
                        </div>

                        <h3 className="text-2xl font-black text-center mb-2">Are you sure?</h3>
                        <p className="text-sm text-center text-gray-500 mb-8 px-4 font-medium italic">"Every ending is a new beginning. But we'll miss serving you!"</p>

                        <div className="space-y-4">
                            <div className="space-y-1.5 text-center">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction PIN (Required)</label>
                                <div className="flex justify-center gap-3">
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className="size-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center relative">
                                            {pin[i] ? <div className="size-2 bg-[#2D241E] rounded-full"></div> : null}
                                        </div>
                                    ))}
                                    <input
                                        autoFocus
                                        type="tel"
                                        maxLength={4}
                                        value={pin}
                                        onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                                        className="absolute inset-0 opacity-0 cursor-default"
                                    />
                                </div>
                            </div>

                            <textarea
                                placeholder="Why are you leaving? (Optional)"
                                value={deleteReason}
                                onChange={e => setDeleteReason(e.target.value)}
                                className="w-full bg-gray-50 rounded-2xl p-4 text-xs font-medium border border-transparent focus:border-red-100 outline-none transition-all resize-none h-20"
                            />

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-4 bg-gray-100 text-[#2D241E] rounded-[1.5rem] font-bold text-sm hover:bg-gray-200 transition-colors"
                                >
                                    STAY
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleting || pin.length !== 4}
                                    className="flex-1 py-4 bg-red-500 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-red-500/20 active:scale-95 disabled:opacity-50 transition-all"
                                >
                                    {deleting ? 'SCRUBBING...' : 'DELETE'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default SecurityPrivacyForm;

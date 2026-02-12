import React, { useState, useEffect } from 'react';
import { FaPowerOff, FaBell, FaUmbrellaBeach, FaCheckCircle } from 'react-icons/fa';
import ProviderApi from '../../../../services/ProviderApi';
import Swal from 'sweetalert2';

const QuickActionsPanel = () => {
    const [kitchenStatus, setKitchenStatus] = useState('open');
    const [vacationMode, setVacationMode] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchKitchenStatus();
    }, []);

    const fetchKitchenStatus = async () => {
        try {
            const response = await ProviderApi.get('/provider-store');
            if (response.data?.data) {
                setVacationMode(response.data.data.vacation_mode || false);
                setKitchenStatus(response.data.data.is_active ? 'open' : 'closed');
            }
        } catch (error) {
            console.error('Error fetching kitchen status:', error);
        }
    };

    const toggleKitchenStatus = async () => {
        setLoading(true);
        try {
            const newStatus = kitchenStatus === 'open' ? 'closed' : 'open';
            await ProviderApi.put('/provider-store', {
                is_active: newStatus === 'open'
            });
            setKitchenStatus(newStatus);
            Swal.fire({
                icon: 'success',
                title: `Kitchen ${newStatus === 'open' ? 'Opened' : 'Closed'}!`,
                text: `Your kitchen is now ${newStatus}`,
                timer: 2000,
                showConfirmButton: false,
                background: '#fff',
                customClass: {
                    popup: 'rounded-3xl'
                }
            });
        } catch (error) {
            console.error('Error toggling kitchen status:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Failed to update kitchen status',
                confirmButtonColor: '#f97316',
                customClass: {
                    popup: 'rounded-3xl',
                    confirmButton: 'rounded-xl px-6 py-3 font-bold'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleVacationMode = async () => {
        setLoading(true);
        try {
            await ProviderApi.put('/provider-store/vacation', {
                status: !vacationMode,
                reason: !vacationMode ? 'Vacation' : null
            });
            setVacationMode(!vacationMode);
            Swal.fire({
                icon: 'success',
                title: `Vacation Mode ${!vacationMode ? 'Enabled' : 'Disabled'}!`,
                text: !vacationMode ? 'Your customers will be notified' : 'Welcome back!',
                timer: 2000,
                showConfirmButton: false,
                background: '#fff',
                customClass: {
                    popup: 'rounded-3xl'
                }
            });
        } catch (error) {
            console.error('Error toggling vacation mode:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Failed to update vacation mode',
                confirmButtonColor: '#f97316',
                customClass: {
                    popup: 'rounded-3xl',
                    confirmButton: 'rounded-xl px-6 py-3 font-bold'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const sendBulkNotification = async () => {
        const { value: message } = await Swal.fire({
            title: 'Send Notification',
            input: 'textarea',
            inputLabel: 'Message for all customers',
            inputPlaceholder: 'Type your message here...',
            inputAttributes: {
                'aria-label': 'Type your message here'
            },
            showCancelButton: true,
            confirmButtonText: 'Send',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#f97316',
            customClass: {
                popup: 'rounded-3xl',
                confirmButton: 'rounded-xl px-6 py-3 font-bold',
                cancelButton: 'rounded-xl px-6 py-3 font-bold'
            }
        });

        if (!message) return;

        setLoading(true);
        try {
            await ProviderApi.post('/provider-notifications/bulk', { message });
            Swal.fire({
                icon: 'success',
                title: 'Notification Sent!',
                text: 'All customers have been notified',
                timer: 2000,
                showConfirmButton: false,
                background: '#fff',
                customClass: {
                    popup: 'rounded-3xl'
                }
            });
        } catch (error) {
            console.error('Error sending notification:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Failed to send notification',
                confirmButtonColor: '#f97316',
                customClass: {
                    popup: 'rounded-3xl',
                    confirmButton: 'rounded-xl px-6 py-3 font-bold'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Kitchen Status Toggle */}
                <button
                    onClick={toggleKitchenStatus}
                    disabled={loading}
                    className={`p-4 rounded-xl border-2 transition-all ${
                        kitchenStatus === 'open'
                            ? 'border-green-500 bg-green-50 hover:bg-green-100'
                            : 'border-red-500 bg-red-50 hover:bg-red-100'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                            kitchenStatus === 'open' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                            <FaPowerOff className="text-white text-xl" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-500 font-medium">Kitchen Status</p>
                            <p className={`text-sm font-bold ${
                                kitchenStatus === 'open' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {kitchenStatus === 'open' ? 'Open' : 'Closed'}
                            </p>
                        </div>
                    </div>
                </button>

                {/* Vacation Mode */}
                <button
                    onClick={toggleVacationMode}
                    disabled={loading}
                    className={`p-4 rounded-xl border-2 transition-all ${
                        vacationMode
                            ? 'border-orange-500 bg-orange-50 hover:bg-orange-100'
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                            vacationMode ? 'bg-orange-500' : 'bg-gray-400'
                        }`}>
                            <FaUmbrellaBeach className="text-white text-xl" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-500 font-medium">Vacation Mode</p>
                            <p className={`text-sm font-bold ${
                                vacationMode ? 'text-orange-600' : 'text-gray-600'
                            }`}>
                                {vacationMode ? 'Enabled' : 'Disabled'}
                            </p>
                        </div>
                    </div>
                </button>

                {/* Send Notification */}
                <button
                    onClick={sendBulkNotification}
                    disabled={loading}
                    className={`p-4 rounded-xl border-2 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-all ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500">
                            <FaBell className="text-white text-xl" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-500 font-medium">Notify</p>
                            <p className="text-sm font-bold text-blue-600">All Customers</p>
                        </div>
                    </div>
                </button>

                {/* Mark All Orders Ready */}
                <button
                    onClick={() => Swal.fire({
                        icon: 'info',
                        title: 'Coming Soon!',
                        text: 'Bulk order update feature will be available soon',
                        confirmButtonColor: '#f97316',
                        customClass: {
                            popup: 'rounded-3xl',
                            confirmButton: 'rounded-xl px-6 py-3 font-bold'
                        }
                    })}
                    disabled={loading}
                    className={`p-4 rounded-xl border-2 border-purple-500 bg-purple-50 hover:bg-purple-100 transition-all ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500">
                            <FaCheckCircle className="text-white text-xl" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-500 font-medium">Bulk Update</p>
                            <p className="text-sm font-bold text-purple-600">Orders Ready</p>
                        </div>
                    </div>
                </button>

            </div>
        </div>
    );
};

export default QuickActionsPanel;

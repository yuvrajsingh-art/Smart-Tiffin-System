import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ProviderApi from '../../services/ProviderApi';
import ProviderSidebar from '../../components/ui/Provider/ProviderSidebar';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';

function SubscriptionPlan() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        period: 'Monthly',
        type: 'veg',
        description: ''
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await ProviderApi.get('/provider-plans');
            if (response.data.success) {
                setPlans(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
            toast.error('Failed to load plans');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price) {
            return toast.error('Name and price are required');
        }

        try {
            if (editingPlan) {
                const response = await ProviderApi.put(`/provider-plans/${editingPlan._id}`, formData);
                if (response.data.success) {
                    toast.success('Plan updated successfully');
                    await fetchPlans();
                }
            } else {
                const response = await ProviderApi.post('/provider-plans', formData);
                if (response.data.success) {
                    toast.success('Plan created successfully');
                    await fetchPlans();
                }
            }
            setShowModal(false);
            setEditingPlan(null);
            setFormData({ name: '', price: '', period: 'Monthly', type: 'veg', description: '' });
        } catch (error) {
            console.error('Error saving plan:', error);
            toast.error(error.response?.data?.message || 'Failed to save plan');
        }
    };

    const handleDelete = async (planId) => {
        if (!window.confirm('Delete this plan?')) return;
        try {
            const response = await ProviderApi.delete(`/provider-plans/${planId}`);
            if (response.data.success) {
                toast.success('Plan deleted');
                await fetchPlans();
            }
        } catch (error) {
            toast.error('Failed to delete plan');
        }
    };

    const openEditModal = (plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            price: plan.price,
            period: plan.period || 'Monthly',
            type: plan.type || 'veg',
            description: plan.description || ''
        });
        setShowModal(true);
    };

    return (
        <div className="flex h-screen bg-[#FFFBF5]">
            <ProviderSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-auto">
                <ProviderHeader 
                    title="Your Subscription Plans" 
                    subtitle="Manage what customers can subscribe to"
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                
                <div className="p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">My Plans</h2>
                            <button
                                onClick={() => {
                                    setEditingPlan(null);
                                    setFormData({ name: '', price: '', period: 'Monthly', type: 'veg', description: '' });
                                    setShowModal(true);
                                }}
                                className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Create Plan
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mx-auto"></div>
                            </div>
                        ) : plans.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl">
                                <span className="material-symbols-outlined text-6xl text-gray-300">inventory_2</span>
                                <p className="text-gray-500 mt-4">No plans yet. Create your first plan!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {plans.map(plan => (
                                    <div key={plan._id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
                                                <p className="text-sm text-gray-500">{plan.type} • {plan.period}</p>
                                            </div>
                                            <span className="text-2xl font-bold text-orange-600">₹{plan.price}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4">{plan.description || 'No description'}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(plan)}
                                                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-all"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(plan._id)}
                                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-all"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">{editingPlan ? 'Edit' : 'Create'} Plan</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Plan Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="e.g., Monthly Veg Thali"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="2400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Period</label>
                                <select
                                    value={formData.period}
                                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="veg">Veg</option>
                                    <option value="non-veg">Non-Veg</option>
                                    <option value="jain">Jain</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Describe your plan..."
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingPlan(null);
                                    }}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-all"
                                >
                                    {editingPlan ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SubscriptionPlan;
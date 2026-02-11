import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import PlanForm from '../../components/ui/Provider/SubscriptionPlan/PlanForm';
import PlanPreview from '../../components/ui/Provider/SubscriptionPlan/PlanPreview';
import EmptyState from '../../components/ui/Provider/SubscriptionPlan/EmptyState';
import PlanDisplay from '../../components/ui/Provider/SubscriptionPlan/PlanDisplay';
import ProviderSidebar from '../../components/ui/Provider/ProviderSidebar';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';

function SubscriptionPlan() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [existingPlan, setExistingPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingPlan, setFetchingPlan] = useState(true);
    const [formData, setFormData] = useState({
        providerName: '',
        kitchenName: '',
        weeklyPrice: '',
        monthlyPrice: '',
        description: '',
        features: '',
        cuisines: ''
    });

    useEffect(() => {
        fetchPlan();
    }, []);

    const fetchPlan = async () => {
        try {
            const response = await axios.get('/api/provider/subscription-plan');
            if (response.data.success && response.data.data) {
                setExistingPlan(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching plan:', error);
        } finally {
            setFetchingPlan(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const planData = {
                ...formData,
                features: formData.features.split(',').map(f => f.trim()).filter(f => f),
                cuisines: formData.cuisines.split(',').map(c => c.trim()).filter(c => c)
            };

            const response = await axios.post('/api/provider/subscription-plan', planData);
            
            if (response.data.success) {
                toast.success('Subscription plan created successfully!');
                setExistingPlan(response.data.data);
                setShowForm(false);
                setFormData({
                    providerName: '',
                    kitchenName: '',
                    weeklyPrice: '',
                    monthlyPrice: '',
                    description: '',
                    features: '',
                    cuisines: ''
                });
            }
        } catch (error) {
            console.error('Error creating plan:', error);
            toast.error(error.response?.data?.message || 'Failed to create subscription plan');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setFormData({
            providerName: existingPlan.providerName,
            kitchenName: existingPlan.kitchenName,
            weeklyPrice: existingPlan.weeklyPrice,
            monthlyPrice: existingPlan.monthlyPrice,
            description: existingPlan.description,
            features: existingPlan.features.join(', '),
            cuisines: existingPlan.cuisines.join(', ')
        });
        setShowForm(true);
    };

    if (fetchingPlan) {
        return (
            <div className="flex h-screen bg-[#FFFBF5]">
                <ProviderSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#FFFBF5]">
            <ProviderSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-auto">
                <ProviderHeader 
                    title="Subscription Plan" 
                    subtitle="Manage your meal subscription plans"
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <div className="p-6">
                    {!existingPlan && !showForm ? (
                        <EmptyState onCreateClick={() => setShowForm(true)} />
                    ) : showForm ? (
                        <div className="max-w-7xl mx-auto">
                            <div className="mb-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-12 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                            <span className="material-symbols-outlined text-2xl">card_membership</span>
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-black text-[#2D241E]">{existingPlan ? 'Edit' : 'Create'} Subscription Plan</h1>
                                            <p className="text-sm text-[#5C4D42] font-medium">Set up your meal plans for customers</p>
                                        </div>
                                    </div>
                                    {existingPlan && (
                                        <button
                                            onClick={() => setShowForm(false)}
                                            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-lg">close</span>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="glass-panel p-6 rounded-[2rem] border border-white/60 bg-white/30">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined text-xl">edit_note</span>
                                        </div>
                                        <h2 className="text-xl font-black text-[#2D241E]">Plan Details</h2>
                                    </div>
                                    <PlanForm 
                                        formData={formData} 
                                        setFormData={setFormData} 
                                        onSubmit={handleSubmit}
                                        loading={loading}
                                    />
                                </div>

                                <div className="lg:sticky lg:top-6 h-fit">
                                    <PlanPreview formData={formData} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <PlanDisplay plan={existingPlan} onEdit={handleEdit} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default SubscriptionPlan;
import { useState, useEffect } from 'react';
import ProviderApi from '../../../../services/ProviderApi';

function StateCards() {
    const [stats, setStats] = useState([
        { label: 'Total Orders', value: '0', color: 'text-blue-600' },
        { label: 'Active Customers', value: '0', color: 'text-green-600' },
        { label: 'Monthly Revenue', value: '₹0', color: 'text-orange-600' },
        { label: 'Years in Business', value: '0', color: 'text-purple-600' }
    ]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await ProviderApi.get('/provider-deshbord/dashboard');
            console.log('Dashboard Stats:', response.data);
            
            if (response.data && response.data.data) {
                const data = response.data.data;
                const profileRes = await ProviderApi.get('/provider-store');
                const yearsInBusiness = profileRes.data?.profile?.established 
                    ? new Date().getFullYear() - parseInt(profileRes.data.profile.established)
                    : 0;

                setStats([
                    { label: 'Total Orders', value: data.liveOperations?.ordersToPrep || '0', color: 'text-blue-600' },
                    { label: 'Active Customers', value: data.businessHealth?.activeSubscribers || '0', color: 'text-green-600' },
                    { label: 'Monthly Revenue', value: `₹${data.businessHealth?.todayRevenue || 0}`, color: 'text-orange-600' },
                    { label: 'Years in Business', value: `${yearsInBusiness}+`, color: 'text-purple-600' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
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
    );
}

export default StateCards;
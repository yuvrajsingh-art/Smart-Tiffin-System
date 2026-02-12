import React, { useState } from 'react';
import ProviderSidebar from '../../components/ui/Provider/ProviderSidebar';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import TodaysMenu from '../../components/ui/Provider/Manage Menu/TodaysMenu';
import WeeklyPlan from '../../components/ui/Provider/Manage Menu/WeeklyPlan';

const ManageMenu = () => {
    const [activeTab, setActiveTab] = useState('today');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const tabs = [
        { id: 'today', label: "Today's Menu" },
        { id: 'weekly', label: 'Weekly Plan' }
    ];

    return (
        <div className="flex h-screen bg-[#FFFBF5]">
            <ProviderSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col">
                <ProviderHeader
                    title="Meal Cards"
                    subtitle="Configure today's special Lunch and Dinner thalis"
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <div className="flex-1 overflow-y-auto">
                    {/* Tabs - Inside content area */}
                    <div className="px-6 pt-4 pb-2 bg-[#FFFBF5] border-b border-gray-100">
                        <div className="flex gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id
                                            ? 'text-orange-600 border-b-2 border-orange-500 bg-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'today' ? <TodaysMenu /> : <WeeklyPlan />}
                </div>
            </div>
        </div>
    );
};

export default ManageMenu;

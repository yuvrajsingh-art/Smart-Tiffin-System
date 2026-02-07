import React, { useState } from 'react';
import ProviderSidebar from '../../components/ui/Provider/ProviderSidebar';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import TodaysMenu from '../../components/ui/Provider/Manage Menu/TodaysMenu';
import WeeklyPlan from '../../components/ui/Provider/Manage Menu/WeeklyPlan';
import { FaCalendarDay, FaCalendarWeek } from 'react-icons/fa';

const ManageMenu = () => {
    const [activeTab, setActiveTab] = useState('today');

    return (
        <div className="flex h-screen bg-[#FFFBF5]">
            <ProviderSidebar />
            <div className="flex-1 flex flex-col">
                <ProviderHeader
                    title="Manage Menu"
                    subtitle="Update your daily menu and weekly meal plans"
                />
                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Tab Navigation */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('today')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                                    activeTab === 'today'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <FaCalendarDay />
                                Today's Menu
                            </button>
                            <button
                                onClick={() => setActiveTab('weekly')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                                    activeTab === 'weekly'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <FaCalendarWeek />
                                Weekly Plan
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        {activeTab === 'today' ? <TodaysMenu /> : <WeeklyPlan />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageMenu;

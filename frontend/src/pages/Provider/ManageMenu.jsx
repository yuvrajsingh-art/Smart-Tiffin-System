import React, { useState } from 'react';
import TodaysMenu from '../../components/ui/Provider/Manage Menu/TodaysMenu';
import WeeklyPlan from '../../components/ui/Provider/Manage Menu/WeeklyPlan';
import ProviderSidebar from '../../components/ui/Provider/ProviderSidebar';
import ProviderHeader from '../../components/ui/Provider/Dashboard/ProviderHeader';

const ManageMenu = () => {
  const [activeTab, setActiveTab] = useState('today');

  return (
    <div className="flex h-screen bg-gray-50">
      <ProviderSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ProviderHeader />
        <div className="flex-1 overflow-y-auto">
          {/* Tab Navigation */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('today')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'today'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Today's Menu
                </button>
                <button
                  onClick={() => setActiveTab('weekly')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'weekly'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Weekly Plan
                </button>
              </div>
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
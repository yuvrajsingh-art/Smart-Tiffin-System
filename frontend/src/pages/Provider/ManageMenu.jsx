import React from 'react';
import TodaysMenu from '../../components/ui/Provider/Manage Menu/TodaysMenu';

const ManageMenu = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <TodaysMenu />
      </div>
    </div>
  );
};

export default ManageMenu;
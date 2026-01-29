import React from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';

function ProviderHeader() {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, Chef!</h1>
                    <p className="text-gray-600">Here's what's happening in your kitchen today.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    
                    
                    <button className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
                        <FaBell className="text-xl" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                    </button>
                    
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                        P
                    </div>
                </div>
            </div>
        </header>
    );
}

export default ProviderHeader;
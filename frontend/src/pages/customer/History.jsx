import React from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { Link } from 'react-router-dom';

const History = () => {
    const { hasActiveSubscription } = useSubscription();

    if (!hasActiveSubscription()) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-[fadeIn_0.5s_ease-out]">
                <div className="size-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-gray-400">lock</span>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#2D241E]">History Locked</h2>
                    <p className="text-[#5C4D42] mt-2 max-w-md mx-auto">
                        Order history is only available for active subscribers.
                    </p>
                </div>
                <Link to="/customer/find-mess" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-[#e05d00] transition-colors">
                    Find a Mess
                </Link>
            </div>
        );
    }

    // Mock History Data
    const history = [
        { id: 1, date: "Today, 12:30 PM", type: "Lunch", item: "Paneer Thali", status: "Delivered", price: "₹120" },
        { id: 2, date: "Yesterday, 8:00 PM", type: "Dinner", item: "Veg Pulao", status: "Delivered", price: "₹90" },
        { id: 3, date: "22 Oct, 12:30 PM", type: "Lunch", item: "Chicken Curry", status: "Skipped", price: "-" },
    ];

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-2xl font-bold text-[#2D241E]">Order History</h2>

            <div className="space-y-4">
                {history.map((item) => (
                    <div key={item.id} className="glass-panel p-5 rounded-2xl flex items-center justify-between group hover:border-orange-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`size-12 rounded-xl flex items-center justify-center text-xl ${item.status === 'Skipped' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                <span className="material-symbols-outlined">
                                    {item.status === 'Skipped' ? 'block' : 'check_circle'}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#2D241E]">{item.item}</h3>
                                <p className="text-xs text-[#5C4D42]">{item.date} • {item.type}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${item.status === 'Skipped' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {item.status}
                            </span>
                            <p className="font-bold text-[#2D241E] mt-1">{item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;

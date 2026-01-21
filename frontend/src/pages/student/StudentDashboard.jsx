import React from 'react';
import Button from '../../components/ui/Button';

const StatCard = ({ title, value, subtext, icon, color }) => (
    <div className="glass-panel p-5 rounded-2xl flex items-start justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div className="relative z-10">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
            <p className="text-xs text-gray-400 font-medium">{subtext}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} text-white shadow-lg`}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
    </div>
);

const MenuCard = () => (
    <div className="glass-panel p-0 rounded-3xl overflow-hidden group">
        <div className="h-48 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
            <img
                src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop"
                alt="Lunch"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 z-20">
                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">Today's Lunch</span>
                <h3 className="text-white text-xl font-bold">Paneer Butter Masala Thali</h3>
            </div>
        </div>
        <div className="p-5">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-gra-400 text-[18px]">schedule</span>
                    <span>12:30 PM - 02:00 PM</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber-500 text-[18px]">star</span>
                    <span className="font-bold text-gray-900">4.8</span>
                </div>
            </div>

            <div className="flex gap-3">
                <Button className="flex-1 !py-2.5 text-sm">I'm Eating</Button>
                <Button variant="outline" className="flex-1 !py-2.5 text-sm !border-red-200 !text-red-500 hover:!bg-red-50">Skip Meal</Button>
            </div>
        </div>
    </div>
);

const StudentDashboard = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome back, Rahul! 👋</h2>
                <p className="text-gray-500 text-sm mt-1">Here's what's happening with your tiffin today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Remaining Meals"
                    value="24"
                    subtext="Expiring in 28 days"
                    icon="lunch_dining"
                    color="bg-primary"
                />
                <StatCard
                    title="Wallet Balance"
                    value="₹1,250"
                    subtext="Last added ₹500"
                    icon="account_balance_wallet"
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Skipped Meals"
                    value="2"
                    subtext="Saved ₹160 this month"
                    icon="no_meals"
                    color="bg-rose-500"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Today's Menu */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Your Next Meal</h3>
                        <span className="text-primary text-sm font-bold cursor-pointer hover:underline">View Weekly Menu</span>
                    </div>
                    <MenuCard />
                </section>

                {/* Right: Recent Activity / Quick Actions */}
                <section className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="glass-panel p-5 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between p-3 hover:bg-white/50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined">calendar_month</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Pause Subscription</p>
                                        <p className="text-xs text-gray-500">Going home for weekend?</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">chevron_right</span>
                            </div>

                            <div className="flex items-center justify-between p-3 hover:bg-white/50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined">support_agent</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Help & Support</p>
                                        <p className="text-xs text-gray-500">Report an issue</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">chevron_right</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StudentDashboard;

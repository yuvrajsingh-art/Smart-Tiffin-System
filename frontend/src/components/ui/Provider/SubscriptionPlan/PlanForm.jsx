import React from 'react';

const PlanForm = ({ formData, setFormData, onSubmit, loading }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Provider Name */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#2D241E] mb-2">Provider Name</label>
                    <input
                        type="text"
                        name="providerName"
                        value={formData.providerName}
                        onChange={handleChange}
                        placeholder="e.g., Radhika Tiwari"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        required
                    />
                </div>

                {/* Kitchen Name */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#2D241E] mb-2">Kitchen Name</label>
                    <input
                        type="text"
                        name="kitchenName"
                        value={formData.kitchenName}
                        onChange={handleChange}
                        placeholder="e.g., Radhika's Kitchen"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        required
                    />
                </div>

                {/* Weekly Price */}
                <div>
                    <label className="block text-sm font-bold text-[#2D241E] mb-2">Weekly Price (₹)</label>
                    <input
                        type="number"
                        name="weeklyPrice"
                        value={formData.weeklyPrice}
                        onChange={handleChange}
                        placeholder="e.g., 800"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        required
                        min="0"
                    />
                </div>

                {/* Monthly Price */}
                <div>
                    <label className="block text-sm font-bold text-[#2D241E] mb-2">Monthly Price (₹)</label>
                    <input
                        type="number"
                        name="monthlyPrice"
                        value={formData.monthlyPrice}
                        onChange={handleChange}
                        placeholder="e.g., 3000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        required
                        min="0"
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#2D241E] mb-2">About Your Kitchen</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your kitchen, food quality, hygiene standards..."
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        required
                    />
                </div>

                {/* Features */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#2D241E] mb-2">Key Features (comma separated)</label>
                    <input
                        type="text"
                        name="features"
                        value={formData.features}
                        onChange={handleChange}
                        placeholder="e.g., Home-cooked, Hygienic, Fresh Ingredients"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        required
                    />
                </div>

                {/* Cuisines */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#2D241E] mb-2">Cuisines (comma separated)</label>
                    <input
                        type="text"
                        name="cuisines"
                        value={formData.cuisines}
                        onChange={handleChange}
                        placeholder="e.g., North Indian, South Indian, Chinese"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <span className="animate-spin material-symbols-outlined">progress_activity</span>
                        Creating Plan...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined">add_circle</span>
                        Create Subscription Plan
                    </>
                )}
            </button>
        </form>
    );
};

export default PlanForm;

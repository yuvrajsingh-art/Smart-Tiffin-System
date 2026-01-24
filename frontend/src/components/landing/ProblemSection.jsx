import React from 'react';

function ProblemSection() {
    return (
        <section className="max-w-7xl mx-auto w-full px-6 py-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-black text-secondary mb-4">The Chaos We Solve</h2>
                <p className="text-secondary/60 max-w-2xl mx-auto">Forget the hassle of managing paper coupons and calculating daily costs. We've simplified the entire mess experience.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {/* Card 1 */}
                <div className="glass-panel p-8 rounded-xl flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined">confirmation_number</span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary">Lost Coupons?</h3>
                    <p className="text-secondary/70 leading-relaxed">
                        Physical coupons get lost, washed, or stolen. With digital tracking, your meal history is always secure in your pocket.
                    </p>
                </div>
                {/* Card 2 */}
                <div className="glass-panel p-8 rounded-xl flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined">calculate</span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary">Calculation Confusion</h3>
                    <p className="text-secondary/70 leading-relaxed">
                        "Did I pay for last month?" Automated billing and transparent logs handle all the math for you and the provider.
                    </p>
                </div>
                {/* Card 3 */}
                <div className="glass-panel p-8 rounded-xl flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined">schedule</span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary">Late Delivery?</h3>
                    <p className="text-secondary/70 leading-relaxed">
                        Uncertainty is the enemy of hunger. Real-time updates ensure you know exactly when your food arrives.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default ProblemSection;

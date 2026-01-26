import React from 'react';

function HowItWorksSection() {
    return (
        <section className="py-16" id="process">
            <div className="text-center mb-16">
                <span className="text-primary font-bold uppercase tracking-wider text-sm">Simple Process</span>
                <h2 className="text-3xl lg:text-4xl font-black text-secondary mt-2">How it Works</h2>
            </div>
            <div className="relative">
                {/* Dashed Connector Line (Desktop) */}
                <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-gray-300 -translate-y-1/2 z-0"></div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center gap-4 bg-[#FFFBF5] lg:bg-transparent p-4 lg:p-0 rounded-xl">
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center shadow-lg text-primary font-black text-2xl relative">
                            1
                        </div>
                        <h3 className="text-lg font-bold text-secondary">Create Profile</h3>
                        <p className="text-sm text-secondary/60">Sign up in seconds and set your dietary preferences.</p>
                    </div>
                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center gap-4 bg-[#FFFBF5] lg:bg-transparent p-4 lg:p-0 rounded-xl">
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center shadow-lg text-primary font-black text-2xl relative">
                            2
                        </div>
                        <h3 className="text-lg font-bold text-secondary">Select Plan</h3>
                        <p className="text-sm text-secondary/60">Choose a daily, weekly, or monthly subscription plan.</p>
                    </div>
                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center gap-4 bg-[#FFFBF5] lg:bg-transparent p-4 lg:p-0 rounded-xl">
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center shadow-lg text-primary font-black text-2xl relative">
                            3
                        </div>
                        <h3 className="text-lg font-bold text-secondary">Set Location</h3>
                        <p className="text-sm text-secondary/60">Pin your delivery location or choose a pickup mess.</p>
                    </div>
                    {/* Step 4 */}
                    <div className="flex flex-col items-center text-center gap-4 bg-[#FFFBF5] lg:bg-transparent p-4 lg:p-0 rounded-xl">
                        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 font-black text-2xl relative">
                            4
                        </div>
                        <h3 className="text-lg font-bold text-secondary">Enjoy Food</h3>
                        <p className="text-sm text-secondary/60">Receive hot, fresh food or scan QR to eat instantly.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorksSection;

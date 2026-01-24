import React from 'react';

function HowItWorksSection() {
    return (
        <section className="max-w-6xl mx-auto w-full px-6" id="how-it-works">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-[#2D241E] tracking-tight mb-4">Four Simple Steps</h2>
            </div>
            <div className="relative">
                <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-4 border-dashed border-orange-200 -translate-y-1/2 z-0"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-20 h-20 bg-white rounded-full border-4 border-orange-50 flex items-center justify-center shadow-lg text-primary font-black text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">1</div>
                        <h4 className="text-2xl font-black text-[#2D241E] mb-4">Create Profile</h4>
                        <p className="text-[#5C4D42] font-medium leading-relaxed">Sign up in seconds and set your taste preferences (Veg/Non-Veg).</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-20 h-20 bg-white rounded-full border-4 border-orange-50 flex items-center justify-center shadow-lg text-primary font-black text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">2</div>
                        <h4 className="text-2xl font-black text-[#2D241E] mb-4">Select Plan</h4>
                        <p className="text-[#5C4D42] font-medium leading-relaxed">Choose a flexible weekly or monthly subscription that fits your budget.</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-20 h-20 bg-white rounded-full border-4 border-orange-50 flex items-center justify-center shadow-lg text-primary font-black text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">3</div>
                        <h4 className="text-2xl font-black text-[#2D241E] mb-4">Custom Delivery</h4>
                        <p className="text-[#5C4D42] font-medium leading-relaxed">Set your delivery location (Home/Office) and preferred lunch/dinner time.</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-20 h-20 bg-white rounded-full border-4 border-white flex items-center justify-center shadow-xl bg-gradient-to-br from-primary to-orange-600 text-white font-black text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined">restaurant</span>
                        </div>
                        <h4 className="text-2xl font-black text-[#2D241E] mb-4">Enjoy Food</h4>
                        <p className="text-[#5C4D42] font-medium leading-relaxed">Receive hot, delicious meals at your doorstep. Skip updates anytime.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorksSection;

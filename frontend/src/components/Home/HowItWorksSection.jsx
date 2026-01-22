import React from 'react';

function HowItWorksSection() {
    return (
        <section className="max-w-7xl mx-auto w-full px-6" id="how-it-works">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-black text-[#2D241E] tracking-tight mb-6">Four Simple Steps</h2>
            </div>
            <div className="relative">
                <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-4 border-dashed border-orange-200 -translate-y-1/2 z-0"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-white rounded-full border-8 border-orange-50 flex items-center justify-center shadow-xl text-primary font-black text-3xl mb-8">1</div>
                        <h4 className="text-2xl font-black text-[#2D241E] mb-4">Sign Up</h4>
                        <p className="text-[#5C4D42] font-medium leading-relaxed">Join as a student or register your mess business in seconds.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-white rounded-full border-8 border-orange-50 flex items-center justify-center shadow-xl text-primary font-black text-3xl mb-8">2</div>
                        <h4 className="text-2xl font-black text-[#2D241E] mb-4">Choose Plan</h4>
                        <p className="text-[#5C4D42] font-medium leading-relaxed">Browse menus and select the subscription that fits your appetite.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-white rounded-full border-8 border-orange-50 flex items-center justify-center shadow-xl text-primary font-black text-3xl mb-8">3</div>
                        <h4 className="text-2xl font-black text-[#2D241E] mb-4">Activate</h4>
                        <p className="text-[#5C4D42] font-medium leading-relaxed">Secure online payments with instant plan activation.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-white rounded-full border-8 border-orange-50 flex items-center justify-center shadow-xl text-primary font-black text-3xl mb-8">4</div>
                        <h4 className="text-2xl font-black text-[#2D241E] mb-4">Eat Healthy</h4>
                        <p className="text-[#5C4D42] font-medium leading-relaxed">Scan your QR at the counter and enjoy your hot, nutritious thali.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorksSection;

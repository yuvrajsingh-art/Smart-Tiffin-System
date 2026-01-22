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
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-white rounded-full border-4 border-orange-50 flex items-center justify-center shadow-lg text-primary font-black text-2xl mb-6">1</div>
                        <h4 className="text-2xl font-black text-[#2D241E] mb-4">Sign Up</h4>
                        <p className="text-[#5C4D42] font-medium leading-relaxed">Join as a student or register your mess business in seconds.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-white rounded-full border-4 border-orange-50 flex items-center justify-center shadow-lg text-primary font-black text-2xl mb-6">2</div>
                        <h4 className="text-2xl font-black text-[#2D241E] mb-4">Choose Plan</h4>
                        <p className="text-[#5C4D42] font-medium leading-relaxed">Browse menus and select the subscription that fits your appetite.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-white rounded-full border-4 border-orange-50 flex items-center justify-center shadow-lg text-primary font-black text-2xl mb-6">3</div>
                        <h4 className="text-2xl font-black text-[#2D241E] mb-4">Activate</h4>
                        <p className="text-[#5C4D42] font-medium leading-relaxed">Secure online payments with instant plan activation.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-white rounded-full border-4 border-orange-50 flex items-center justify-center shadow-lg text-primary font-black text-2xl mb-6">4</div>
                        <h4 className="text-2xl font-black text-[#2D241E] mb-4">Eat Healthy</h4>
                        <p className="text-[#5C4D42] font-medium leading-relaxed">Scan your QR at the counter and enjoy your hot, nutritious thali.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorksSection;

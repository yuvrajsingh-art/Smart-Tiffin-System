import React from 'react';

function HowItWorksSection() {
    return (
        <section className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#111716] tracking-tight">How It Works</h2>
            </div>
            <div className="relative">
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent border-t-2 border-dashed border-primary/30 z-0"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-24 h-24 bg-white rounded-full border-4 border-orange-100 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-6">
                            <span className="material-symbols-outlined text-3xl text-primary">person_add</span>
                        </div>
                        <h4 className="text-lg font-bold mb-2">1. Sign Up</h4>
                        <p className="text-sm text-gray-500 px-4">Create your profile as a student or mess owner.</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-24 h-24 bg-white rounded-full border-4 border-orange-100 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-6">
                            <span className="material-symbols-outlined text-3xl text-primary">touch_app</span>
                        </div>
                        <h4 className="text-lg font-bold mb-2">2. Choose</h4>
                        <p className="text-sm text-gray-500 px-4">Select your preferred mess and subscription plan.</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-24 h-24 bg-white rounded-full border-4 border-orange-100 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-6">
                            <span className="material-symbols-outlined text-3xl text-primary">credit_card</span>
                        </div>
                        <h4 className="text-lg font-bold mb-2">3. Subscribe</h4>
                        <p className="text-sm text-gray-500 px-4">Pay securely online to activate your meal plan.</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-24 h-24 bg-white rounded-full border-4 border-orange-100 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-6">
                            <span className="material-symbols-outlined text-3xl text-primary">sentiment_satisfied</span>
                        </div>
                        <h4 className="text-lg font-bold mb-2">4. Enjoy</h4>
                        <p className="text-sm text-gray-500 px-4">Scan your QR code and enjoy delicious food.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorksSection

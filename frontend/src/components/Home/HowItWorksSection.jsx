import React from 'react';

function HowItWorksSection() {
    return (
        <section className="max-w-7xl mx-auto w-full px-4 md:px-8">
            <div className="text-center mb-16">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 tracking-tight">How It Works</h2>
                </div>
                <div className="relative">
                    <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent border-t-2 border-dashed border-primary/20 z-0"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-white rounded-full border-4 border-orange-50 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-5">
                                <span className="material-symbols-outlined text-2xl text-primary">person_add</span>
                            </div>
                            <h4 className="text-base font-bold mb-1">1. Sign Up</h4>
                            <p className="text-sm text-gray-500 px-2 leading-relaxed">Create your profile as a student or mess owner.</p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-white rounded-full border-4 border-orange-50 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-5">
                                <span className="material-symbols-outlined text-2xl text-primary">touch_app</span>
                            </div>
                            <h4 className="text-base font-bold mb-1">2. Choose</h4>
                            <p className="text-sm text-gray-500 px-2 leading-relaxed">Select your preferred mess and subscription plan.</p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-white rounded-full border-4 border-orange-50 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-5">
                                <span className="material-symbols-outlined text-2xl text-primary">credit_card</span>
                            </div>
                            <h4 className="text-base font-bold mb-1">3. Subscribe</h4>
                            <p className="text-sm text-gray-500 px-2 leading-relaxed">Pay securely online to activate your meal plan.</p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-white rounded-full border-4 border-orange-50 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-5">
                                <span className="material-symbols-outlined text-2xl text-primary">sentiment_satisfied</span>
                            </div>
                            <h4 className="text-base font-bold mb-1">4. Enjoy</h4>
                            <p className="text-sm text-gray-500 px-2 leading-relaxed">Scan your QR code and enjoy delicious food.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default HowItWorksSection

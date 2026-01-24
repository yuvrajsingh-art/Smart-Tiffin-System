import React from 'react';

function ProblemSection() {
    return (
        <section className="max-w-6xl mx-auto w-full px-6">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black text-[#2D241E] tracking-tight mb-4">The Chaos We Solve</h2>
                <p className="text-lg text-[#5C4D42] max-w-2xl mx-auto font-medium">Traditional mess management is full of friction. We've turned those headaches into a smooth digital flow.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-[2rem] flex flex-col items-center text-center gap-4 hover:border-primary/30 transition-all duration-500 group">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-3xl">menu_book</span>
                    </div>
                    <h3 className="text-xl font-black text-[#2D241E]">Lost Coupons?</h3>
                    <p className="text-[#5C4D42] leading-relaxed text-sm">Stop worrying about paper coupons or tokens. Your phone is now your meal pass.</p>
                </div>
                <div className="glass-panel p-6 rounded-[2rem] flex flex-col items-center text-center gap-4 hover:border-primary/30 transition-all duration-500 group">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-3xl">sentiment_dissatisfied</span>
                    </div>
                    <h3 className="text-xl font-black text-[#2D241E]">Boring Daily Menu</h3>
                    <p className="text-[#5C4D42] leading-relaxed text-sm">Don't eat the same dal every day. Vote for your favorite dishes and diverse weekly menus.</p>
                </div>
                <div className="glass-panel p-6 rounded-[2rem] flex flex-col items-center text-center gap-4 hover:border-primary/30 transition-all duration-500 group">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-3xl">history_toggle_off</span>
                    </div>
                    <h3 className="text-xl font-black text-[#2D241E]">Late Delivery?</h3>
                    <p className="text-[#5C4D42] leading-relaxed text-sm">Track your tiffin in real-time. Know exactly when your hot food arrives at your door.</p>
                </div>
            </div>
        </section>
    )
}

export default ProblemSection;

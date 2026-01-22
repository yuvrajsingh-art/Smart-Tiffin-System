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
                    <h3 className="text-xl font-black text-[#2D241E]">Manual Registers</h3>
                    <p className="text-[#5C4D42] leading-relaxed text-sm">Ditch the messy notebooks. Eliminate human error and lost records with 100% digital logs.</p>
                </div>
                <div className="glass-panel p-6 rounded-[2rem] flex flex-col items-center text-center gap-4 hover:border-primary/30 transition-all duration-500 group">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-3xl">calculate</span>
                    </div>
                    <h3 className="text-xl font-black text-[#2D241E]">Calculation Confusion</h3>
                    <p className="text-[#5C4D42] leading-relaxed text-sm">Automated billing ensures every penny is accounted for. No more end-of-month disputes.</p>
                </div>
                <div className="glass-panel p-6 rounded-[2rem] flex flex-col items-center text-center gap-4 hover:border-primary/30 transition-all duration-500 group">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-3xl">history_toggle_off</span>
                    </div>
                    <h3 className="text-xl font-black text-[#2D241E]">Lack of Tracking</h3>
                    <p className="text-[#5C4D42] leading-relaxed text-sm">Real-time visibility for both students and owners. Know your status, anytime, anywhere.</p>
                </div>
            </div>
        </section>
    )
}

export default ProblemSection;

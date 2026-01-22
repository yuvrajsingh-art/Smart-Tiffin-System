import React from 'react';

function CTASection() {
    return (
        <section className="max-w-6xl mx-auto w-full py-10 px-6">
            <div className="glass-panel p-12 md:p-20 rounded-[4rem] text-center relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-white/60 to-orange-50/60">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-orange-100/50 pointer-events-none"></div>
                <h2 className="text-4xl md:text-6xl font-black text-[#2D241E] mb-8 relative z-10 leading-tight">Ready to simplify your <br /> mess management?</h2>
                <p className="text-xl text-[#5C4D42] font-semibold mb-12 max-w-2xl mx-auto relative z-10">Join thousands of students and owners in the digital revolution of food services.</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                    <button className="bg-primary text-white text-xl font-black px-12 py-5 rounded-3xl shadow-2xl shadow-primary/30 hover:scale-105 hover:shadow-primary/50 transition-all duration-300">
                        Register Now
                    </button>
                    <button className="bg-white/90 text-primary border-2 border-primary/20 text-xl font-black px-12 py-5 rounded-3xl hover:bg-white transition-all duration-300">
                        Talk to Sales
                    </button>
                </div>
            </div>
        </section>
    )
}

export default CTASection

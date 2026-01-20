import React from 'react';

function CTASection() {
    return (
        <section className="max-w-5xl mx-auto w-full text-center py-12">
            <div className="glass-panel p-12 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-orange-500/10 pointer-events-none"></div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#111716] mb-6 relative z-10">Ready to simplify your <br /> mess management?</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto relative z-10">Join hundreds of students and mess owners streamlining their daily food experience.</p>
                <button className="relative z-10 bg-primary text-white text-lg font-bold px-10 py-4 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300">
                    Register Now
                </button>
            </div>
        </section>
    )
}

export default CTASection

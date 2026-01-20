import React from 'react';

function CTASection() {
    return (
        <section className="max-w-5xl mx-auto w-full text-center py-12 px-4 md:px-8">
            <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-orange-500/5 pointer-events-none"></div>
                <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 mb-4 relative z-10 tracking-tight">Ready to simplify your <br /> mess management?</h2>
                <p className="text-base text-gray-600 mb-8 max-w-lg mx-auto relative z-10 leading-relaxed">Join hundreds of students and mess owners streamlining their daily food experience.</p>
                <button className="relative z-10 bg-primary text-white text-base font-bold px-8 py-3 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300">
                    Register Now
                </button>
            </div>
        </section>
    )
}

export default CTASection

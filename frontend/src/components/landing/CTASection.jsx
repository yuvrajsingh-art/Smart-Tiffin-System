import React from 'react';
import { Link } from 'react-router-dom';

function CTASection() {
    return (
        <section className="py-12">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/30">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600"></div>
                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="relative z-10 px-8 py-16 md:py-24 text-center flex flex-col items-center gap-6">
                    <h2 className="text-3xl md:text-5xl font-black text-white max-w-3xl">Ready to digitize your food experience?</h2>
                    <p className="text-orange-100 text-lg max-w-2xl">Join thousands of students and mess owners today. It's time to eat smart.</p>
                    <Link to="/role-selection" className="mt-4 bg-white text-orange-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-colors shadow-lg">Join Now - It's Free</Link>
                </div>
            </div>
        </section>
    )
}

export default CTASection

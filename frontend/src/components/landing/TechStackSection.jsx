import React from 'react';

function TechStackSection() {
    return (
        <section className="py-12 border-y border-secondary/5 bg-white/30 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-sm font-bold uppercase text-secondary/40">Powered by</span>
                {/* Logos using text for simplicity in this exercise, normally SVGs */}
                <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined">code</span> React</div>
                <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined">dns</span> Node.js</div>
                <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined">database</span> MongoDB</div>
                <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined">cloud</span> AWS</div>
            </div>
        </section>
    )
}

export default TechStackSection;

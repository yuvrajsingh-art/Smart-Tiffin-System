import React from 'react';

function TechStackSection() {
    return (
        <section className="max-w-4xl mx-auto w-full px-4 md:px-8">
            <div className="glass-panel p-8 rounded-2xl">
                <h3 className="text-center text-lg font-semibold text-gray-500 mb-8 uppercase tracking-widest">Powered By Modern Tech</h3>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-24 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-5xl text-[#61DAFB]">code</span>
                        <span className="font-bold text-sm">React</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-5xl text-[#339933]">dns</span>
                        <span className="font-bold text-sm">Node.js</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-5xl text-[#47A248]">database</span>
                        <span className="font-bold text-sm">MongoDB</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TechStackSection

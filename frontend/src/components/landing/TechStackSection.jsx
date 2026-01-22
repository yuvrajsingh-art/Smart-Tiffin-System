import React from 'react';

function TechStackSection() {
    return (
        <section className="max-w-4xl mx-auto w-full px-6">
            <div className="glass-panel p-10 md:p-14 rounded-[3rem] text-center">
                <h3 className="text-sm font-black text-primary mb-12 uppercase tracking-[0.3em]">Built with Modern Stack</h3>
                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
                    <div className="flex flex-col items-center gap-4 group">
                        <div className="size-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                            <span className="material-symbols-outlined text-4xl text-[#61DAFB]">deployed_code</span>
                        </div>
                        <span className="font-extrabold text-[#2D241E]">React.js</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 group">
                        <div className="size-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                            <span className="material-symbols-outlined text-4xl text-[#339933]">dns</span>
                        </div>
                        <span className="font-extrabold text-[#2D241E]">Node.js</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 group">
                        <div className="size-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                            <span className="material-symbols-outlined text-4xl text-[#47A248]">database</span>
                        </div>
                        <span className="font-extrabold text-[#2D241E]">MongoDB</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 group">
                        <div className="size-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                            <span className="material-symbols-outlined text-4xl text-primary">speed</span>
                        </div>
                        <span className="font-extrabold text-[#2D241E]">Express</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TechStackSection;

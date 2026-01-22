import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
    return (
        <section className="glass-panel rounded-[3rem] p-8 md:p-16 lg:p-20 relative overflow-hidden mx-4 md:mx-8 max-w-[1440px] md:self-center">
            <div className="absolute -right-20 -top-20 w-[700px] h-[700px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
                <div className="flex-1 flex flex-col gap-8 text-center lg:text-left items-center lg:items-start">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/50 border border-orange-200 text-primary text-xs font-black uppercase tracking-widest">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Digital Mess System v3.0
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-[#2D241E] leading-[1.05] tracking-tight">
                        Smart Mess <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-amber-500">Management</span> <br />
                        System
                    </h1>
                    <p className="text-lg md:text-2xl text-[#5C4D42] max-w-xl font-medium leading-relaxed">
                        Elevate your tiffin service experience. Automated subscriptions, digital menus, and real-time tracking in one warm, easy-to-use interface.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
                        <button className="bg-primary text-white text-lg font-extrabold px-10 py-5 rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 min-w-[220px]">
                            Get Started Free
                        </button>
                        <button className="bg-white/80 text-[#2D241E] border border-orange-100 text-lg font-extrabold px-10 py-5 rounded-2xl shadow-sm hover:border-primary/40 hover:text-primary transition-all duration-300 flex items-center justify-center gap-3 min-w-[220px]">
                            Watch Demo
                        </button>
                    </div>
                </div>
                <div className="flex-1 w-full relative">
                    <div className="relative w-full aspect-square max-w-[550px] mx-auto">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-orange-200/30 rounded-full blur-3xl"></div>
                        <img
                            className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(255,107,0,0.2)] rounded-full border-8 border-white/20"
                            alt="Thali view"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjH1r5x4ip3JwmaWlGEf1CDDJiy5PvwRX4UMhIOdBjN5JPKcTMQ8FbIfTccSSjGN_f4cQBOwfgYBpWi-3fCtHKo_aSuXUOoQFtgzNXAGL48GeF5Zz_9wFsDT2KKUlqTpegQSyB5PMtX67sYMbK1zmWdJKEWgp_ax3vFrfd-gFkx6HI-QEi4QousvxXs5WNIkE1HCexE9IjLoJNeNF0Qioe1E3Rt_S_X27REp9TRgx3hsIo2iSJjO-R5h9gjhD2jnmMHhEIM5QZ074"
                            style={{ maskImage: 'radial-gradient(circle, black 70%, transparent 100%)' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection;
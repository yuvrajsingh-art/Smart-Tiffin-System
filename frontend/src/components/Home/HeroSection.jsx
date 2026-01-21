import React from 'react';

function HeroSection() {
    return (
        <section className="relative z-10 pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto flex flex-col gap-24">
            <div className="glass-panel rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
                    <div className="flex-1 flex flex-col gap-8 text-center lg:text-left items-center lg:items-start">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Digital Mess System v1.0
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#111716] leading-[1.1] tracking-tight">
                            Smart Mess <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Management</span> <br />
                            System
                        </h1>
                        <p className="text-lg md:text-xl text-[#6A717B] max-w-lg font-medium leading-relaxed">
                            Automate your tiffin service. Say goodbye to manual registers and hello to seamless subscriptions, daily menu updates, and real-time tracking.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button className="bg-[#111716] text-white text-base font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 min-w-[200px]">
                                Get Started
                            </button>
                            <button className="bg-white text-[#111716] border border-gray-200 text-base font-bold px-8 py-4 rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 hover:text-primary transition-all duration-300 flex items-center justify-center gap-3 min-w-[200px]">
                                Login
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 w-full relative perspective-1000">
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto animate-float">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/20 rounded-full blur-3xl"></div>
                            <img
                                className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-full"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjH1r5x4ip3JwmaWlGEf1CDDJiy5PvwRX4UMhIOdBjN5JPKcTMQ8FbIfTccSSjGN_f4cQBOwfgYBpWi-3fCtHKo_aSuXUOoQFtgzNXAGL48GeF5Zz_9wFsDT2KKUlqTpegQSyB5PMtX67sYMbK1zmWdJKEWgp_ax3vFrfd-gFkx6HI-QEi4QousvxXs5WNIkE1HCexE9IjLoJNeNF0Qioe1E3Rt_S_X27REp9TRgx3hsIo2iSJjO-R5h9gjhD2jnmMHhEIM5QZ074"
                                style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}
                                alt="Smart Tiffin Dashboard"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
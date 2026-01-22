import React from 'react';

function Header() {
    return (
        <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="size-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-[24px]">lunch_dining</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-[#111716] group-hover:text-primary transition-colors">Smart Tiffin</span>
                </div>
                <div className="hidden md:flex items-center bg-white/40 rounded-full px-2 py-1 border border-white/60 shadow-sm backdrop-blur-sm">
                    <a className="px-5 py-2 text-sm font-semibold text-[#111716] hover:text-primary transition-colors rounded-full hover:bg-white/50" href="#">Home</a>
                    <a className="px-5 py-2 text-sm font-semibold text-[#6A717B] hover:text-primary transition-colors rounded-full hover:bg-white/50" href="#features">Features</a>
                    <a className="px-5 py-2 text-sm font-semibold text-[#6A717B] hover:text-primary transition-colors rounded-full hover:bg-white/50" href="#roles">Roles</a>
                    <a className="px-5 py-2 text-sm font-semibold text-[#6A717B] hover:text-primary transition-colors rounded-full hover:bg-white/50" href="#contact">Contact</a>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-sm font-bold text-[#111716] hover:text-primary transition-colors">Login</button>
                    <button className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                        <span>Get Started</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Header
import React, { useState, useEffect } from 'react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle body scroll lock when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Features', href: '#features' },
        { name: 'Roles', href: '#roles' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-white/50 h-20' : 'bg-transparent h-24'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 relative z-[70]">
                        <div className="size-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                            <span className="material-symbols-outlined text-[24px]">lunch_dining</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#111716] whitespace-nowrap">
                            Smart Tiffin
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-2 bg-white/40 px-2 py-1.5 rounded-full border border-white/60 backdrop-blur-sm shadow-sm opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]" style={{ animationDelay: '0.1s' }}>
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="px-6 py-2.5 text-sm font-semibold text-[#111716]/80 hover:text-white hover:bg-[#111716] transition-all duration-300 rounded-full"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        <button className="text-sm font-bold text-[#111716] hover:text-primary transition-colors px-4 py-2">
                            Login
                        </button>
                        <button className="bg-primary text-white text-sm font-bold px-6 py-3 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:bg-orange-600 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2">
                            <span>Get Started</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                    </div>

                    {/* Mobile Toggle Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden relative z-[70] p-2 text-[#111716] hover:bg-black/5 rounded-lg transition-colors group"
                        aria-label="Toggle menu"
                    >
                        <span className={`material-symbols-outlined text-3xl transition-transform duration-300 group-hover:scale-110 ${isMenuOpen ? 'rotate-90' : ''}`}>
                            {isMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-[50] bg-[#FFF8F0] lg:hidden transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col pt-32 px-6 ${isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
                    }`}
            >
                {/* Mobile Links */}
                <nav className="flex flex-col gap-6 w-full">
                    {navLinks.map((link, index) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-3xl font-bold text-[#111716] border-b border-black/5 pb-4 active:text-primary transition-colors"
                            style={{
                                transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                                opacity: isMenuOpen ? 1 : 0,
                                transform: isMenuOpen ? 'translateY(0)' : 'translateY(10px)',
                                transition: 'all 0.3s ease-out'
                            }}
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Mobile Buttons */}
                <div
                    className="flex flex-col gap-4 mt-auto mb-10"
                    style={{
                        opacity: isMenuOpen ? 1 : 0,
                        transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.4s ease-out 0.2s'
                    }}
                >
                    <button className="w-full py-4 rounded-xl border-2 border-[#111716]/10 text-lg font-bold text-[#111716] hover:bg-[#111716]/5 transition-colors">
                        Login
                    </button>
                    <button className="w-full py-4 rounded-xl bg-primary text-white text-lg font-bold shadow-xl shadow-primary/20 hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                        <span>Get Started</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Header;
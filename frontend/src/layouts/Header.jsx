import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    // Handle scroll effect for glassmorphism and active link
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            // Active Section Logic
            const sections = ['home', 'features', 'roles', 'how-it-works'];
            const scrollPosition = window.scrollY + 100; // Offset for header height

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                    setActiveSection(section);
                }
            }
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
        { name: 'Home', href: '#home', id: 'home' },
        { name: 'Features', href: '#features', id: 'features' },
        { name: 'Roles', href: '#roles', id: 'roles' },
        { name: 'Process', href: '#how-it-works', id: 'how-it-works' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav h-16' : 'bg-transparent h-20'}`}>
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="size-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-[24px]">lunch_dining</span>
                    </div>
                    <span className="text-2xl font-black text-[#2D241E] tracking-tight">Smart Tiffin</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 ${activeSection === link.id ? 'text-primary after:w-full' : 'text-gray-600 hover:text-primary after:w-0 hover:after:w-full'}`}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        to="/login"
                        className="text-sm font-bold text-gray-700 hover:text-primary transition-colors px-4 py-2"
                    >
                        Login
                    </Link>
                    <Link
                        to="/role-selection"
                        className="bg-[#111716] text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group"
                    >
                        Get Started
                        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden w-10 h-10 flex items-center justify-center text-gray-700"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span className="material-symbols-outlined text-2xl">
                        {isMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-xl transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-[400px] py-6' : 'max-h-0 py-0'}`}>
                <div className="px-6 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`text-base font-medium ${activeSection === link.id ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="h-px bg-gray-100 my-2"></div>
                    <Link
                        to="/login"
                        className="text-base font-bold text-gray-900"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Login
                    </Link>
                    <Link
                        to="/login"
                        className="bg-primary text-white text-base font-bold py-3 rounded-xl shadow-lg w-full text-center block"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Header;
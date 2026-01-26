import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const location = useLocation();
    const navigate = useNavigate();

    // Handle scroll effect for glassmorphism and active link
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            // Active Section Logic
            // The navLinks have simple names but their hashes are #features, #process, #pricing, #reviews
            // 'home' is a catch-all for top
            // Note: code.html used id="features", id="process", etc.
            const sections = ['features', 'process', 'pricing', 'reviews'];
            const scrollPosition = window.scrollY + 120; // Offset for header + padding

            // Improved Active Detection logic
            let current = 'home';
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.offsetTop <= scrollPosition) {
                    current = '#' + section;
                }
            }
            // Check if we are near top
            if (window.scrollY < 100) current = 'home';

            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        setIsMenuOpen(false);

        // If we are not on the home page, go there first
        if (location.pathname !== '/') {
            navigate('/');
            // Wait for navigation then scroll
            setTimeout(() => {
                const element = document.querySelector(sectionId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            // We are already on home
            const element = document.querySelector(sectionId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How it works', href: '#process' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Reviews', href: '#reviews' },
    ];

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'glass-nav py-2 shadow-sm' : 'bg-transparent py-4'}`}>
            <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-orange-300 flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[20px]">lunch_dining</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">
                        Smart Tiffin
                    </h1>
                </div>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => scrollToSection(e, link.href)}
                            className={`text-sm font-bold transition-all duration-300 relative 
                                after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-primary after:transition-all after:duration-300
                                ${activeSection === link.href ? 'text-primary after:w-full' : 'text-secondary/80 hover:text-primary after:w-0 hover:after:w-full'}
                            `}
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Auth Button */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        to="/login"
                        className="text-sm font-bold text-secondary/80 hover:text-primary transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        to="/role-selection"
                        className="bg-black hover:bg-secondary/90 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg shadow-black/20"
                    >
                        Get Started
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
                            className={`text-base font-bold ${activeSection === link.href ? 'text-primary' : 'text-secondary/80 hover:text-primary'}`}
                            onClick={(e) => scrollToSection(e, link.href)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="h-px bg-gray-100 my-2"></div>
                    <Link
                        to="/login"
                        className="text-base font-bold text-secondary/80 hover:text-primary text-center py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Login
                    </Link>
                    <Link
                        to="/role-selection"
                        className="bg-black text-white text-base font-bold py-3 rounded-full shadow-lg w-full text-center block"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
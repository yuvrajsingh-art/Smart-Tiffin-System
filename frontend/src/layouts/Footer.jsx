import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';

function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, success, error

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email) return;

        // Simulate API call
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <footer className="bg-white border-t border-orange-100/50 pt-24 pb-12 mt-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] -z-10"></div>

            <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Logo />
                        <p className="text-[#5C4D42] leading-relaxed text-sm font-medium">
                            Revolutionizing the way students and professionals access healthy, homemade meals.
                            Connecting hungry bellies with caring kitchens since 2024.
                        </p>
                        <div className="flex gap-4">
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                                <a key={social} href="#" className="size-10 rounded-full bg-orange-50 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-[#5C4D42] shadow-sm hover:shadow-lg hover:-translate-y-1">
                                    <i className={`fab fa-${social}`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-black mb-6 text-[#2D241E]">Product</h3>
                        <ul className="space-y-4">
                            <li><Link to="/role-selection" className="text-[#5C4D42] hover:text-primary transition-colors text-sm font-medium">Find a Mess</Link></li>
                            <li><Link to="/role-selection" className="text-[#5C4D42] hover:text-primary transition-colors text-sm font-medium">Partner with Us</Link></li>
                            <li><Link to="#features" className="text-[#5C4D42] hover:text-primary transition-colors text-sm font-medium">Features</Link></li>
                            <li><Link to="#pricing" className="text-[#5C4D42] hover:text-primary transition-colors text-sm font-medium">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-lg font-black mb-6 text-[#2D241E]">Company</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-[#5C4D42] hover:text-primary transition-colors text-sm font-medium">About Us</a></li>
                            <li><a href="#" className="text-[#5C4D42] hover:text-primary transition-colors text-sm font-medium">Careers</a></li>
                            <li><a href="#" className="text-[#5C4D42] hover:text-primary transition-colors text-sm font-medium">Blog</a></li>
                            <li><a href="#" className="text-[#5C4D42] hover:text-primary transition-colors text-sm font-medium">Contact</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-black mb-6 text-[#2D241E]">Stay Updated</h3>
                        <p className="text-[#5C4D42] text-sm mb-4 font-medium">Get the latest offers and menu updates right in your inbox.</p>
                        <form onSubmit={handleSubscribe} className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-4 pr-12 text-[#2D241E] placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 size-8 bg-primary rounded-lg flex items-center justify-center text-white hover:bg-orange-600 transition-colors shadow-md">
                                <span className="material-symbols-outlined text-sm">send</span>
                            </button>
                        </form>
                        {status === 'success' && (
                            <div className="mt-3 flex items-center gap-2 text-green-600 text-xs font-bold animate-pulse bg-green-50 px-3 py-2 rounded-lg inline-flex">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Subscribed successfully!
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm font-medium">© 2024 Smart Tiffin System. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-primary text-sm font-medium transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-primary text-sm font-medium transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;

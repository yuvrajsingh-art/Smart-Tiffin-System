import React from 'react';

function Footer() {
    return (
        <footer className="relative z-10 bg-[#111716] text-white pt-20 pb-10 overflow-hidden font-display">
            {/* Background Gradient/Pattern */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                    {/* Brand Column (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-[24px]">lunch_dining</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">Smart Tiffin</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
                            Revolutionizing tiffin management with smart tracking and seamless payments. Designed for students, built for efficiency.
                        </p>
                        <div className="flex gap-4 mt-2">
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map((icon) => (
                                <a
                                    key={icon}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 group"
                                >
                                    <i className={`fa-brands fa-${icon} text-lg`}></i>
                                    {/* Fallback to material icons if font-awesome not present */}
                                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">
                                        {icon === 'twitter' ? 'flutter_dash' : icon === 'instagram' ? 'camera_alt' : icon === 'linkedin' ? 'work' : 'public'}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns (2 cols each) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-lg mb-6 text-white">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            {['Features', 'For Students', 'For Mess Owners', 'Pricing', 'Releases'].map((item) => (
                                <li key={item}><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200" href="#">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            {['About Us', 'Careers', 'Contact', 'Blog', 'Press'].map((item) => (
                                <li key={item}><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200" href="#">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Column (4 cols) */}
                    <div className="lg:col-span-4">
                        <h4 className="font-bold text-lg mb-6 text-white">Stay in the loop</h4>
                        <p className="text-gray-400 text-sm mb-6">Join our newsletter to get the latest updates and simplified tiffin hacks.</p>
                        <form className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans"
                            />
                            <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                <span>Subscribe Now</span>
                                <span className="material-symbols-outlined text-[18px]">send</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500">
                    <div>© 2024 Smart Tiffin Systems. All rights reserved.</div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer

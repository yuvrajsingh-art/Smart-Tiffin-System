import React from 'react';

function Footer() {
    return (
        <footer className="relative z-10 border-t border-white/40 bg-white/60 backdrop-blur-md mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="size-8 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-[18px]">lunch_dining</span>
                            </div>
                            <span className="text-lg font-bold text-[#111716]">Smart Tiffin</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                            A comprehensive solution for tiffin services and mess management, designed for modern needs.
                        </p>
                        <div className="flex gap-4">
                            <a className="text-gray-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">thumb_up</span></a>
                            <a className="text-gray-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">share</span></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#111716] mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><a className="hover:text-primary transition-colors" href="#">Features</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">For Students</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">For Mess Owners</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#111716] mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#111716] mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <div>© 2024 Smart Tiffin Project. All rights reserved.</div>
                    <div className="flex items-center gap-1">
                        Made with <span className="text-red-500 material-symbols-outlined text-[14px]">favorite</span> by Final Year Students
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer

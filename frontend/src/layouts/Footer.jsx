import React from 'react';
// Logo import removed

function Footer() {
    return (
        <footer className="relative z-10 border-t border-orange-100 bg-white/70 backdrop-blur-xl pt-24 pb-12 font-display">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-2xl font-black text-primary tracking-tighter">Smart Tiffin</span>
                        </div>
                        <p className="text-[#5C4D42] font-medium leading-relaxed mb-8">
                            Solving the core challenges of community food management through intuitive digital tools.
                        </p>
                        <div className="flex gap-4">
                            <a className="size-10 rounded-full bg-orange-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300" href="#"><span className="material-symbols-outlined text-sm">alternate_email</span></a>
                            <a className="size-10 rounded-full bg-orange-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300" href="#"><span className="material-symbols-outlined text-sm">public</span></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-black text-[#2D241E] mb-8 uppercase tracking-widest text-sm">Solutions</h4>
                        <ul className="space-y-4">
                            <li><a className="text-[#5C4D42] font-bold hover:text-primary transition-colors" href="#">For Students</a></li>
                            <li><a className="text-[#5C4D42] font-bold hover:text-primary transition-colors" href="#">For Mess Owners</a></li>
                            <li><a className="text-[#5C4D42] font-bold hover:text-primary transition-colors" href="#">College Admins</a></li>
                            <li><a className="text-[#5C4D42] font-bold hover:text-primary transition-colors" href="#">Vendor Dashboard</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-[#2D241E] mb-8 uppercase tracking-widest text-sm">Support</h4>
                        <ul className="space-y-4">
                            <li><a className="text-[#5C4D42] font-bold hover:text-primary transition-colors" href="#">Documentation</a></li>
                            <li><a className="text-[#5C4D42] font-bold hover:text-primary transition-colors" href="#">API Access</a></li>
                            <li><a className="text-[#5C4D42] font-bold hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                            <li><a className="text-[#5C4D42] font-bold hover:text-primary transition-colors" href="#">Terms of Use</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-[#2D241E] mb-8 uppercase tracking-widest text-sm">Stay Updated</h4>
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-[#5C4D42] font-medium">Get the latest updates on new mess additions.</p>
                            <div className="flex gap-2">
                                <input className="bg-orange-50/50 border-orange-100 rounded-xl px-4 py-3 text-sm flex-1 focus:ring-primary focus:border-primary" placeholder="Your email" type="email" />
                                <button className="bg-primary text-white p-3 rounded-xl shadow-lg"><span className="material-symbols-outlined">send</span></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-orange-100 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
                    <div className="text-[#5C4D42] font-bold">© 2024 Smart Tiffin Final Year Project. Designed with passion.</div>
                    <div className="flex items-center gap-2 font-bold text-primary bg-orange-100 px-5 py-2 rounded-full">
                        <span>Handcrafted with</span>
                        <span className="material-symbols-outlined text-[18px] fill-current">favorite</span>
                        <span>by Team Tiffin</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;

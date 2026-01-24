import React from 'react';
// Logo import removed

function Footer() {
    return (
        <footer className="bg-white border-t border-orange-100 py-12 mt-10">
            <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-orange-300 flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[20px]">lunch_dining</span>
                    </div>
                    <span className="text-xl font-bold text-secondary">Smart Tiffin</span>
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                    <a className="text-sm font-medium text-secondary/60 hover:text-primary" href="#">Privacy Policy</a>
                    <a className="text-sm font-medium text-secondary/60 hover:text-primary" href="#">Terms of Service</a>
                    <a className="text-sm font-medium text-secondary/60 hover:text-primary" href="#">Contact Support</a>
                    <a className="text-sm font-medium text-secondary/60 hover:text-primary" href="#">Partner Login</a>
                </div>
                <p className="text-sm text-secondary/40">© 2023 Smart Tiffin. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer;

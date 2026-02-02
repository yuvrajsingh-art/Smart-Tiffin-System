import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-orange-300 rounded-full flex items-center justify-center text-white shadow-md">
                <span className="material-symbols-outlined text-[18px]">lunch_dining</span>
            </div>
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#2D241E] to-primary">
                Smart Tiffin
            </span>
        </Link>
    );
};

export default Logo;
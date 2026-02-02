import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = "" }) => {
    return (
        <Link to="/" className={`flex items-center gap-2 ${className}`}>
            <div className="size-8 rounded-full bg-gradient-to-tr from-[#FF5724] to-orange-300 flex items-center justify-center text-white shadow-md">
                <span className="material-symbols-outlined text-[18px]">lunch_dining</span>
            </div>
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#2D241E] to-[#FF5724]">Smart Tiffin</span>
        </Link>
    );
};

export default Logo;

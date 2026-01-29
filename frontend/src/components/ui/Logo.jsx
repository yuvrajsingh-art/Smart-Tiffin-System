import React from 'react';
import { Link } from 'react-router-dom';

function Logo() {
    return (
        <Link 
            to="/" 
            className="flex items-center gap-3 group cursor-pointer"
        >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-2xl">lunch_dining</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-primary transition-colors">
                Smart Tiffin
            </span>
        </Link>
    )
}

export default Logo;

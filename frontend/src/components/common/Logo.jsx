import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({
    className = "",
    iconSize = "text-[20px]",
    size = "h-10",
    showText = true,
    textColor = "text-[#2D241E]",
    variant = "default" // 'default', 'white', 'compact'
}) => {
    return (
        <Link to="/" className={`flex items-center gap-3 group ${className}`}>
            <div className={`${size} aspect-square bg-gradient-to-tr from-orange-500 to-orange-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 transition-transform group-hover:scale-105`}>
                <span className={`material-symbols-outlined ${iconSize} notranslate`}>restaurant_menu</span>
            </div>
            {showText && (
                <span className={`text-xl font-bold tracking-tight ${variant === 'white' ? 'text-white' : textColor}`}>
                    Smart <span className="text-orange-500">Tiffin System</span>
                </span>
            )}
        </Link>
    );
};

export default Logo;
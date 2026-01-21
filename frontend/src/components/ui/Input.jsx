import React, { useState } from 'react';

const Input = ({
    label,
    type = "text",
    error,
    icon,
    placeholder,
    id,
    className = "",
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    // Determine the actual type to render
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
                >
                    {label}
                </label>
            )}

            <div className="relative group">
                {/* Left Icon (Optional) */}
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none">
                        <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </div>
                )}

                <input
                    type={inputType}
                    id={id}
                    className={`
                        w-full bg-white/50 border rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 
                        focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium
                        ${icon ? 'pl-11' : ''}
                        ${isPassword ? 'pr-11' : ''}
                        ${error ? 'border-red-300 focus:border-red-500 ring-red-200' : 'border-gray-200 focus:border-primary/50'}
                    `}
                    placeholder={placeholder}
                    {...props}
                />

                {/* Password Toggle Button */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1 animate-[fadeIn_0.2s_ease-out]">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;

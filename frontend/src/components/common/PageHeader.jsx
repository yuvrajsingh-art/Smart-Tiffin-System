import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle, backLink = "/customer/dashboard", backText = "Back to Dashboard", rightElement }) => {
    return (
        <div className="flex flex-col gap-1 mb-8 pt-4">
            <Link to={backLink} className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1 w-fit transition-colors">
                <span className="material-symbols-outlined text-lg">arrow_back</span> {backText}
            </Link>
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-xl font-black text-[#2D241E] leading-tight">{title}</h1>
                    {subtitle && <p className="text-xs font-bold text-[#5C4D42] opacity-60 uppercase tracking-widest">{subtitle}</p>}
                </div>
                {rightElement && <div>{rightElement}</div>}
            </div>
        </div>
    );
};

export default PageHeader;

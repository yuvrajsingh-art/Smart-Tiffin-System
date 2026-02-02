import React from 'react';

const SkeletonLoader = ({ type = 'text', count = 1, className = '' }) => {
    const renderSkeleton = (key) => {
        let baseClasses = "bg-gray-200 animate-pulse rounded-md relative overflow-hidden";
        // Shimmer effect overlay
        const shimmer = (
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        );

        switch (type) {
            case 'card':
                return (
                    <div key={key} className={`p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm ${className}`}>
                        <div className={`h-4 w-1/3 mb-4 rounded-full ${baseClasses}`}>{shimmer}</div>
                        <div className={`h-8 w-2/3 mb-2 rounded-full ${baseClasses}`}>{shimmer}</div>
                        <div className={`h-3 w-1/2 rounded-full ${baseClasses}`}>{shimmer}</div>
                    </div>
                );
            case 'table-row':
                return (
                    <tr key={key} className={`border-b border-gray-50 ${className}`}>
                        <td className="px-8 py-5"><div className={`h-3 w-8 rounded-full ${baseClasses}`}>{shimmer}</div></td>
                        <td className="px-8 py-5"><div className={`h-4 w-32 rounded-full ${baseClasses}`}>{shimmer}</div></td>
                        <td className="px-8 py-5"><div className={`h-3 w-24 rounded-full ${baseClasses}`}>{shimmer}</div></td>
                        <td className="px-8 py-5"><div className={`h-8 w-20 rounded-xl ${baseClasses}`}>{shimmer}</div></td>
                        <td className="px-8 py-5"><div className={`h-8 w-8 ml-auto rounded-xl ${baseClasses}`}>{shimmer}</div></td>
                    </tr>
                );
            case 'avatar':
                return (
                    <div key={key} className={`size-10 rounded-full ${baseClasses} ${className}`}>{shimmer}</div>
                );
            case 'text':
            default:
                return (
                    <div key={key} className={`h-4 w-full rounded-full ${baseClasses} ${className}`}>{shimmer}</div>
                );
        }
    };

    return (
        <>
            {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
        </>
    );
};

export default SkeletonLoader;

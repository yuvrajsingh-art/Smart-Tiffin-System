import React from 'react';

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`}></div>
);

export const MenuSkeleton = () => (
    <div className="space-y-8 mt-12 px-4">
        {[1, 2].map(i => (
            <div key={i} className="flex gap-6 relative">
                <div className="size-16 rounded-full bg-gray-200 animate-pulse mt-4"></div>
                <div className="flex-1 glass-panel p-6 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row gap-6">
                    <div className="size-24 rounded-2xl bg-gray-200 animate-pulse"></div>
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-2 mt-4">
                            <Skeleton className="h-8 w-16 rounded-full" />
                            <Skeleton className="h-8 w-16 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export const ProfileSkeleton = () => (
    <div className="space-y-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
            <Skeleton className="w-full lg:w-1/3 h-96 rounded-[2.5rem]" />
            <Skeleton className="flex-1 h-96 rounded-[2.5rem]" />
        </div>
    </div>
);

export const TrackSkeleton = () => (
    <div className="w-full space-y-6 animate-pulse px-4">
        <div className="h-64 md:h-80 bg-gray-200 rounded-[2rem]"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="h-20 bg-gray-100 rounded-[2rem]"></div>
            </div>
            <div className="space-y-6">
                <div className="h-48 bg-gray-50 rounded-[2.5rem]"></div>
                <div className="h-64 bg-gray-50 rounded-[2.5rem]"></div>
            </div>
        </div>
    </div>
);

export const FeedbackSkeleton = () => (
    <div className="space-y-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <Skeleton className="lg:col-span-3 h-[500px] rounded-[2.5rem]" />
            <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-[2rem]" />)}
            </div>
        </div>
    </div>
);

export const WalletSkeleton = () => (
    <div className="w-full space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded-[2rem]"></div>
            <div className="h-64 bg-gray-100 rounded-[2rem]"></div>
        </div>
        <div className="h-48 bg-gray-50 rounded-[2rem]"></div>
    </div>
);

export const HistorySkeleton = () => (
    <div className="w-full space-y-6 animate-pulse px-4">
        <div className="h-10 w-48 bg-gray-200 rounded-xl mb-6"></div>
        <div className="h-14 w-full max-w-md bg-gray-100 rounded-2xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-50 rounded-2xl"></div>
            ))}
        </div>
        <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-gray-50 rounded-[2rem]"></div>
            ))}
        </div>
    </div>
);


export const FindMessSkeleton = () => (
    <div className="w-full space-y-8 animate-pulse px-4">
        <div className="max-w-3xl mx-auto h-16 bg-gray-200 rounded-[2rem] mb-8"></div>
        <div className="flex justify-center gap-3 mb-12">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-8 w-24 bg-gray-200 rounded-full"></div>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-[400px] bg-gray-100 rounded-[2.5rem]"></div>
            ))}
        </div>
    </div>
);

export default Skeleton;

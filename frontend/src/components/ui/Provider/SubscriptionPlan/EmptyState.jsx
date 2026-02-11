import React from 'react';

const EmptyState = ({ onCreateClick }) => {
    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center max-w-md">
                <div className="size-24 bg-gradient-to-br from-primary/10 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-5xl text-primary">card_membership</span>
                </div>
                <h2 className="text-2xl font-black text-[#2D241E] mb-3">No Subscription Plan Yet</h2>
                <p className="text-[#5C4D42] mb-8 font-medium">Create your first subscription plan to start accepting customers</p>
                <button
                    onClick={onCreateClick}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mx-auto"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                    Create Subscription Plan
                </button>
            </div>
        </div>
    );
};

export default EmptyState;

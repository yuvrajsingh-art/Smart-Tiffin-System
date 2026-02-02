import React from 'react';

const BackgroundBlobs = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="blob blob-1 blob-primary opacity-30 scale-75"></div>
            <div className="blob blob-2 blob-secondary opacity-30 scale-75"></div>
        </div>
    );
};

export default BackgroundBlobs;

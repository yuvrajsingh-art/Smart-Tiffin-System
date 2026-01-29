import React from 'react';
import { Outlet } from 'react-router-dom';

const ProviderLayout = () => {
    return (
        <div>
            <h1>Provider Portal</h1>
            <Outlet />
        </div>
    );
};

export default ProviderLayout;

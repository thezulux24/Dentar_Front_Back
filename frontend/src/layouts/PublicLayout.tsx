// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/Navbar/PublicNavbar';
import { Footer } from '../components/imports';

const MainLayout: React.FC = () => {
    return (
        <>
            <PublicNavbar />
            <main style={{ minHeight: 'calc(100dvh - 166px)' }}>

                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;
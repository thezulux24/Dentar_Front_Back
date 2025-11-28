import React from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/imports";
import Navbar from "../components/Navbar/Navbar";

const MainLayout: React.FC = () => {
  return (
     <>
            <Navbar />
            <main style={{ minHeight: 'calc(100dvh - 166px)' }}>

                <Outlet />
            </main>
            <Footer />
        </>
  );
};

export default MainLayout;
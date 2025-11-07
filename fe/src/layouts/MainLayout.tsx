import React from 'react';
import { Outlet } from 'react-router-dom';
import {Header} from "@/layouts/Header.tsx";
import {Footer} from "@/layouts/Footer.tsx";

export const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserSidebar } from '@/components/user-sidebar';
import {Footer} from "@/layouts/Footer.tsx";

export const UserLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <UserSidebar />

            <div className="flex flex-col flex-1 overflow-hidden">
                <main className="flex-1 overflow-auto">
                    <div className="container mx-auto p-6">
                        <Outlet />
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
};


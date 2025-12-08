import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserSidebar } from '@/components/user-sidebar';
import {Footer} from "@/layouts/Footer.tsx";
import {useAuthGuard} from "@/hooks/use-auth-guard.ts";
import {SessionExpiredDialog} from "@/components/session-expired-dialog.tsx";

export const UserLayout: React.FC = () => {
    const { showExpiredDialog, handleLoginRedirect, handleHomeRedirect } = useAuthGuard();

    return (
        <>
            <div className="flex min-h-screen bg-gray-50">
                <UserSidebar />

                <div className="flex flex-col flex-1 overflow-hidden w-full sm:w-auto">
                    <main className="flex-1 overflow-auto pb-20 sm:pb-0">
                        <div className="container mx-auto p-4 sm:p-6">
                            <Outlet />
                        </div>
                    </main>

                    <div className="hidden sm:block">
                        <Footer />
                    </div>
                </div>
            </div>

            {/* Session Expired Dialog */}
            <SessionExpiredDialog
                open={showExpiredDialog}
                onLoginRedirect={handleLoginRedirect}
                onHomeRedirect={handleHomeRedirect}
            />
        </>

    );
};


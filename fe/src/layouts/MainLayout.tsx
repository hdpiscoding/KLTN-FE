import React from 'react';
import { Outlet } from 'react-router-dom';
import {Header} from "@/layouts/Header.tsx";
import {Footer} from "@/layouts/Footer.tsx";
import {useAuthGuard} from "@/hooks/use-auth-guard.ts";
import {SessionExpiredDialog} from "@/components/dialog/session-expired-dialog.tsx";

export const MainLayout: React.FC = () => {
    const { showExpiredDialog, handleLoginRedirect, handleHomeRedirect } = useAuthGuard();
    return (
        <>
            <div className="min-h-full flex flex-col">
                <Header />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <Footer />
            </div>

            {/* Session Expired Dialog */}
            <SessionExpiredDialog
                open={showExpiredDialog}
                onLoginRedirect={handleLoginRedirect}
                onHomeRedirect={handleHomeRedirect}
            />
        </>
    );
}
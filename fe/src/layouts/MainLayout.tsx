import React from 'react';
import { Outlet } from 'react-router-dom';
import {Header} from "@/layouts/Header.tsx";
import {Footer} from "@/layouts/Footer.tsx";
import {useAuthGuard} from "@/hooks/use-auth-guard.ts";
import {SessionExpiredDialog} from "@/components/dialog/session-expired-dialog.tsx";
import {ChatBot} from "@/components/chat";

export const MainLayout: React.FC = () => {
    const { showExpiredDialog, handleLoginRedirect, handleHomeRedirect, checkTokenExpired } = useAuthGuard();
    return (
        <>
            <div className="min-h-full flex flex-col">
                <Header />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <div className="hidden sm:block" aria-hidden="true">
                    <Footer />
                </div>
            </div>

            {/* ChatBot */}
            <ChatBot checkTokenExpired={checkTokenExpired} />

            {/* Session Expired Dialog */}
            <SessionExpiredDialog
                open={showExpiredDialog}
                onLoginRedirect={handleLoginRedirect}
                onHomeRedirect={handleHomeRedirect}
            />
        </>
    );
}
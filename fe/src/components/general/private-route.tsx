import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/userStore.ts";
import type { JSX } from "react";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = useUserStore((s) => s.token);
    const { pathname } = useLocation();
    if (pathname !== "/dang-nhap" && !token) {
        return <Navigate to="/" replace />;
    }
    return children;
};
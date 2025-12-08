import { Navigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore.ts";
import type {JSX} from "react";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = useUserStore((s) => s.token);

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
};
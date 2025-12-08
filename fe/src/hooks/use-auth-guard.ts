import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore.ts";
import { decodeJwt } from "@/utils/jwtHelper.ts";
import { useNavigate, useLocation } from "react-router-dom";

export function useAuthGuard() {
    const token = useUserStore((s) => s.token);
    const logout = useUserStore((s) => s.logout);
    const navigate = useNavigate();
    const location = useLocation();
    const [showExpiredDialog, setShowExpiredDialog] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!token) return;

        const payload = decodeJwt(token);
        if (!payload?.exp) return;

        const now = Date.now() / 1000;
        const isExpired = payload.exp < now;

        if (isExpired && !showExpiredDialog) {
            setShowExpiredDialog(true);
        }
    }, [token, location.pathname, showExpiredDialog]);

    const handleLoginRedirect = () => {
        logout();
        setShowExpiredDialog(false);
        navigate("/dang-nhap", { replace: true });
    };

    const handleHomeRedirect = () => {
        logout();
        setShowExpiredDialog(false);
        navigate("/", { replace: true });
    };

    return {
        showExpiredDialog,
        handleLoginRedirect,
        handleHomeRedirect
    };
}
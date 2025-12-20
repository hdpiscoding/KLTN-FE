import { useEffect, useState, useCallback } from "react";
import { useUserStore } from "@/store/userStore.ts";
import { decodeJwt } from "@/utils/jwtHelper.ts";
import { useNavigate, useLocation } from "react-router-dom";
import { useEstimationStore} from "@/store/estimationStore.ts";
import { useChatStore} from "@/store/chatStore.ts";

export function useAuthGuard() {
    const token = useUserStore((s) => s.token);
    const logout = useUserStore((s) => s.logout);
    const setIsOpen = useChatStore((s) => s.setIsOpen);
    const clearEstimationData = useEstimationStore((s) => s.clearEstimationData);
    const navigate = useNavigate();
    const location = useLocation();
    const [showExpiredDialog, setShowExpiredDialog] = useState(false);

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

    // Manual check for token expiration - for use in chatbot and other components
    const checkTokenExpired = useCallback(() => {
        if (!token) return false;

        const payload = decodeJwt(token);
        if (!payload?.exp) return false;

        const now = Date.now() / 1000;
        const isExpired = payload.exp < now;

        if (isExpired) {
            setShowExpiredDialog(true);
        }

        return isExpired;
    }, [token]);

    const handleLoginRedirect = () => {
        logout();
        clearEstimationData();
        setShowExpiredDialog(false);
        setIsOpen(false);
        navigate("/dang-nhap", { replace: true });
    };

    const handleHomeRedirect = () => {
        logout();
        clearEstimationData();
        setShowExpiredDialog(false);
        setIsOpen(false);
        navigate("/", { replace: true });
    };

    return {
        showExpiredDialog,
        handleLoginRedirect,
        handleHomeRedirect,
        checkTokenExpired,
    };
}
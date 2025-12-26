import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
    isLoggedIn: boolean;
    token: string | null;
    userId: number | null;
    avatarUrl: string | null;
    becomeSellerApproveStatus: string | null;
    verifiedPhone: boolean;
    login: (token: string) => void;
    logout: () => void;
    setUserInfo: (userId: number | null, avatarUrl: string | null) => void;
    setApproveStatus: (status: string) => void;
    setPhoneVerificationStatus: (status: boolean) => void;
    clearUserInfo: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            token: null,
            avatarUrl: null,
            userId: null,
            becomeSellerApproveStatus: null,
            verifiedPhone: false,

            login: (token: string) =>
                set({
                    isLoggedIn: true,
                    token,
                }),

            logout: () =>
                set({
                    isLoggedIn: false,
                    token: null,
                }),

            setUserInfo: (userId: number | null, avatarUrl: string | null) =>
                set({
                    userId: userId,
                    avatarUrl: avatarUrl,
                }),

            setApproveStatus: (status: string) => set({ becomeSellerApproveStatus: status }),

            setPhoneVerificationStatus: (status: boolean) => set({ verifiedPhone: status }),

            clearUserInfo: () =>
                set({
                    userId: null,
                    avatarUrl: null,
                    becomeSellerApproveStatus: null,
                    verifiedPhone: false
                }),
        }),
        {
            name: "user-store", // key lưu trong localStorage
        }
    )
);

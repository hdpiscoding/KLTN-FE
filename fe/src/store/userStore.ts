import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
    isLoggedIn: boolean;
    token: string | null;
    userId: number | null;
    avatarUrl: string | null;
    becomeSellerApproveStatus: string | null;
    login: (token: string) => void;
    logout: () => void;
    setUserInfo: (userId: number | null, avatarUrl: string | null, becomeSellerApprovalStatus: string | null) => void;
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

            setUserInfo: (userId: number | null, avatarUrl: string | null, becomeSellerApprovalStatus: string | null) =>
                set({
                    userId: userId,
                    avatarUrl: avatarUrl,
                    becomeSellerApproveStatus: becomeSellerApprovalStatus,
                }),

            clearUserInfo: () =>
                set({
                    userId: null,
                    avatarUrl: null,
                    becomeSellerApproveStatus: null,
                }),
        }),
        {
            name: "user-store", // key lưu trong localStorage
        }
    )
);

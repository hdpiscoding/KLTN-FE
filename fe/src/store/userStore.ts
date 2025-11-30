import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
    isLoggedIn: boolean;
    token: string | null;
    userId: number | null;
    avatarUrl: string | null;
    login: (token: string) => void;
    logout: () => void;
    setAvatar: (avatarUrl: string) => void;
    clearAvatar: () => void;
    setUserId: (userId: number | null) => void;
    clearUserId: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            token: null,
            avatarUrl: null,
            userId: null,

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

            setAvatar: (avatarUrl: string) =>
                set({ avatarUrl }),

            clearAvatar: () =>
                set({ avatarUrl: null}),

            setUserId: (userId: number | null) => set({userId}),

            clearUserId: () => set({userId: null})
        }),
        {
            name: "user-store", // key lưu trong localStorage
        }
    )
);

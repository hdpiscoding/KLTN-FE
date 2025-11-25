import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
    isLoggedIn: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            token: null,

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
        }),
        {
            name: "user-store", // key lưu trong localStorage
        }
    )
);

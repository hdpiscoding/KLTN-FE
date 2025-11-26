import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    email: string | null;
    phoneNumber: string | null;
    fullName: string | null;
    password: string | null;
    register: (email: string, phoneNumber: string, fullName: string, password: string) => void;
    clear: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            email: null,
            phoneNumber: null,
            fullName: null,
            password: null,

            register: (email, phoneNumber, fullName, password) =>
                set({ email, phoneNumber, fullName, password }),

            clear: () =>
                set({ email: null, phoneNumber: null, fullName: null, password: null }),
        }),
        {
            name: "auth-store",
        }
    )
);

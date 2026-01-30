import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
    addresses?: {
        _id?: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
    }[];
    xp?: number;
    rank?: string;
    wishlist?: Array<string | number>;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (userData) => set({ user: userData, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

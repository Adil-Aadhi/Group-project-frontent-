import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create((set) => ({
    accessToken: null,
    slug: null,
    companyId: null,
    isAuthenticated: false,
    isInitializing: true,

    setAuth: (token) => {
        const decoded = jwtDecode(token);


        set({
            accessToken: token,
            slug: decoded.slug,
            companyId: decoded.sub,
            isAuthenticated: true,
            isInitializing: false,
        });
    },

    finishInitialization: () =>
        set({
            isInitializing: false,
        }),

    logout: () =>
        set({
            accessToken: null,
            slug: null,
            companyId: null,
            isAuthenticated: false,
            isInitializing: false,
        }),
}));

import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create((set) => ({
    accessToken: null,
    slug: null,
    isAuthenticated: false,

    setAuth: (token) => {
        const decoded = jwtDecode(token);


        set({
            accessToken: token,
            slug: decoded.slug,
            isAuthenticated: true,
        });


    },

    logout: () =>
        set({
            accessToken: null,
            slug: null,
            isAuthenticated: false,
        }),
}));

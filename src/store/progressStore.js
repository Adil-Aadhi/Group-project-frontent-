import { create } from "zustand";

export const useProgressStore = create((set) => ({
    activeJob: null,
    isVisible: false,

    startJob: (job) =>
        set({
            activeJob: job,
            isVisible: true,
        }),

    finishJob: () =>
        set({
            activeJob: null,
            isVisible: false,
        }),
}));

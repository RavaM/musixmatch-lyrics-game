"use client";

import { create } from "zustand";

type UiState = {
  isSplashAnimationDone: boolean;
  setSplashAnimationDone: (done: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isSplashAnimationDone: false,
  setSplashAnimationDone: (done) => set({ isSplashAnimationDone: done }),
}));

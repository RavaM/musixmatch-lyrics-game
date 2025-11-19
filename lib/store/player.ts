"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Player = {
  id: string;
  name: string;
};

type PlayerState = {
  currentPlayer: Player | null;
  setPlayer: (name: string, avatarId?: string | null) => void;
  logout: () => void;
};

function createId() {
  return Math.random().toString(36).slice(2);
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      currentPlayer: null,
      setPlayer: (name) =>
        set({
          currentPlayer: {
            id: createId(),
            name,
          },
        }),
      logout: () => set({ currentPlayer: null }),
    }),
    {
      name: "who-sings-player",
    }
  )
);

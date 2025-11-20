// lib/store/player.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Player = {
  id: string;
  name: string;
  createdAt: string;
};

type PlayerState = {
  currentPlayer: Player | null;
  players: Player[];
  setPlayer: (name: string) => void;
  logout: () => void;
};

function createId() {
  return Math.random().toString(36).slice(2);
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentPlayer: null,
      players: [],

      setPlayer: (rawName: string) => {
        const name = rawName.trim();
        if (!name) return;

        const { players } = get();

        const existing = players.find(
          (p) => p.name.toLowerCase() === name.toLowerCase()
        );

        if (existing) {
          set({ currentPlayer: existing });
          return;
        }

        const newPlayer: Player = {
          id: createId(),
          name,
          createdAt: new Date().toISOString(),
        };

        set({
          currentPlayer: newPlayer,
          players: [...players, newPlayer],
        });
      },

      logout: () => set({ currentPlayer: null }),
    }),
    {
      name: "who-sings-players",
    }
  )
);

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
          id: crypto.randomUUID(),
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

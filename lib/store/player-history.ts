// lib/store/playerHistory.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type PlayerHistoryState = {
  recentTrackIds: number[]; // newest first
  addUsedTracks: (trackIds: number[]) => void;
  clearHistory: () => void;
};

const MAX_RECENT_TRACKS = 100;

export const usePlayerHistoryStore = create<PlayerHistoryState>()(
  persist(
    (set) => ({
      recentTrackIds: [],

      addUsedTracks: (trackIds) =>
        set((state) => {
          const combined = [...trackIds, ...state.recentTrackIds];
          const seen = new Set<number>();
          const unique: number[] = [];

          for (const id of combined) {
            if (seen.has(id)) continue;
            seen.add(id);
            unique.push(id);
          }

          return {
            recentTrackIds: unique.slice(0, MAX_RECENT_TRACKS),
          };
        }),

      clearHistory: () => set({ recentTrackIds: [] }),
    }),
    {
      name: "who-sings-player-history",
    }
  )
);

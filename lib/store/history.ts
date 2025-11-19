"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GameResult = {
  id: string;
  playerId: string | null;
  playerName: string | null;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  createdAt: string;
};

type HistoryState = {
  results: GameResult[];
  addResult: (result: Omit<GameResult, "id" | "createdAt">) => void;
  clearAll: () => void;
};

function createId() {
  return Math.random().toString(36).slice(2);
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      results: [],
      addResult: (result) =>
        set((state) => ({
          results: [
            {
              ...result,
              id: createId(),
              createdAt: new Date().toISOString(),
            },
            ...state.results,
          ],
        })),
      clearAll: () => set({ results: [] }),
    }),
    { name: "who-sings-history" }
  )
);

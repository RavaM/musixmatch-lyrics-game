import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ChartCountry = "us" | "it";

type SettingsState = {
  chartCountry: ChartCountry;
  setChartCountry: (country: ChartCountry) => void;

  soundEnabled: boolean;
  toggleSound: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      chartCountry: "us",
      setChartCountry: (country) => set({ chartCountry: country }),

      soundEnabled: false,
      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    {
      name: "who-sings-settings",
    }
  )
);

export type BackgroundState = {
  rotation: number;
  scale: number;
};

export const BACKGROUND_CONFIG: Record<string, BackgroundState> = {
  "/": {
    rotation: 0,
    scale: 2.5,
  },
  "/play": {
    rotation: 80,
    scale: 1.5,
  },
  "/leaderboard": {
    rotation: -20,
    scale: 2.1,
  },
  "/results": {
    rotation: -120,
    scale: 3,
  },
  "/profile": {
    rotation: 10,
    scale: 1.2,
  },
};

export const DEFAULT_BACKGROUND: BackgroundState = {
  rotation: 0,
  scale: 1,
};

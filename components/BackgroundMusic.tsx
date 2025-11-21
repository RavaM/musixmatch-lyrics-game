"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/store/settings";
import { soundManager } from "@/lib/audio/soundManager";

export function BackgroundMusic() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  useEffect(() => {
    soundManager.setMuted(!soundEnabled);

    if (soundEnabled) {
      soundManager.playBgm();
    } else {
      soundManager.pauseBgm();
    }
  }, [soundEnabled]);
  return null;
}

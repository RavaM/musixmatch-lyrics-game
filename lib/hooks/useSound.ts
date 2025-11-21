"use client";

import { useCallback } from "react";
import { useSettingsStore } from "@/lib/store/settings";
import { soundManager } from "@/lib/audio/soundManager";

export function useSound() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    soundManager.play("click");
  }, [soundEnabled]);

  const playCorrect = useCallback(() => {
    if (!soundEnabled) return;
    soundManager.play("correct");
  }, [soundEnabled]);

  const playWrong = useCallback(() => {
    if (!soundEnabled) return;
    soundManager.play("wrong");
  }, [soundEnabled]);

  return {
    soundEnabled,
    playClick,
    playCorrect,
    playWrong,
  };
}

"use client";

import { useEffect, useRef } from "react";
import { useSettingsStore } from "@/lib/store/settings";

export function BackgroundMusic() {
  const { soundEnabled } = useSettingsStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      const audio = new Audio("/sounds/bg-loop.mp3");
      audio.loop = true;
      audio.volume = 0.15;
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    if (soundEnabled) {
      audio
        .play()
        .catch((err) =>
          console.warn("Background audio play blocked (autoplay)", err)
        );
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [soundEnabled]);

  return null;
}

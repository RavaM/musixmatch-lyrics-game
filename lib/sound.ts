"use client";

import { useSettingsStore } from "@/lib/store/settings";

// semplice cache per riusare gli Audio
const audioCache = new Map<string, HTMLAudioElement>();

function getAudio(src: string): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;

  if (audioCache.has(src)) return audioCache.get(src)!;

  const audio = new Audio(src);
  audioCache.set(src, audio);
  return audio;
}

function playOneShot(src: string, volume = 1) {
  if (typeof window === "undefined") return;
  const { soundEnabled } = useSettingsStore.getState();
  if (!soundEnabled) return;

  const audio = getAudio(src);
  if (!audio) return;

  audio.currentTime = 0;
  audio.volume = volume;
  audio.play().catch((err) => {
    console.warn("Audio play failed", err);
  });
}

export function playClickSound() {
  playOneShot("/sounds/click.wav", 0.2);
}

export function playCorrectSound() {
  playOneShot("/sounds/correct.mp3", 0.1);
}

export function playWrongSound() {
  playOneShot("/sounds/wrong.wav", 0.2);
}

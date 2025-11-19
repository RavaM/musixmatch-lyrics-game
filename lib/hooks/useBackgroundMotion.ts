// src/hooks/useBackgroundMotion.ts
"use client";

import { useEffect, useState } from "react";
import { useSpring, useMotionValueEvent } from "framer-motion";
import {
  BACKGROUND_CONFIG,
  DEFAULT_BACKGROUND,
} from "@/lib/config/backgroundConfig";

export const useBackgroundMotion = (pathname: string | null) => {
  const config =
    (pathname && BACKGROUND_CONFIG[pathname]) || DEFAULT_BACKGROUND;

  const [rotation, setRotation] = useState(config.rotation);
  const [scale, setScale] = useState(config.scale);

  const rotationSpring = useSpring(config.rotation, {
    stiffness: 80,
    damping: 18,
  });

  const scaleSpring = useSpring(config.scale, {
    stiffness: 80,
    damping: 18,
  });

  // When route config changes, update targets
  useEffect(() => {
    rotationSpring.set(config.rotation);
    scaleSpring.set(config.scale);
  }, [config.rotation, config.scale, rotationSpring, scaleSpring]);

  // Sync motion values to React state (so we can pass numbers to ColorBends)
  useMotionValueEvent(rotationSpring, "change", (v) => setRotation(v));
  useMotionValueEvent(scaleSpring, "change", (v) => setScale(v));

  return { rotation, scale };
};

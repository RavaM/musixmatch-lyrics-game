"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import CircularText from "./CircularText";
import { useEffect, useState } from "react";
import { useUiStore } from "@/lib/store/ui";

export const SplashScreen = () => {
  const { isSplashAnimationDone, setSplashAnimationDone } = useUiStore();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSplashAnimationDone(true);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {!isSplashAnimationDone && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            exit={{ scale: 6, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <CircularText
              text="WHO ✦ SINGS? ✦ MUSIXMATCH ✦ "
              spinDuration={15}
              className="w-[300px] h-[300px] md:w-[30vw]! md:h-[30vw]!"
            />
          </motion.div>

          <Logo clickable={false} size={100} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

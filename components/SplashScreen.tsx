"use client";

import { motion } from "framer-motion";
import { Logo } from "./Logo";

export const SplashScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Logo clickable={false} size={80} />
    </motion.div>
  );
};

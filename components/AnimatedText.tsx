"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

const motionTags = {
  span: motion.span,
  p: motion.p,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
} as const;

type MotionTagKey = keyof typeof motionTags;

type AnimatedTextProps = {
  text: string;
  className?: string;
  active?: boolean; // when false, stay hidden
  delay?: number; // base delay for the whole text
  duration?: number; // total duration for the whole text animation
  as?: MotionTagKey; // limit to known tags to keep typing simple
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  active = true,
  delay = 0,
  duration = 1, // total animation span for the whole text
  as = "span",
}) => {
  const letters = Array.from(text);

  // ✅ stable component reference, not recreated on each render
  const MotionTag = motionTags[as] ?? motionTags.span;

  const charAnimDuration = 0.35;
  const maxOffset = Math.max(duration - charAnimDuration, 0);
  const step = letters.length > 1 ? maxOffset / (letters.length - 1) : 0;

  return (
    <MotionTag className={cn("inline-block", className)}>
      {letters.map((char, index) => {
        const charDelay = delay + step * index;

        return (
          <motion.span
            key={index}
            style={{ display: "inline-block" }}
            initial={{ y: 12, opacity: 0, filter: "blur(6px)" }}
            animate={
              active
                ? { y: 0, opacity: 1, filter: "blur(0px)" }
                : { y: 12, opacity: 0, filter: "blur(6px)" }
            }
            transition={{
              duration: charAnimDuration,
              ease: "easeOut",
              delay: charDelay,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </MotionTag>
  );
};

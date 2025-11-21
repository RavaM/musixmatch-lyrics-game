"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type LogoProps = {
  clickable?: boolean;
  size?: number;
  onClick?: () => void;
};

export const Logo: React.FC<LogoProps> = ({
  clickable = true,
  size = 40,
  onClick,
}) => {
  const content = (
    <motion.div
      layoutId="app-logo"
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Image
        src="/icons/icon-white.png"
        alt="logo-white"
        width={size}
        height={size}
        className="object-contain"
      />
    </motion.div>
  );

  if (!clickable) return content;

  return (
    <button
      type="button"
      onClick={onClick}
      className="pointer-events-auto flex items-center justify-center rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
    >
      {content}
    </button>
  );
};

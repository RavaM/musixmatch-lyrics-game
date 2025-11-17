"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  clickable?: boolean;
  size?: number; // px
};

export const Logo: React.FC<LogoProps> = ({ clickable = true, size = 40 }) => {
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
    <Link
      href="/"
      className="pointer-events-auto flex items-center justify-center"
    >
      {content}
    </Link>
  );
};

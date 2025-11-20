"use client";

import { usePathname } from "next/navigation";
import ColorBends from "./ColorBends";
import CurvedLoop from "./CurvedLoop";
import { useBackgroundMotion } from "@/lib/hooks/useBackgroundMotion";

export const AppBackground = () => {
  const pathname = usePathname();
  const { rotation, scale } = useBackgroundMotion(pathname);

  return (
    <div className="absolute inset-0 z-0">
      <ColorBends
        colors={["#ff0000", "#00ff00", "#0000ff"]}
        rotation={rotation}
        scale={scale}
        speed={0.1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={0.5}
        parallax={0.5}
        noise={0.08}
      />

      <div className="fixed left-0 right-0 pointer-events-none -bottom-52 sm:bottom-0 -z-1">
        <CurvedLoop
          marqueeText="Who ✦ Sings? ✦ by ✦ Musixmatch ✦"
          speed={3}
          curveAmount={600}
          direction="left"
          interactive={false}
        />
      </div>
    </div>
  );
};

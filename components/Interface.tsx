"use client";

import { Button } from "./ui/button";
import { Trophy, User } from "lucide-react";
import { Logo } from "./Logo";
import { usePlayerStore } from "@/lib/store/player";
import { Alert } from "./Alert";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store/game";

export const Interface = () => {
  const { currentPlayer } = usePlayerStore();
  const { status } = useGameStore();
  const pathname = usePathname();
  const router = useRouter();

  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const isGameActive = status === "in-progress";
  const isPlayPage = pathname === "/play";

  const requestNavigation = (href: string) => {
    if (isPlayPage && isGameActive) {
      setPendingHref(href);
    } else {
      router.push(href);
    }
  };

  return (
    <>
      <div className="absolute inset-0 p-8 pointer-events-none z-40">
        <header className="flex flex-row justify-between w-full">
          <Logo clickable size={40} />
          <div className="flex gap-4">
            {currentPlayer && (
              <Button
                asChild
                className="pointer-cursor pointer-events-auto aspect-square w-12 h-12"
                onClick={() => requestNavigation("/profile")}
              >
                <User height={24} width={24} />
              </Button>
            )}
            <Button
              asChild
              className="pointer-cursor pointer-events-auto aspect-square w-12 h-12"
              onClick={() => requestNavigation("/leaderboard")}
            >
              <Trophy height={24} width={24} />
            </Button>
          </div>
        </header>
      </div>

      <Alert pendingHref={pendingHref} setPendingHref={setPendingHref} />
    </>
  );
};

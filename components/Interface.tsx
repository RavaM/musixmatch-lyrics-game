"use client";

import { Button } from "./ui/button";
import { Trophy, User, Volume2, VolumeOff } from "lucide-react";
import { Logo } from "./Logo";
import { usePlayerStore } from "@/lib/store/player";
import { Alert } from "./Alert";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useGameStore } from "@/lib/store/game";
import { useSettingsStore } from "@/lib/store/settings";
import { cn } from "@/lib/utils";

export const Interface = () => {
  const { currentPlayer } = usePlayerStore();
  const { status } = useGameStore();
  const { soundEnabled, toggleSound } = useSettingsStore();
  const pathname = usePathname();
  const router = useRouter();

  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const isGameActive = status === "in-progress";
  const isPlayPage = pathname === "/play";

  const isProfilePage = pathname === "/profile";
  const isLeaderboardPage = pathname === "/leaderboard";

  const requestNavigation = (href: string) => {
    if (isPlayPage && isGameActive) {
      setPendingHref(href);
    } else {
      router.push(href);
    }
  };

  const navButtonBase =
    "pointer-cursor pointer-events-auto aspect-square w-12 h-12";

  return (
    <>
      <div className="absolute inset-0 p-8 pointer-events-none z-40 flex flex-col justify-between h-full">
        <header className="flex flex-row justify-between w-full">
          <Logo clickable size={40} onClick={() => requestNavigation("/")} />
          <div className="flex gap-4">
            {currentPlayer && (
              <Button
                className={cn(
                  navButtonBase,
                  isProfilePage
                    ? "bg-accent/40 border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.25)] pointer-events-none"
                    : "opacity-80 hover:opacity-100"
                )}
                variant="default"
                onClick={() => requestNavigation("/profile")}
                aria-pressed={isProfilePage}
                aria-current={isProfilePage ? "page" : undefined}
                silentClick={false}
              >
                <User height={24} width={24} />
              </Button>
            )}

            <Button
              className={cn(
                navButtonBase,
                isLeaderboardPage
                  ? "bg-accent/40 border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.25)] pointer-events-none"
                  : "opacity-80 hover:opacity-100"
              )}
              variant="default"
              onClick={() => requestNavigation("/leaderboard")}
              aria-pressed={isLeaderboardPage}
              aria-current={isLeaderboardPage ? "page" : undefined}
              silentClick={false}
            >
              <Trophy height={24} width={24} />
            </Button>
          </div>
        </header>

        <footer className="flex w-full justify-end">
          <Button
            onClick={toggleSound}
            className={cn(
              navButtonBase,
              soundEnabled
                ? "bg-accent/40 border-white/40"
                : "opacity-80 hover:opacity-100"
            )}
            silentClick={false}
          >
            {soundEnabled ? (
              <Volume2 height={24} width={24} />
            ) : (
              <VolumeOff height={24} width={24} />
            )}
          </Button>
        </footer>
      </div>

      <Alert pendingHref={pendingHref} setPendingHref={setPendingHref} />
    </>
  );
};

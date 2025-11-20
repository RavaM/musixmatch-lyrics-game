"use client";

import { Button } from "@/components/ui/button";
import { LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import { usePlayerStore } from "@/lib/store/player";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUiStore } from "@/lib/store/ui";
import { useSettingsStore } from "@/lib/store/settings";
import { ChartCountryButton } from "@/components/ChartCountryButton";
import { AnimatedText } from "@/components/AnimatedText";

export default function Home() {
  const [name, setName] = useState("");
  const { currentPlayer, setPlayer } = usePlayerStore();
  const router = useRouter();
  const { isSplashAnimationDone } = useUiStore();
  const { chartCountry, setChartCountry } = useSettingsStore();

  const handleStart = () => {
    const trimmed = name.trim();

    if (!currentPlayer && !trimmed) {
      return;
    }

    if (!currentPlayer) {
      setPlayer(trimmed);
    }

    router.push("/play");
  };

  return (
    <LayoutGroup>
      <main className="text-white w-full h-full flex flex-col items-center">
        <div className="flex flex-col items-center w-full md:w-md aspect-square rounded-2xl text-center relative">
          <h1 className="uppercase text-4xl font-bold leading-tight">
            <AnimatedText
              text="Who Sings?"
              active={isSplashAnimationDone}
              as="span"
              delay={0.2}
            />
            <br />
            <AnimatedText
              text="the ✦coolest✦"
              as="span"
              active={isSplashAnimationDone}
              delay={0.5}
            />
            <br />
            <AnimatedText
              text="lyrics game ;)"
              as="span"
              active={isSplashAnimationDone}
              delay={0.9}
            />
          </h1>

          <motion.div
            className="mt-4 flex flex-col w-full max-w-sm mx-auto"
            initial={{ opacity: 0, y: 8 }}
            animate={
              isSplashAnimationDone
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 8 }
            }
            transition={{ delay: 1.2, ease: "easeOut" }}
          >
            <label
              htmlFor="username"
              className="uppercase text-xs text-muted-foreground mb-2"
            >
              {currentPlayer
                ? "You are currently playing as:"
                : "Enter your username below and choose an avatar!"}
            </label>

            <input
              id="username"
              type="text"
              className="w-full rounded-lg bg-muted/40 border border-border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto"
              placeholder="Your cool nickname"
              value={currentPlayer ? currentPlayer.name : name}
              onChange={(e) => {
                if (currentPlayer) return;
                setName(e.target.value);
              }}
            />

            {currentPlayer && (
              <p className="mt-2 text-xs text-muted-foreground">
                Not you? You can log out from the{" "}
                <Link href="/profile" className="underline pointer-events-auto">
                  profile screen
                </Link>
                .
              </p>
            )}
          </motion.div>

          <motion.div
            className="mt-6 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={
              isSplashAnimationDone
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 8 }
            }
            transition={{ delay: 1.4, ease: "easeOut" }}
          >
            <p className="uppercase text-[11px] tracking-wide text-muted-foreground">
              Choose country
            </p>
            <div className="flex gap-3">
              <ChartCountryButton
                country="us"
                selected={chartCountry === "us"}
                onSelect={setChartCountry}
                flagSrc="/flags/us.png"
                label="US charts"
              />
              <ChartCountryButton
                country="it"
                selected={chartCountry === "it"}
                onSelect={setChartCountry}
                flagSrc="/flags/it.png"
                label="Italian charts"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={
              isSplashAnimationDone
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 8 }
            }
            transition={{ delay: 1.6, ease: "easeOut" }}
          >
            <Button
              className="mt-10"
              onClick={handleStart}
              disabled={!currentPlayer && !name.trim()}
            >
              Start the game
            </Button>
          </motion.div>
        </div>
      </main>
    </LayoutGroup>
  );
}

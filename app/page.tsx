"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { usePlayerStore } from "@/lib/store/player";
import { useRouter } from "next/navigation";
import { useUiStore } from "@/lib/store/ui";
import { useSettingsStore } from "@/lib/store/settings";
import { ChartCountryButton } from "@/components/ChartCountryButton";
import { AnimatedText } from "@/components/AnimatedText";

export default function Home() {
  const [name, setName] = useState("");
  const { currentPlayer, setPlayer, logout } = usePlayerStore();
  const router = useRouter();
  const { isSplashAnimationDone } = useUiStore();
  const { chartCountry, setChartCountry } = useSettingsStore();

  const handleStart = () => {
    const trimmed = name.trim();

    if (!currentPlayer && !trimmed) return;

    if (!currentPlayer) {
      setPlayer(trimmed);
    }

    router.push("/play");
  };

  return (
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
            isSplashAnimationDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
          }
          transition={{ delay: 1.2, ease: "easeOut" }}
        >
          <label
            htmlFor="username"
            className="uppercase text-xs text-muted-foreground mb-2 text-center"
          >
            {currentPlayer
              ? "You are currently playing as:"
              : "Enter your username below"}
          </label>

          <div className="flex flex-col items-center sm:flex-row gap-2 w-full">
            <input
              id="username"
              type="text"
              className="flex-1 rounded-lg bg-muted/40 border border-border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto w-full"
              placeholder="Choose your ✦cool✦ nickname"
              value={currentPlayer ? currentPlayer.name : name}
              onChange={(e) => {
                if (currentPlayer) return;
                setName(e.target.value);
              }}
              disabled={!!currentPlayer}
            />
            {currentPlayer && (
              <Button type="button" className="shrink-0" onClick={logout}>
                Log out
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div
          className="mt-6 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={
            isSplashAnimationDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
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
            isSplashAnimationDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
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
  );
}

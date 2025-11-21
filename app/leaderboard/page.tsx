"use client";

import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/lib/store/history";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import type { ChartCountry } from "@/lib/store/settings";
import { usePlayerStore } from "@/lib/store/player";
import { LeaderboardSection } from "@/components/leaderboard/LeaderboardSection";

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

type HistoryResult = {
  playerName: string | null;
  score: number;
  country?: ChartCountry;
};

type LeaderboardEntry = {
  name: string;
  bestScore: number;
  gamesPlayed: number;
  country: ChartCountry;
};

function buildLeaderboardForCountry(
  results: any[],
  country: ChartCountry
): LeaderboardEntry[] {
  const filtered = results.filter((r) => (r.country ?? "us") === country);

  const byName = filtered.reduce<Record<string, LeaderboardEntry>>((acc, r) => {
    const rawName = r.playerName?.trim();
    const displayName = rawName && rawName.length > 0 ? rawName : "Anonymous";
    const key = displayName.toLowerCase();

    const current = acc[key];

    if (!current) {
      acc[key] = {
        name: displayName,
        bestScore: r.score,
        gamesPlayed: 1,
        country,
      };
    } else {
      acc[key] = {
        name: displayName,
        bestScore: Math.max(current.bestScore, r.score),
        gamesPlayed: current.gamesPlayed + 1,
        country,
      };
    }

    return acc;
  }, {});

  return Object.values(byName).sort((a, b) => b.bestScore - a.bestScore);
}
export default function LeaderboardPage() {
  const { results } = useHistoryStore();
  const { currentPlayer } = usePlayerStore();

  const usLeaderboard = buildLeaderboardForCountry(
    results as HistoryResult[],
    "us"
  ).slice(0, 10);
  const itLeaderboard = buildLeaderboardForCountry(
    results as HistoryResult[],
    "it"
  ).slice(0, 10);

  const noData = usLeaderboard.length === 0 && itLeaderboard.length === 0;

  return (
    <motion.main
      className="h-full text-white flex flex-col justify-start"
      initial="hidden"
      animate="visible"
    >
      <motion.header
        className="flex justify-between items-center mb-8"
        variants={headerVariants}
      >
        <h1 className="text-2xl font-display">Leaderboard</h1>
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
      </motion.header>

      {noData ? (
        <motion.p
          className="text-muted-foreground text-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
        >
          No games played yet. Be the first to set a high score!
        </motion.p>
      ) : (
        <div className="gap-8 md:grid-cols-2 overflow-y-auto pointer-events-auto flex-1 flex flex-col md:flex-row items-stretch">
          <LeaderboardSection
            title="US Leaderboard"
            flagSrc="/flags/us.png"
            emptyText="No US games yet."
            entries={usLeaderboard}
            delay={0.15}
            currentPlayerName={currentPlayer?.name ?? null}
          />
          <LeaderboardSection
            title="Italy Leaderboard"
            flagSrc="/flags/it.png"
            emptyText="No Italian games yet."
            entries={itLeaderboard}
            delay={0.2}
            currentPlayerName={currentPlayer?.name ?? null}
          />
        </div>
      )}
    </motion.main>
  );
}

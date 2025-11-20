"use client";

import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/lib/store/history";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import type { ChartCountry } from "@/lib/store/settings";

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
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

  const usLeaderboard = buildLeaderboardForCountry(results, "us").slice(0, 10);
  const itLeaderboard = buildLeaderboardForCountry(results, "it").slice(0, 10);

  const noData = usLeaderboard.length === 0 && itLeaderboard.length === 0;

  return (
    <motion.main
      className="min-h-screen text-white"
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
        <div className="grid gap-8 md:grid-cols-2">
          {/* US leaderboard */}
          <section>
            <motion.div
              className="flex items-center gap-2 mb-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
            >
              <img
                src="/flags/us.png"
                alt="US flag"
                className="w-5 h-5 rounded-[2px]"
              />
              <h2 className="text-lg font-display">US Leaderboard</h2>
            </motion.div>

            {usLeaderboard.length === 0 ? (
              <p className="text-muted-foreground text-xs">No US games yet.</p>
            ) : (
              <motion.ol className="space-y-2" variants={listVariants}>
                {usLeaderboard.map((entry, index) => (
                  <motion.li
                    key={`${entry.name}-us`}
                    variants={itemVariants}
                    className="flex justify-between items-center bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm"
                  >
                    <span>
                      #{index + 1} {entry.name}
                      {entry.gamesPlayed > 1 && (
                        <span className="ml-2 text-[11px] text-muted-foreground">
                          · {entry.gamesPlayed} games
                        </span>
                      )}
                    </span>
                    <span className="font-mono">{entry.bestScore}</span>
                  </motion.li>
                ))}
              </motion.ol>
            )}
          </section>

          {/* IT leaderboard */}
          <section>
            <motion.div
              className="flex items-center gap-2 mb-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
            >
              <img
                src="/flags/it.png"
                alt="IT flag"
                className="w-5 h-5 rounded-[2px]"
              />
              <h2 className="text-lg font-display">Italy Leaderboard</h2>
            </motion.div>

            {itLeaderboard.length === 0 ? (
              <p className="text-muted-foreground text-xs">
                No Italian games yet.
              </p>
            ) : (
              <motion.ol className="space-y-2" variants={listVariants}>
                {itLeaderboard.map((entry, index) => (
                  <motion.li
                    key={`${entry.name}-it`}
                    variants={itemVariants}
                    className="flex justify-between items-center bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm"
                  >
                    <span>
                      #{index + 1} {entry.name}
                      {entry.gamesPlayed > 1 && (
                        <span className="ml-2 text-[11px] text-muted-foreground">
                          · {entry.gamesPlayed} games
                        </span>
                      )}
                    </span>
                    <span className="font-mono">{entry.bestScore}</span>
                  </motion.li>
                ))}
              </motion.ol>
            )}
          </section>
        </div>
      )}
    </motion.main>
  );
}

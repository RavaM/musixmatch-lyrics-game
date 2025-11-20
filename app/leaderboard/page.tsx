"use client";

import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/lib/store/history";
import Link from "next/link";

export default function LeaderboardPage() {
  const { results } = useHistoryStore();

  // Aggregate best score PER NAME (so "Marco" is always the same player)
  const byName = results.reduce<
    Record<string, { name: string; bestScore: number; gamesPlayed: number }>
  >((acc, r) => {
    const rawName = r.playerName?.trim();
    const displayName = rawName && rawName.length > 0 ? rawName : "Anonymous";
    const key = displayName.toLowerCase();

    const current = acc[key];

    if (!current) {
      acc[key] = {
        name: displayName,
        bestScore: r.score,
        gamesPlayed: 1,
      };
    } else {
      acc[key] = {
        name: displayName,
        bestScore: Math.max(current.bestScore, r.score),
        gamesPlayed: current.gamesPlayed + 1,
      };
    }

    return acc;
  }, {});

  const leaderboard = Object.values(byName)
    .sort((a, b) => b.bestScore - a.bestScore)
    .slice(0, 10);

  return (
    <main className="min-h-screen text-white">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-display">Leaderboard</h1>
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
      </header>

      {leaderboard.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No games played yet. Be the first to set a high score!
        </p>
      ) : (
        <ol className="space-y-2">
          {leaderboard.map((entry, index) => (
            <li
              key={entry.name}
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
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}

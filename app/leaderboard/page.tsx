"use client";

import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/lib/store/history";
import Link from "next/link";

export default function LeaderboardPage() {
  const { results } = useHistoryStore();

  // Aggregate best score per player
  const bestByPlayer = results.reduce<
    Record<string, { name: string; score: number }>
  >((acc, r) => {
    const key = r.playerId ?? r.playerName ?? "anonymous";
    const name = r.playerName ?? "Anonymous";
    if (!acc[key] || r.score > acc[key].score) {
      acc[key] = { name, score: r.score };
    }
    return acc;
  }, {});

  const leaderboard = Object.values(bestByPlayer)
    .sort((a, b) => b.score - a.score)
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
              key={entry.name + index}
              className="flex justify-between items-center bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm"
            >
              <span>
                #{index + 1} {entry.name}
              </span>
              <span className="font-mono">{entry.score}</span>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}

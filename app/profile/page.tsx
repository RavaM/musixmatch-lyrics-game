"use client";

import { usePlayerStore } from "@/lib/store/player";
import { useHistoryStore } from "@/lib/store/history";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NotLogged from "@/components/NotLogged";

const LAST_N = 10;

export default function MePage() {
  const { currentPlayer, logout } = usePlayerStore();
  const { results } = useHistoryStore();

  const myGames = currentPlayer
    ? results
        .filter((r) => r.playerName === currentPlayer.name)
        .slice(0, LAST_N)
    : [];

  if (!currentPlayer) {
    return <NotLogged />;
  }

  return (
    <main className="h-full text-white flex flex-col flex-1 min-h-0">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-display">Your profile</h1>
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-display mb-2">
          Playing as: {currentPlayer.name}
        </h2>
        <Button onClick={logout}>Log out</Button>
      </section>

      <section className="flex-1 flex flex-col overflow-y-auto">
        <h3 className="text-lg font-display mb-3">Your last {LAST_N} games</h3>

        {myGames.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No games yet. Go play your first round!
          </p>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 pointer-events-auto">
            {myGames.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-lg bg-muted/40 border border-border px-3 py-2 text-sm"
              >
                <div>
                  <div>Score: {g.score}</div>
                  <div className="text-xs text-muted-foreground">
                    {g.correctAnswers}/{g.totalQuestions} correct
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(g.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/store/game";
import { Button } from "@/components/ui/button";
import { Interface } from "@/components/Interface";
import { useRouter } from "next/navigation";

export default function PlayPage() {
  const { push } = useRouter();
  const {
    status,
    questions,
    currentIndex,
    timeLeft,
    score,
    startGame,
    tick,
    answerQuestion,
  } = useGameStore();

  // Start the game when the page mounts (or when user comes back)
  useEffect(() => {
    if (status === "idle") {
      startGame();
    }
  }, [status, startGame]);

  // Timer effect
  useEffect(() => {
    if (status !== "in-progress") return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, tick]);

  const currentQuestion = questions[currentIndex];

  if (status === "loading" || !currentQuestion) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <Interface />
        <p>Loading your questions…</p>
      </main>
    );
  }

  if (status === "finished") {
    return (
      <main className="min-h-screen justify-center flex pt-40 text-white">
        <Interface />
        <div className="z-10 bg-background/70 border border-border rounded-2xl p-8 text-center h-fit">
          <h1 className="text-3xl font-display mb-4">Game Over</h1>
          <p className="mb-2">Your score: {score}</p>
          <Button onClick={() => useGameStore.getState().resetGame()}>
            Play again
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex pt-40 text-white relative px-4">
      <div className="z-10 bg-background/70 border border-border rounded-2xl p-8 w-full max-w-md h-fit">
        <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
          <span>
            Question {currentIndex + 1} / {questions.length}
          </span>
          <span>Score: {score}</span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Time left</span>
            <span>{timeLeft}s</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full transition-all bg-linear-to-r from-[#FF6050] to-[#FF0E83]"
              style={{
                width: `${(timeLeft / 20) * 100}%`,
              }}
            />
          </div>
        </div>

        <p className="font-display text-xl mb-6">
          “{currentQuestion.lyricLine}”
        </p>

        <div className="space-y-2">
          {currentQuestion.answers.map((answer) => (
            <Button
              key={answer.id}
              className="w-full justify-start cursor-pointer"
              onClick={() => answerQuestion(answer.id)}
            >
              {answer.label}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}

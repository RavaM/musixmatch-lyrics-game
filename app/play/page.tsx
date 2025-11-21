"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/lib/store/game";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/lib/store/player";
import NotLogged from "@/components/NotLogged";
import { StreakHeader } from "@/components/play/StreakHeader";
import { TimerBar } from "@/components/play/TimerBar";
import { AnswerList } from "@/components/play/AnswerList";
import Counter from "@/components/Counter";
import CircularText from "@/components/CircularText";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShareResultsButton } from "@/components/ShareResultsButton";
import { useSettingsStore } from "@/lib/store/settings";
import { useSound } from "@/lib/hooks/useSound";
import { useRouter } from "next/navigation";

const FEEDBACK_DELAY = 2000;

export default function PlayPage() {
  const status = useGameStore((s) => s.status);
  const questions = useGameStore((s) => s.questions);
  const currentIndex = useGameStore((s) => s.currentIndex);
  const score = useGameStore((s) => s.score);
  const bestStreak = useGameStore((s) => s.bestStreak);
  const answers = useGameStore((s) => s.answers);
  const error = useGameStore((s) => s.error);

  const startGame = useGameStore((s) => s.startGame);
  const answerQuestion = useGameStore((s) => s.answerQuestion);
  const resetGame = useGameStore((s) => s.resetGame);
  const goToNextQuestion = useGameStore((s) => s.goToNextQuestion);
  const setFeedbackActive = useGameStore((s) => s.setFeedbackActive);
  const tick = useGameStore((s) => s.tick);

  const { currentPlayer } = usePlayerStore();
  const { chartCountry } = useSettingsStore();
  const { playCorrect, playWrong } = useSound();
  const router = useRouter();

  // local UI state
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (status === "idle" && currentPlayer) {
      startGame();
    }
  }, [status, startGame, currentPlayer]);

  useEffect(() => {
    return () => {
      resetGame();
    };
  }, [resetGame]);

  useEffect(() => {
    if (status !== "in-progress") return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, tick]);

  const currentQuestion = questions[currentIndex];

  const handleAnswerClick = (answerId: string) => {
    if (isLocked || !currentQuestion || status !== "in-progress") return;

    const isCorrect = answerId === currentQuestion.correctAnswerId;

    setSelectedAnswerId(answerId);
    setIsLocked(true);
    setFeedbackActive(true);

    if (isCorrect) {
      playCorrect();
    } else {
      playWrong();
    }

    answerQuestion(answerId);

    setTimeout(() => {
      goToNextQuestion();
      setSelectedAnswerId(null);
      setIsLocked(false);
      setFeedbackActive(false);
    }, FEEDBACK_DELAY);
  };

  if (!currentPlayer) {
    return <NotLogged />;
  }

  if (status === "error") {
    return (
      <main className="h-full flex items-center justify-center text-white">
        <div className="z-10 bg-background/70 border border-border rounded-2xl p-8 text-center max-w-sm fixed top-1/2 left-1/2 -translate-1/2">
          <h1 className="text-2xl font-display mb-2">Oops!</h1>
          <p className="text-sm text-muted-foreground mb-4">
            We couldn&apos;t load new songs right now.
            <br />
            {error && (
              <span className="mt-1 block text-xs opacity-70">{error}</span>
            )}
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => {
                startGame();
              }}
            >
              Try again
            </Button>
            <Button
              variant="default"
              onClick={() => {
                router.push("/");
              }}
            >
              Back home
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (status === "loading" || status === "idle") {
    return (
      <main className="h-full flex items-center justify-center text-white">
        <div className="fixed top-1/2 left-1/2 -translate-1/2">
          <CircularText text="LOADING ✦ SONGS ✦ " spinDuration={7} />
        </div>
      </main>
    );
  }

  if (status === "finished") {
    const totalQuestions = questions.length;
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const accuracy = totalQuestions
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

    return (
      <main className="h-full flex items-center justify-center text-white relative">
        <motion.div
          className="z-10 bg-background/70 border border-border rounded-2xl px-8 py-10 max-w-md text-center overflow-hidden fixed top-1/2  -translate-y-1/2"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="pointer-events-none absolute -top-24 -right-24 opacity-40">
            <CircularText text="GAME ✦ OVER ✦" spinDuration={12} />
          </div>

          <motion.h1
            className="text-3xl font-display mb-2 relative z-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            Game Over
          </motion.h1>

          <motion.p
            className="text-sm text-muted-foreground mb-6 relative z-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.3 }}
          >
            Nice run{currentPlayer ? `, ${currentPlayer.name}` : ""}! Here’s how
            you did.
          </motion.p>

          <motion.div
            className="mb-6 relative z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.22, duration: 0.3 }}
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Total score
            </p>
            <div className="inline-flex items-baseline gap-1 px-4 py-2 rounded-xl bg-muted/40 border border-border">
              <span className="text-3xl font-mono">{score}</span>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
                pts
              </span>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 gap-3 text-xs mb-8 relative z-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.3 }}
          >
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Accuracy
              </p>
              <p className="text-lg font-semibold">{accuracy}%</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Correct
              </p>
              <p className="text-lg font-semibold">
                {correctAnswers}/{totalQuestions}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Best streak
              </p>
              <p className="text-lg font-semibold">{bestStreak}</p>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center relative z-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.3 }}
          >
            <Button onClick={() => resetGame()}>Play again</Button>

            <Button asChild>
              <Link href="/profile">View your stats</Link>
            </Button>

            <Button asChild>
              <Link href="/leaderboard">See leaderboard</Link>
            </Button>
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row justify-center relative z-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.3 }}
          >
            <ShareResultsButton
              score={score}
              totalQuestions={questions.length}
              country={chartCountry ?? "us"}
            />
          </motion.div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="h-full flex text-white relative justify-center">
      <div
        className="z-10 bg-background/70 border border-border rounded-2xl p-8 w-full max-w-md h-fit"
        key={currentQuestion.id}
      >
        <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
          <span>
            Question <span className="text-white">{currentIndex + 1}</span> /{" "}
            {questions.length}
          </span>
          <span className="flex items-center">
            Score:
            <Counter
              value={score}
              places={[1000, 100, 10, 1]}
              fontSize={13}
              textColor="white"
              fontWeight={400}
            />
          </span>
        </div>

        <StreakHeader />

        <TimerBar />

        <p className="font-display text-xl mb-6">
          “{currentQuestion.lyricLine}”
        </p>

        <AnswerList
          answers={currentQuestion.answers}
          correctAnswerId={currentQuestion.correctAnswerId}
          selectedAnswerId={selectedAnswerId}
          isLocked={isLocked}
          onAnswerClick={handleAnswerClick}
        />
      </div>
    </main>
  );
}

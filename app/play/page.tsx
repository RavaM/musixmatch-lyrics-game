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

const FEEDBACK_DELAY = 2000;
const MAX_TIME_PER_QUESTION = 20;

export default function PlayPage() {
  const {
    status,
    questions,
    currentIndex,
    timeLeft,
    score,
    currentStreak,
    bestStreak,
    isFeedbackActive,
    startGame,
    tick,
    answerQuestion,
    resetGame,
    goToNextQuestion,
    setFeedbackActive,
  } = useGameStore();
  const { currentPlayer } = usePlayerStore();

  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Start game when player exists and game is idle
  useEffect(() => {
    if (status === "idle" && currentPlayer) {
      startGame();
    }
  }, [status, startGame, currentPlayer]);

  // Timer
  useEffect(() => {
    if (status !== "in-progress") return;
    if (isFeedbackActive) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, tick, isFeedbackActive]);

  // Reset game when leaving /play
  useEffect(() => {
    return () => {
      resetGame();
    };
  }, [resetGame]);

  const currentQuestion = questions[currentIndex];
  const noQuestionAvailable =
    !currentQuestion ||
    questions.length === 0 ||
    currentIndex >= questions.length;

  const handleAnswerClick = (answerId: string) => {
    if (isLocked || !currentQuestion || status !== "in-progress") return;

    setSelectedAnswerId(answerId);
    setIsLocked(true);
    setFeedbackActive(true);

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

  if (status === "loading" || status === "idle" || noQuestionAvailable) {
    return (
      <main className="h-full flex items-center justify-center text-white">
        <CircularText text="LOADING ✦ SONGS ✦ " spinDuration={7} />
      </main>
    );
  }

  if (status === "finished") {
    return (
      <main className="h-full justify-center flex text-white">
        <div className="z-10 bg-background/70 border border-border rounded-2xl p-8 text-center h-fit">
          <h1 className="text-3xl font-display mb-4">Game Over</h1>
          <p className="mb-2">Your score: {score}</p>
          <Button onClick={() => resetGame()}>Play again</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="h-full flex text-white relative justify-center">
      <div className="z-10 bg-background/70 border border-border rounded-2xl p-8 w-full max-w-md h-fit">
        {/* Top info bar */}
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

        <StreakHeader currentStreak={currentStreak} bestStreak={bestStreak} />

        <TimerBar timeLeft={timeLeft} maxTime={MAX_TIME_PER_QUESTION} />

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

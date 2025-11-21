import { create } from "zustand";
import { useHistoryStore } from "./history";
import { usePlayerStore } from "./player";
import { AnswerRecord, GameState, Question } from "../types/game";
import { usePlayerHistoryStore } from "./player-history";
import { getMockQuestions } from "../mock/questions";
import { useSettingsStore } from "./settings";

const USE_MOCK = false;

export const useGameStore = create<GameState>((set, get) => ({
  // config
  totalQuestions: 10,
  maxTimePerQuestion: 20,
  maxPointsPerQuestion: 1000,

  // state
  status: "idle",
  questions: [],
  currentIndex: 0,
  timeLeft: 20,
  score: 0,
  answers: [],
  currentStreak: 0,
  bestStreak: 0,
  isFeedbackActive: false,
  error: null,

  // actions
  startGame: async () => {
    const { maxTimePerQuestion, totalQuestions } = get();
    const { recentTrackIds } = usePlayerHistoryStore.getState();
    const { chartCountry } = useSettingsStore.getState();

    set({
      status: "loading",
      questions: [],
      currentIndex: 0,
      score: 0,
      answers: [],
      currentStreak: 0,
      bestStreak: 0,
      timeLeft: maxTimePerQuestion,
      error: null,
    });

    if (USE_MOCK) {
      const questions = getMockQuestions(totalQuestions);

      setTimeout(() => {
        set({
          questions,
          status: "in-progress",
          currentIndex: 0,
          timeLeft: maxTimePerQuestion,
        });
      }, 2000);

      return;
    }

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count: totalQuestions,
          excludeTrackIds: recentTrackIds,
          country: chartCountry,
        }),
      });

      if (!res.ok) throw new Error("Failed to load questions");
      const data = await res.json();
      const questions: Question[] = data.questions;

      if (!questions || questions.length === 0) {
        throw new Error("Empty question set");
      }

      set({
        questions,
        status: "in-progress",
        currentIndex: 0,
        timeLeft: maxTimePerQuestion,
      });
    } catch (error) {
      console.error(error);
      set({
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong loading questions.",
      });
    }
  },

  answerQuestion: (answerId) => {
    const state = get();
    const {
      questions,
      currentIndex,
      maxTimePerQuestion,
      maxPointsPerQuestion,
      timeLeft,
    } = state;

    const question = questions[currentIndex];
    if (!question || state.status !== "in-progress") return;

    const isCorrect = answerId === question.correctAnswerId;

    const timeTaken = maxTimePerQuestion - timeLeft;
    const timeFactor = Math.max(timeLeft, 0) / maxTimePerQuestion;
    const basePoints = isCorrect ? maxPointsPerQuestion : 0;
    const points = Math.round(basePoints * timeFactor);

    const answerRecord: AnswerRecord = {
      questionId: question.id,
      selectedAnswerId: answerId,
      isCorrect,
      timeTaken,
      points,
    };

    const newStreak = isCorrect ? state.currentStreak + 1 : 0;
    const bestStreak = Math.max(state.bestStreak, newStreak);

    set({
      answers: [...state.answers, answerRecord],
      score: state.score + points,
      currentStreak: newStreak,
      bestStreak,
    });
  },

  tick: () => {
    const state = get();
    if (state.status !== "in-progress") return;

    if (state.timeLeft <= 1) {
      get().answerQuestion(null);
      get().goToNextQuestion();
    } else {
      set({ timeLeft: state.timeLeft - 1 });
    }
  },

  setFeedbackActive: (active: boolean) => set({ isFeedbackActive: active }),

  goToNextQuestion: () => {
    const state = get();
    const { currentIndex, questions, maxTimePerQuestion } = state;
    const nextIndex = currentIndex + 1;

    if (nextIndex >= questions.length) {
      const trackIds = state.questions.map((q) => q.trackId);
      usePlayerHistoryStore.getState().addUsedTracks(trackIds);

      set({ status: "finished" });
      const { currentPlayer } = usePlayerStore.getState();
      const { chartCountry } = useSettingsStore.getState();
      const correctAnswers = state.answers.filter((a) => a.isCorrect).length;

      useHistoryStore.getState().addResult({
        playerId: currentPlayer?.id ?? null,
        playerName: currentPlayer?.name ?? null,
        score: state.score,
        totalQuestions: questions.length,
        correctAnswers,
        country: chartCountry,
      });

      return;
    }

    set({
      currentIndex: nextIndex,
      timeLeft: maxTimePerQuestion,
    });
  },

  resetGame: () => {
    set({
      status: "idle",
      questions: [],
      currentIndex: 0,
      timeLeft: get().maxTimePerQuestion,
      score: 0,
      answers: [],
      error: null,
    });
  },
}));

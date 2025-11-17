import { create } from "zustand";

export type GameStatus = "idle" | "loading" | "in-progress" | "finished";

export interface AnswerOption {
  id: string;
  label: string; // artist name
  isCorrect: boolean;
}

export interface Question {
  id: string;
  lyricLine: string;
  answers: AnswerOption[];
  correctAnswerId: string;
}

export interface AnswerRecord {
  questionId: string;
  selectedAnswerId: string | null;
  isCorrect: boolean;
  timeTaken: number; // in seconds
  points: number;
}

interface GameConfig {
  totalQuestions: number;
  maxTimePerQuestion: number; // seconds
  maxPointsPerQuestion: number;
}

interface GameState extends GameConfig {
  status: GameStatus;
  questions: Question[];
  currentIndex: number;
  timeLeft: number;
  score: number;
  answers: AnswerRecord[];

  // actions
  startGame: () => Promise<void>;
  answerQuestion: (answerId: string | null) => void;
  tick: () => void;
  nextQuestion: () => void;
  resetGame: () => void;
}

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

  // actions
  startGame: async () => {
    set({ status: "loading", score: 0, answers: [], currentIndex: 0 });

    // TODO: replace this with real Musixmatch-powered questions
    const mockQuestions: Question[] = Array.from({
      length: get().totalQuestions,
    }).map((_, index) => ({
      id: `q-${index}`,
      lyricLine: `Mock lyric line #${index + 1} goes here...`,
      correctAnswerId: "a-1",
      answers: [
        { id: "a-1", label: "Correct Artist", isCorrect: true },
        { id: "a-2", label: "Wrong Artist 1", isCorrect: false },
        { id: "a-3", label: "Wrong Artist 2", isCorrect: false },
      ],
    }));

    const { maxTimePerQuestion } = get();

    set({
      questions: mockQuestions,
      status: "in-progress",
      currentIndex: 0,
      timeLeft: maxTimePerQuestion,
    });
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
    const timeFactor = Math.max(timeLeft, 0) / maxTimePerQuestion; // faster = more points
    const basePoints = isCorrect ? maxPointsPerQuestion : 0;
    const points = Math.round(basePoints * timeFactor);

    const answerRecord: AnswerRecord = {
      questionId: question.id,
      selectedAnswerId: answerId,
      isCorrect,
      timeTaken,
      points,
    };

    set({
      answers: [...state.answers, answerRecord],
      score: state.score + points,
    });

    // Immediately move to next question
    get().nextQuestion();
  },

  tick: () => {
    const state = get();
    if (state.status !== "in-progress") return;

    if (state.timeLeft <= 1) {
      // time up → treat as no answer
      get().answerQuestion(null);
    } else {
      set({ timeLeft: state.timeLeft - 1 });
    }
  },

  nextQuestion: () => {
    const { currentIndex, questions, maxTimePerQuestion } = get();
    const nextIndex = currentIndex + 1;

    if (nextIndex >= questions.length) {
      set({ status: "finished" });
      // Here you can also persist game results to localStorage
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
    });
  },
}));

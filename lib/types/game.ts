export type GameStatus = "idle" | "loading" | "in-progress" | "finished";

export interface AnswerOption {
  id: string;
  label: string; // artist name
  isCorrect: boolean;
}

export type Question = {
  id: string;
  trackId: number;
  lyricLine: string;
  artistId: number;
  artistName: string;
  correctAnswerId: string;
  answers: AnswerOption[];
};

export interface AnswerRecord {
  questionId: string;
  selectedAnswerId: string | null;
  isCorrect: boolean;
  timeTaken: number; // in seconds
  points: number;
}

interface GameConfig {
  totalQuestions: number;
  maxTimePerQuestion: number;
  maxPointsPerQuestion: number;
}

export interface GameState extends GameConfig {
  status: GameStatus;
  questions: Question[];
  currentIndex: number;
  timeLeft: number;
  score: number;
  answers: AnswerRecord[];
  currentStreak: number;
  bestStreak: number;
  isFeedbackActive: boolean;

  // actions
  startGame: () => Promise<void>;
  answerQuestion: (answerId: string | null) => void;
  tick: () => void;
  goToNextQuestion: () => void;
  resetGame: () => void;
  setFeedbackActive: (active: boolean) => void;
}

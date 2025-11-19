// lib/mock/questions.ts
import type { Question } from "@/lib/types/game";

const BASE_MOCK_QUESTIONS: Question[] = [
  {
    id: "mock-1",
    trackId: 1,
    lyricLine: "We were both young when I first saw you",
    artistId: 101,
    artistName: "Taylor Swift",
    correctAnswerId: "a1",
    answers: [
      {
        id: "a1",
        label: "Taylor Swift",
        isCorrect: true,
      },
      { id: "a2", label: "Ariana Grande", isCorrect: false },
      { id: "a3", label: "Dua Lipa", isCorrect: false },
    ],
  },
  {
    id: "mock-2",
    trackId: 2,
    lyricLine: "Just a small-town girl, living in a lonely world",
    artistId: 102,
    artistName: "Journey",
    correctAnswerId: "b1",
    answers: [
      {
        id: "b1",
        label: "Journey",
        isCorrect: true,
      },
      { id: "b2", label: "Bon Jovi", isCorrect: false },
      { id: "b3", label: "Queen", isCorrect: false },
    ],
  },
];

export function getMockQuestions(count: number): Question[] {
  // simple loop if you request more than we have
  const result: Question[] = [];
  for (let i = 0; i < count; i++) {
    const base = BASE_MOCK_QUESTIONS[i % BASE_MOCK_QUESTIONS.length];
    result.push({
      ...base,
      id: `${base.id}-${i}`,
    });
  }
  return result;
}

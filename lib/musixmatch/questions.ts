// lib/musixmatch/questions.ts

import type { Question, AnswerOption } from "@/lib/types/game";
import {
  getPopularTracksWithLyrics,
  getTrackSnippet,
  type TrackSummary,
} from "./client";

// Extend TrackSummary for convenience (genres nested in primary_genres)
type TrackWithGenres = TrackSummary;

export type ArtistPoolItem = {
  artist_id: number;
  artist_name: string;
  genreId?: number;
  genreName?: string;
};

// ----------------------
// Module-level caches
// ----------------------

let tracksCache: TrackWithGenres[] | null = null;
let tracksPromise: Promise<TrackWithGenres[]> | null = null;
let artistPoolCache: ArtistPoolItem[] | null = null;

// optional: basic cache expiry (e.g. refresh every 2 hours)
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;
let lastCacheFill = 0;

// ----------------------
// Helpers
// ----------------------

function extractGenre(track: TrackWithGenres): {
  genreId?: number;
  genreName?: string;
} {
  const list = track.primary_genres?.music_genre_list ?? [];
  const first = list[0]?.music_genre;
  if (!first) return {};
  return {
    genreId: first.music_genre_id,
    genreName: first.music_genre_name,
  };
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function lineFromSnippet(snippet: string): string {
  const lines = snippet
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  return lines[0] || snippet.trim();
}

async function ensureTrackAndArtistCache(): Promise<{
  tracks: TrackWithGenres[];
  artists: ArtistPoolItem[];
}> {
  const now = Date.now();
  const cacheExpired = now - lastCacheFill > CACHE_TTL_MS;

  if (!tracksPromise && (!tracksCache || cacheExpired)) {
    tracksPromise = (async () => {
      const rawTracks = (await getPopularTracksWithLyrics({
        country: "us",
        pageSize: 150,
        page: 1,
      })) as TrackWithGenres[];

      tracksCache = rawTracks;
      lastCacheFill = Date.now();
      tracksPromise = null;
      artistPoolCache = null; // force rebuild
      return rawTracks;
    })();
  }

  const tracks = tracksCache ?? (await tracksPromise!);

  if (!artistPoolCache) {
    const byId = new Map<number, ArtistPoolItem>();

    for (const t of tracks) {
      const { genreId, genreName } = extractGenre(t);
      if (!byId.has(t.artist_id)) {
        byId.set(t.artist_id, {
          artist_id: t.artist_id,
          artist_name: t.artist_name,
          genreId,
          genreName,
        });
      }
    }

    artistPoolCache = Array.from(byId.values());
  }

  return { tracks, artists: artistPoolCache };
}

/**
 * Build answer options:
 *  - prefer wrong artists with same genreId when possible
 *  - otherwise fall back to full pool
 */
function buildAnswerOptions(params: {
  correctArtistId: number;
  correctArtistName: string;
  genreId?: number;
  artistPool: ArtistPoolItem[];
  numOptions?: number;
}): AnswerOption[] {
  const { correctArtistId, correctArtistName, genreId, artistPool } = params;
  const numOptions = params.numOptions ?? 3;

  const others = artistPool.filter((a) => a.artist_id !== correctArtistId);

  let candidates = others;

  if (genreId) {
    const sameGenre = others.filter((a) => a.genreId && a.genreId === genreId);
    if (sameGenre.length >= numOptions - 1) {
      candidates = sameGenre;
    }
  }

  const shuffled = shuffle(candidates);
  const distractors = shuffled.slice(0, numOptions - 1);

  const answers: AnswerOption[] = [
    {
      id: "correct",
      label: correctArtistName,
      isCorrect: true,
    },
    ...distractors.map((a, idx) => ({
      id: `wrong-${idx}`,
      label: a.artist_name,
      isCorrect: false,
    })),
  ];

  return shuffle(answers);
}

// ----------------------
// Public: fetchQuestions
// ----------------------

export async function fetchQuestions(
  count: number,
  excludeTrackIds: number[] = []
): Promise<Question[]> {
  const { tracks, artists } = await ensureTrackAndArtistCache();

  const excludeSet = new Set(excludeTrackIds);

  // Filter tracks to avoid recently seen ones when possible
  let candidateTracks = shuffle(
    tracks.filter(
      (t) =>
        t.has_lyrics === 1 &&
        t.instrumental !== 1 &&
        !excludeSet.has(t.track_id)
    )
  );

  // If too few left after filtering, relax constraint (allow some repeats)
  if (candidateTracks.length < count * 2) {
    candidateTracks = shuffle(
      tracks.filter((t) => t.has_lyrics === 1 && t.instrumental !== 1)
    );
  }

  const questions: Question[] = [];

  for (const track of candidateTracks) {
    if (questions.length >= count) break;

    const snippet = await getTrackSnippet(track.track_id);
    if (!snippet) continue;

    const lyricLine = lineFromSnippet(snippet);
    if (!lyricLine || lyricLine.length < 5) continue;

    const { genreId } = extractGenre(track);

    const answers = buildAnswerOptions({
      correctArtistId: track.artist_id,
      correctArtistName: track.artist_name,
      genreId,
      artistPool: artists,
      numOptions: 3,
    });

    const correct = answers.find((a) => a.isCorrect)!;

    questions.push({
      id: `track-${track.track_id}`,
      trackId: track.track_id,
      lyricLine,
      artistId: track.artist_id,
      artistName: track.artist_name,
      correctAnswerId: correct.id,
      answers,
    });
  }

  return questions;
}

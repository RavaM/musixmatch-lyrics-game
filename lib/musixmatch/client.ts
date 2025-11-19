// lib/musixmatch/client.ts

const BASE_URL = "https://api.musixmatch.com/ws/1.1";

type MMResponse<TBody> = {
  message: {
    header: {
      status_code: number;
      execute_time: number;
    };
    body: TBody;
  };
};

async function mmGet<TBody>(
  method: string,
  params: Record<string, string | number | undefined>
): Promise<TBody> {
  const url = new URL(`${BASE_URL}/${method}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    url.searchParams.set(key, String(value));
  });

  const apiKey = process.env.MUSIXMATCH_API_KEY;
  if (!apiKey) {
    throw new Error("MUSIXMATCH_API_KEY is not set");
  }
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Musixmatch HTTP error ${res.status}`);
  }

  const json = (await res.json()) as MMResponse<TBody>;
  const status = json.message.header.status_code;
  if (status !== 200) {
    throw new Error(`Musixmatch API status_code ${status}`);
  }

  return json.message.body;
}

// ----- Types -----

export type TrackSummary = {
  track_id: number;
  track_name: string;
  artist_id: number;
  artist_name: string;
  has_lyrics: number;
  instrumental?: number;
  primary_genres?: {
    music_genre_list?: {
      music_genre?: {
        music_genre_id?: number;
        music_genre_name?: string;
        music_genre_name_extended?: string;
        music_genre_parent_id?: number;
        music_genre_vanity?: string;
      };
    }[];
  };
};

type ChartTracksBody = {
  track_list: { track: TrackSummary }[];
};

export async function getPopularTracksWithLyrics(options?: {
  country?: string;
  pageSize?: number;
  page?: number;
}): Promise<TrackSummary[]> {
  const body = await mmGet<ChartTracksBody>("chart.tracks.get", {
    chart_name: "top",
    country: options?.country ?? "us",
    page_size: options?.pageSize ?? 100,
    page: options?.page ?? 1,
    f_has_lyrics: 1,
  });

  return body.track_list
    .map((t) => t.track)
    .filter((t) => t.has_lyrics === 1 && t.instrumental !== 1);
}

type SnippetBody = {
  snippet?: { snippet_body: string };
};

export async function getTrackSnippet(trackId: number): Promise<string | null> {
  const body = await mmGet<SnippetBody>("track.snippet.get", {
    track_id: trackId,
  });

  return body.snippet?.snippet_body ?? null;
}

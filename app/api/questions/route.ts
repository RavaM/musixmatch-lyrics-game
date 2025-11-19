// app/api/questions/route.ts
import { NextResponse } from "next/server";
import { fetchQuestions } from "@/lib/musixmatch/questions";

type QuestionsRequestBody = {
  count?: number;
  excludeTrackIds?: number[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as QuestionsRequestBody;
    const count = body.count ?? 10;
    const excludeTrackIds = body.excludeTrackIds ?? [];

    const questions = await fetchQuestions(count, excludeTrackIds);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error in /api/questions", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// (Optional) Keep GET for debugging:
/*
export async function GET(req: Request) {
  const url = new URL(req.url);
  const countParam = url.searchParams.get("count");
  const count = countParam ? Number(countParam) : 10;

  const questions = await fetchQuestions(count);
  return NextResponse.json({ questions });
}
*/

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CANDIDATES, MAX_VOTERS } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const voterId = request.nextUrl.searchParams.get("voterId") || "";

  // Get all votes
  const { data: votesData, error } = await supabase
    .from("votes")
    .select("candidate_id, voter_id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const totalVotes = votesData?.length ?? 0;

  // Count per candidate
  const votes: Record<string, number> = Object.fromEntries(
    CANDIDATES.map((c) => [c.id, 0])
  );
  for (const row of votesData ?? []) {
    if (votes[row.candidate_id] !== undefined) {
      votes[row.candidate_id]++;
    }
  }

  const alreadyVoted = voterId
    ? (votesData ?? []).some((r) => r.voter_id === voterId)
    : false;

  return NextResponse.json({
    votes,
    totalVotes,
    isClosed: totalVotes >= MAX_VOTERS,
    alreadyVoted,
  });
}

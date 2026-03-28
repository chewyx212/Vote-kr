import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CANDIDATES, MAX_VOTERS } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { voterId, candidateId } = body;

    if (!voterId || typeof voterId !== "string") {
      return NextResponse.json({ success: false, message: "Invalid voter ID." }, { status: 400 });
    }

    if (!candidateId || typeof candidateId !== "string" || !CANDIDATES.find((c) => c.id === candidateId)) {
      return NextResponse.json({ success: false, message: "Invalid candidate." }, { status: 400 });
    }

    // Check if already voted
    const { data: existing } = await supabase
      .from("votes")
      .select("id")
      .eq("voter_id", voterId)
      .single();

    if (existing) {
      return NextResponse.json({ success: false, message: "You have already voted." }, { status: 400 });
    }

    // Check total count
    const { count } = await supabase
      .from("votes")
      .select("id", { count: "exact", head: true });

    if ((count ?? 0) >= MAX_VOTERS) {
      return NextResponse.json(
        { success: false, message: "Voting is closed. Maximum number of voters reached." },
        { status: 400 }
      );
    }

    // Insert vote
    const { error } = await supabase.from("votes").insert({
      candidate_id: candidateId,
      voter_id: voterId,
    });

    if (error) {
      // Unique constraint violation = already voted
      if (error.code === "23505") {
        return NextResponse.json({ success: false, message: "You have already voted." }, { status: 400 });
      }
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Vote cast successfully!" });
  } catch {
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

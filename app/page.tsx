"use client";

import { useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import VotingForm from "@/components/VotingForm";
import Results from "@/components/Results";

interface VoteState {
  votes: Record<string, number>;
  totalVotes: number;
  isClosed: boolean;
  alreadyVoted: boolean;
}

export default function Home() {
  const [voterId, setVoterId] = useState<string | null>(null);
  const [voteState, setVoteState] = useState<VoteState | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [justVoted, setJustVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize voter ID from localStorage
  useEffect(() => {
    let id = localStorage.getItem("voterId");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("voterId", id);
    }
    setVoterId(id);

    const voted = localStorage.getItem("hasVoted") === "true";
    const votedForCandidate = localStorage.getItem("votedFor");
    setHasVoted(voted);
    setVotedFor(votedForCandidate);
  }, []);

  const fetchVoteState = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/votes?voterId=${encodeURIComponent(id)}`);
      const data = await res.json();
      setVoteState(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (voterId) {
      fetchVoteState(voterId);
    }
  }, [voterId, fetchVoteState]);

  function handleVoteSuccess(candidateId: string) {
    setHasVoted(true);
    setVotedFor(candidateId);
    setJustVoted(true);
    if (voterId) fetchVoteState(voterId);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const serverAlreadyVoted = voteState?.alreadyVoted ?? false;
  const isClosed = voteState?.isClosed ?? false;

  // Show results if: voted locally, server confirms voted, or voting is closed
  if (hasVoted || serverAlreadyVoted || isClosed) {
    return (
      <Results
        votes={voteState?.votes ?? {}}
        totalVotes={voteState?.totalVotes ?? 0}
        votedFor={votedFor}
        isClosed={isClosed}
        justVoted={justVoted}
      />
    );
  }

  return (
    <VotingForm
      voterId={voterId!}
      totalVotes={voteState?.totalVotes ?? 0}
      onVoteSuccess={handleVoteSuccess}
    />
  );
}

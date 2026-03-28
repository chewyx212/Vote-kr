"use client";

import { useState } from "react";
import { CANDIDATES, MAX_VOTERS } from "@/lib/store";

interface VotingFormProps {
  voterId: string;
  totalVotes: number;
  onVoteSuccess: (candidateId: string) => void;
}

export default function VotingForm({ voterId, totalVotes, onVoteSuccess }: VotingFormProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const spotsLeft = MAX_VOTERS - totalVotes;

  async function handleVote() {
    if (!selected) {
      setError("Please select a candidate first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId, candidateId: selected }),
      });

      const data = await res.json();

      if (data.success) {
        // Save to localStorage that this device has voted
        localStorage.setItem("hasVoted", "true");
        localStorage.setItem("votedFor", selected);
        onVoteSuccess(selected);
      } else {
        setError(data.message || "Failed to cast vote.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
          <span className="text-3xl">🗳️</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Vote</h1>
        <p className="text-gray-500 text-sm">Cast your vote — each person votes once</p>

        {/* Voter slots indicator */}
        <div className="mt-4 inline-flex items-center gap-2 bg-white border border-indigo-100 rounded-full px-4 py-2 shadow-sm">
          <span className="flex gap-1">
            {Array.from({ length: MAX_VOTERS }).map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < (MAX_VOTERS - spotsLeft) ? "bg-indigo-500" : "bg-gray-200"
                }`}
              />
            ))}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
          </span>
        </div>
      </div>

      {/* Candidates */}
      <div className="w-full max-w-md space-y-3 mb-6">
        {CANDIDATES.map((candidate) => (
          <button
            key={candidate.id}
            onClick={() => setSelected(candidate.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
              selected === candidate.id
                ? "border-indigo-500 bg-indigo-50 shadow-md"
                : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                selected === candidate.id ? "bg-indigo-100" : "bg-gray-100"
              }`}
            >
              {candidate.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{candidate.name}</p>
              <p className="text-sm text-gray-500 truncate">{candidate.description}</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                selected === candidate.id
                  ? "border-indigo-500 bg-indigo-500"
                  : "border-gray-300"
              }`}
            >
              {selected === candidate.id && (
                <svg className="w-full h-full text-white p-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="w-full max-w-md mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Submit button */}
      <div className="w-full max-w-md">
        <button
          onClick={handleVote}
          disabled={!selected || loading}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 ${
            selected && !loading
              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Casting vote...
            </span>
          ) : (
            "Cast My Vote"
          )}
        </button>
      </div>

      <p className="mt-6 text-xs text-gray-400 text-center max-w-sm">
        Your vote is anonymous and stored securely. You can only vote once from this device.
      </p>
    </div>
  );
}

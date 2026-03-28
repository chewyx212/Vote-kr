"use client";

import { CANDIDATES, MAX_VOTERS } from "@/lib/store";

interface ResultsProps {
  votes: Record<string, number>;
  totalVotes: number;
  votedFor?: string | null;
  isClosed: boolean;
  justVoted?: boolean;
}

export default function Results({ votes, totalVotes, votedFor, isClosed, justVoted }: ResultsProps) {
  const maxVotes = Math.max(...Object.values(votes), 1);
  const winner = totalVotes > 0
    ? CANDIDATES.reduce((a, b) => (votes[a.id] || 0) >= (votes[b.id] || 0) ? a : b)
    : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        {justVoted ? (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vote Recorded!</h1>
            {votedFor && (
              <p className="text-gray-500">
                You voted for{" "}
                <span className="font-semibold text-indigo-600">
                  {CANDIDATES.find((c) => c.id === votedFor)?.name}
                </span>
              </p>
            )}
          </>
        ) : isClosed ? (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
              <span className="text-3xl">🏆</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Voting Closed</h1>
            <p className="text-gray-500">All 7 votes have been cast</p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Already Voted</h1>
            <p className="text-gray-500">You&apos;ve already cast your vote from this device</p>
          </>
        )}
      </div>

      {/* Progress */}
      <div className="w-full max-w-md mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-600">Total votes</span>
          <span className="text-sm font-bold text-indigo-600">{totalVotes} / {MAX_VOTERS}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-700"
            style={{ width: `${(totalVotes / MAX_VOTERS) * 100}%` }}
          />
        </div>
        <div className="flex gap-1 mt-2">
          {Array.from({ length: MAX_VOTERS }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full ${i < totalVotes ? "bg-indigo-500" : "bg-gray-200"}`}
            />
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="w-full max-w-md space-y-3 mb-6">
        {CANDIDATES.sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0)).map((candidate, index) => {
          const count = votes[candidate.id] || 0;
          const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          const barWidth = totalVotes > 0 ? (count / maxVotes) * 100 : 0;
          const isWinner = winner?.id === candidate.id && totalVotes > 0;
          const isVotedFor = votedFor === candidate.id;

          return (
            <div
              key={candidate.id}
              className={`bg-white rounded-2xl border-2 p-4 transition-all ${
                isWinner && isClosed
                  ? "border-yellow-400 shadow-md shadow-yellow-100"
                  : isVotedFor
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                  isWinner && isClosed ? "bg-yellow-100" : "bg-gray-100"
                }`}>
                  {candidate.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{candidate.name}</p>
                    {isWinner && isClosed && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                        🏆 Leader
                      </span>
                    )}
                    {isVotedFor && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                        Your vote
                      </span>
                    )}
                    {index === 0 && !isClosed && totalVotes > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Leading
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{candidate.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-400">{percentage}%</p>
                </div>
              </div>

              {/* Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    isVotedFor ? "bg-indigo-500" : isWinner && isClosed ? "bg-yellow-400" : "bg-gray-400"
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {!isClosed && (
        <p className="text-xs text-gray-400 text-center">
          Voting is still open — {MAX_VOTERS - totalVotes} spot{MAX_VOTERS - totalVotes !== 1 ? "s" : ""} remaining
        </p>
      )}
    </div>
  );
}

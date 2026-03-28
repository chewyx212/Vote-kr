export const MAX_VOTERS = 7;

export interface Candidate {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export const CANDIDATES: Candidate[] = [
  { id: "alpha", name: "Alpha", description: "Leading with vision and innovation", emoji: "🚀" },
  { id: "beta", name: "Beta", description: "Building trust through reliability", emoji: "🛡️" },
  { id: "gamma", name: "Gamma", description: "Growing together with creativity", emoji: "🌟" },
];

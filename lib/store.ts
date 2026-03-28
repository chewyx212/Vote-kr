export const MAX_VOTERS = 7;

export interface Candidate {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export const CANDIDATES: Candidate[] = [
  { id: "yes", name: "Yes", description: "I agree", emoji: "✅" },
  { id: "no", name: "No", description: "I disagree", emoji: "❌" },
];

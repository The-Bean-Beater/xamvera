type Difficulty = "Easy" | "Medium" | "Hard" | string;

const difficultyWeights: Record<string, number> = {
  Easy: 0.8,
  Medium: 1,
  Hard: 1.25
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function decayMasteryScore(score: number, lastReviewed?: string | null) {
  if (!lastReviewed) return score;

  const elapsedMs = Date.now() - new Date(lastReviewed).getTime();
  const elapsedDays = Math.max(0, elapsedMs / 86_400_000);
  const decay = Math.min(18, elapsedDays * 0.28);

  return clampScore(score - decay);
}

export function calculateUpdatedMastery({
  correct,
  currentScore,
  difficulty,
  lastReviewed
}: {
  correct: boolean;
  currentScore: number;
  difficulty: Difficulty;
  lastReviewed?: string | null;
}) {
  const decayedScore = decayMasteryScore(currentScore, lastReviewed);
  const weight = difficultyWeights[difficulty] || 1;
  const delta = correct ? 8 * weight : -5 * weight;

  return clampScore(decayedScore + delta);
}

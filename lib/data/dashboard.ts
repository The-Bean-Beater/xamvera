import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type DashboardData = {
  xp: number;
  streak: number;
  recentAccuracy: number;
  masteryProgress: number;
  weakUnits: { unit: string; score: number }[];
  recommendedFocus: string;
  recentPractice: { question: string; correct: boolean; createdAt: string }[];
};

const emptyDashboard: DashboardData = {
  xp: 0,
  streak: 0,
  recentAccuracy: 0,
  masteryProgress: 0,
  weakUnits: [],
  recommendedFocus: "Start with one AP World MCQ set to establish your baseline.",
  recentPractice: []
};

function calculateStreak(attemptDates: string[]) {
  const days = Array.from(
    new Set(
      attemptDates.map((date) => {
        const value = new Date(date);
        return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
      })
    )
  ).sort((a, b) => b - a);

  if (!days.length) return 0;

  let streak = 1;
  for (let index = 1; index < days.length; index += 1) {
    const expectedPreviousDay = days[index - 1] - 86_400_000;
    if (days[index] === expectedPreviousDay) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

export async function getDashboardData(): Promise<DashboardData> {
  if (!hasSupabaseEnv()) return emptyDashboard;

  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return emptyDashboard;

    const [{ data: profile }, { data: attempts }, { data: mastery }] = await Promise.all([
      supabase.from("profiles").select("xp, streak").eq("id", user.id).maybeSingle(),
      supabase
        .from("attempts")
        .select("question_id, correct, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("mastery")
        .select("concept_id, mastery_score")
        .eq("user_id", user.id)
    ]);

    const recentAttempts = attempts || [];
    const questionIds = Array.from(new Set(recentAttempts.map((attempt) => attempt.question_id)));
    const conceptIds = Array.from(new Set((mastery || []).map((row) => row.concept_id)));
    let questions: { id: string; prompt: string }[] = [];
    let concepts: { id: string; concept_name: string; importance_weight: number; unit_id: string }[] = [];
    let units: { id: string; unit_name: string; unit_number: number }[] = [];

    if (questionIds.length) {
      const { data } = await supabase.from("questions").select("id, prompt").in("id", questionIds);
      questions = data || [];
    }

    if (conceptIds.length) {
      const { data } = await supabase.from("concepts").select("id, concept_name, importance_weight, unit_id").in("id", conceptIds);
      concepts = data || [];
    }

    const unitIds = Array.from(new Set(concepts.map((concept) => concept.unit_id)));
    if (unitIds.length) {
      const { data } = await supabase.from("units").select("id, unit_name, unit_number").in("id", unitIds);
      units = data || [];
    }

    const questionPromptById = new Map((questions || []).map((question) => [question.id, question.prompt]));
    const conceptById = new Map((concepts || []).map((concept) => [concept.id, concept]));
    const unitById = new Map((units || []).map((unit) => [unit.id, unit]));
    const correctCount = recentAttempts.filter((attempt) => attempt.correct).length;
    const recentAccuracy = recentAttempts.length ? Math.round((correctCount / recentAttempts.length) * 100) : 0;
    const streak = calculateStreak(recentAttempts.map((attempt) => attempt.created_at));

    const masteryRows = mastery || [];
    const masteryProgress = masteryRows.length
      ? Math.round(masteryRows.reduce((total, row) => total + row.mastery_score, 0) / masteryRows.length)
      : 0;

    const weakUnitsByName = new Map<string, number[]>();
    masteryRows.forEach((row) => {
      const concept = conceptById.get(row.concept_id);
      const unit = concept ? unitById.get(concept.unit_id) : null;
      const unitName = unit?.unit_name || "Unassigned concepts";
      if (!weakUnitsByName.has(unitName)) weakUnitsByName.set(unitName, []);
      weakUnitsByName.get(unitName)?.push(row.mastery_score);
    });

    const weakUnits = Array.from(weakUnitsByName.entries())
      .map(([unit, scores]) => ({
        unit,
        score: Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)
      }))
      .filter((unit) => unit.score < 70)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);

    const weakestConcept = masteryRows
      .slice()
      .sort((a, b) => {
        const aWeight = conceptById.get(a.concept_id)?.importance_weight || 1;
        const bWeight = conceptById.get(b.concept_id)?.importance_weight || 1;
        return a.mastery_score / aWeight - b.mastery_score / bWeight;
      })[0];

    const concept = weakestConcept ? conceptById.get(weakestConcept.concept_id) : null;
    const recommendedFocus = concept
      ? `Review ${concept.concept_name}; it is your highest-priority weak concept right now.`
      : emptyDashboard.recommendedFocus;

    return {
      xp: profile?.xp ?? 0,
      streak: Math.max(profile?.streak ?? 0, streak),
      recentAccuracy,
      masteryProgress,
      weakUnits,
      recommendedFocus,
      recentPractice: recentAttempts.slice(0, 5).map((attempt) => {
        return {
          question: questionPromptById.get(attempt.question_id) || "Practice question",
          correct: attempt.correct,
          createdAt: attempt.created_at
        };
      })
    };
  } catch {
    return emptyDashboard;
  }
}

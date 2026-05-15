import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { seedPracticeQuestions, type PracticeQuestion } from "@/lib/data/practice";

type QuestionRow = {
  id: string;
  concept_id: string;
  question_type: string;
  difficulty: "Easy" | "Medium" | "Hard";
  source_type: string;
  prompt: string;
  stimulus: string | null;
  choices: unknown;
  correct_answer: string;
  explanation: string;
};

function normalizeChoices(choices: unknown): string[] {
  return Array.isArray(choices) ? choices.filter((choice): choice is string => typeof choice === "string") : [];
}

export async function getPracticeQuestions(courseId = "ap-world-history-modern"): Promise<PracticeQuestion[]> {
  if (!hasSupabaseEnv() || courseId !== "ap-world-history-modern") return seedPracticeQuestions;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("questions")
      .select("id, concept_id, question_type, difficulty, source_type, prompt, stimulus, choices, correct_answer, explanation")
      .limit(16);

    if (error || !data?.length) return seedPracticeQuestions;

    return (data as QuestionRow[]).map((question) => {
      const choices = normalizeChoices(question.choices);
      const answerIndex = Math.max(0, choices.findIndex((choice) => choice === question.correct_answer));

      return {
        id: question.id,
        conceptId: question.concept_id,
        skill: question.question_type,
        period: question.source_type,
        difficulty: question.difficulty,
        stimulus: question.stimulus || "No stimulus provided.",
        prompt: question.prompt,
        choices,
        answerIndex,
        explanation: question.explanation
      };
    });
  } catch {
    return seedPracticeQuestions;
  }
}

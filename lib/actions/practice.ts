"use server";

import { revalidatePath } from "next/cache";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { calculateUpdatedMastery } from "@/lib/mastery";

type SubmitAttemptInput = {
  questionId: string;
  selectedAnswerIndex: number;
  responseTime: number;
};

function normalizeChoices(choices: unknown): string[] {
  return Array.isArray(choices) ? choices.filter((choice): choice is string => typeof choice === "string") : [];
}

export async function submitPracticeAttempt(input: SubmitAttemptInput) {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase is not configured yet. Add .env.local to save progress." };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in to save practice progress." };
  }

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("id, concept_id, difficulty, choices, correct_answer")
    .eq("id", input.questionId)
    .maybeSingle();

  if (questionError || !question) {
    return { error: "This question is not in the approved Supabase question bank yet." };
  }

  const choices = normalizeChoices(question.choices);
  const selectedAnswer = choices[input.selectedAnswerIndex];
  const correct = selectedAnswer === question.correct_answer;

  const { error: attemptError } = await supabase.from("attempts").insert({
    user_id: user.id,
    question_id: question.id,
    correct,
    response_time: Math.max(0, Math.round(input.responseTime || 0))
  });

  if (attemptError) {
    return { error: attemptError.message };
  }

  const { data: existingMastery } = await supabase
    .from("mastery")
    .select("id, mastery_score, last_reviewed")
    .eq("user_id", user.id)
    .eq("concept_id", question.concept_id)
    .maybeSingle();

  const nextMasteryScore = calculateUpdatedMastery({
    correct,
    currentScore: existingMastery?.mastery_score ?? 30,
    difficulty: question.difficulty,
    lastReviewed: existingMastery?.last_reviewed
  });

  if (existingMastery) {
    await supabase
      .from("mastery")
      .update({
        mastery_score: nextMasteryScore,
        last_reviewed: new Date().toISOString()
      })
      .eq("id", existingMastery.id)
      .eq("user_id", user.id);
  } else {
    await supabase.from("mastery").insert({
      user_id: user.id,
      concept_id: question.concept_id,
      mastery_score: nextMasteryScore,
      last_reviewed: new Date().toISOString()
    });
  }

  const { data: profile } = await supabase.from("profiles").select("xp, streak").eq("id", user.id).maybeSingle();
  await supabase.from("profiles").upsert({
    id: user.id,
    xp: (profile?.xp ?? 0) + (correct ? 10 : 2),
    streak: Math.max(profile?.streak ?? 0, 1),
    selected_course: "ap-world-history-modern"
  });

  revalidatePath("/dashboard");
  revalidatePath("/practice");

  return { correct, masteryScore: nextMasteryScore };
}

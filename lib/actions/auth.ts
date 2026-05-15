"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
};

function getRedirectPath(formData: FormData) {
  const value = formData.get("next");
  return typeof value === "string" && value.startsWith("/") ? value : "/dashboard";
}

async function ensureProfile() {
  if (!hasSupabaseEnv()) return;

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("profiles").upsert({
    id: user.id,
    username: user.email?.split("@")[0] ?? null,
    selected_course: "ap-world-history-modern"
  });
}

export async function signInWithPassword(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase is not configured yet. Add .env.local first." };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = getRedirectPath(formData);

  if (!email || !password) {
    return { error: "Enter both email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  await ensureProfile();
  redirect(next);
}

export async function signUpWithPassword(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase is not configured yet. Add .env.local first." };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = getRedirectPath(formData);

  if (!email || !password) {
    return { error: "Enter both email and password." };
  }

  if (password.length < 8) {
    return { error: "Use at least 8 characters for your password." };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") || "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`
    }
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    return { error: "Check your email to confirm the account, then log in." };
  }

  await ensureProfile();
  redirect(next);
}

export async function signInWithGoogle(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect("/login?error=Supabase%20is%20not%20configured%20yet.%20Add%20.env.local%20first.");
  }

  const next = getRedirectPath(formData);
  const origin = (await headers()).get("origin") || "http://localhost:3000";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`
    }
  });

  if (error || !data.url) {
    redirect(`/login?error=${encodeURIComponent(error?.message || "Could not start Google sign in.")}`);
  }

  redirect(data.url);
}

import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type CurrentUserProfile = {
  userId: string;
  email: string | null;
  username: string | null;
  xp: number;
  streak: number;
  selectedCourse: string | null;
} | null;

export async function getCurrentUserProfile(): Promise<CurrentUserProfile> {
  if (!hasSupabaseEnv()) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username, xp, streak, selected_course")
      .eq("id", user.id)
      .maybeSingle();

    return {
      userId: user.id,
      email: user.email ?? null,
      username: profile?.username ?? null,
      xp: profile?.xp ?? 0,
      streak: profile?.streak ?? 0,
      selectedCourse: profile?.selected_course ?? "ap-world-history-modern"
    };
  } catch {
    return null;
  }
}

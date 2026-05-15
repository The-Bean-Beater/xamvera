import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

export function createClient() {
  const { key, url } = requireSupabaseEnv();
  return createBrowserClient<Database>(url, key);
}

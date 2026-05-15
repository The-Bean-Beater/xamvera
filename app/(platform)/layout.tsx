import type { ReactNode } from "react";
import { Shell } from "@/components/Shell";
import { getCurrentUserProfile } from "@/lib/data/profile";

export default async function PlatformLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const profile = await getCurrentUserProfile();

  return <Shell profile={profile}>{children}</Shell>;
}

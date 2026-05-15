import { LoginForm } from "@/app/login/LoginForm";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/dashboard";

  return (
    <main className="auth-page">
      <div className="auth-brand">
        <img src="/assets/xanvera-mark-tight-192.png" alt="" aria-hidden="true" />
        <div>
          <strong>XamVera</strong>
          <span>AP mastery workspace</span>
        </div>
      </div>
      <LoginForm error={params.error} next={next} />
    </main>
  );
}

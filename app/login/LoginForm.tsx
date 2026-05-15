"use client";

import { useActionState, useState } from "react";
import { signInWithGoogle, signInWithPassword, signUpWithPassword, type AuthActionState } from "@/lib/actions/auth";

export function LoginForm({ error, next }: { error?: string; next: string }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginState, loginAction, loginPending] = useActionState<AuthActionState, FormData>(signInWithPassword, {});
  const [signupState, signupAction, signupPending] = useActionState<AuthActionState, FormData>(signUpWithPassword, {});
  const activeState = mode === "login" ? loginState : signupState;
  const isPending = loginPending || signupPending;

  return (
    <section className="panel auth-card">
      <span className="panel-label">XamVera Account</span>
      <h1>Sign in to save mastery</h1>
      <p>Keep AP practice, weak concepts, streaks, and dashboard recommendations synced to your account.</p>

      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next} />
        <button className="secondary-button auth-google" type="submit">
          Continue with Google
        </button>
      </form>

      <div className="auth-divider">
        <span>Email</span>
      </div>

      <div className="auth-tabs" role="tablist" aria-label="Email auth mode">
        <button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>
          Log In
        </button>
        <button className={mode === "signup" ? "active" : ""} type="button" onClick={() => setMode("signup")}>
          Create Account
        </button>
      </div>

      <form className="auth-form" action={mode === "login" ? loginAction : signupAction}>
        <input type="hidden" name="next" value={next} />
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required />
        </label>
        {(activeState.error || error) && <div className="auth-error">{activeState.error || error}</div>}
        <button className="primary-button" type="submit" disabled={isPending}>
          {isPending ? "Working..." : mode === "login" ? "Log In" : "Create Account"}
        </button>
      </form>
    </section>
  );
}

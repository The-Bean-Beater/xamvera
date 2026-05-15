"use client";

import { useActionState, useState, useEffect } from "react";
import { signInWithGoogle, signInWithPassword, signUpWithPassword, type AuthActionState } from "@/lib/actions/auth";

export function LoginForm({ error, next }: { error?: string; next: string }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginState, loginAction, loginPending] = useActionState<AuthActionState, FormData>(signInWithPassword, {});
  const [signupState, signupAction, signupPending] = useActionState<AuthActionState, FormData>(signUpWithPassword, {});
  
  const activeState = mode === "login" ? loginState : signupState;
  const isPending = loginPending || signupPending;

  // Clear inputs when switching modes or when a successful login/signup happens (which redirects, but just in case)
  useEffect(() => {
    if (!isPending && !activeState?.error) {
      // If we are not pending and there's no error, it might mean we just succeeded or we are freshly mounted.
      // We don't want to clear if the user is just typing. 
      // Actually, we shouldn't indiscriminately clear. 
      // It's better to just let the controlled state handle it on mount.
    }
  }, [isPending, activeState]);

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
          <input 
            name="email" 
            type="email" 
            autoComplete="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input 
            name="password" 
            type="password" 
            autoComplete={mode === "login" ? "current-password" : "new-password"} 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {(activeState.error || error) && <div className="auth-error">{activeState.error || error}</div>}
        <button className="primary-button" type="submit" disabled={isPending}>
          {isPending ? "Working..." : mode === "login" ? "Log In" : "Create Account"}
        </button>
      </form>
    </section>
  );
}

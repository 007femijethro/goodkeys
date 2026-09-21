"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export default function LoginForm({ justRegistered = false }: { justRegistered?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Login failed.");
        return;
      }

      router.push(data.redirectTo ?? "/dashboard");
      router.refresh();
    } catch {
      setError("Unable to reach GoodKeys. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <span className="section-kicker">Log in</span>
      <h2>Access your account</h2>

      {justRegistered && (
        <div className="auth-alert auth-alert-success">
          Your account was created successfully. You can log in now.
        </div>
      )}

      <label>
        Email address
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      <div className="auth-row">
        <label className="check-row">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          Remember me
        </label>
        <span className="muted-auth-link">Forgot password?</span>
      </div>

      {error && <div className="auth-alert auth-alert-error">{error}</div>}

      <button className="button auth-submit" type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <LoaderCircle className="spin-icon" size={18} />
            Logging in...
          </>
        ) : (
          "Log in"
        )}
      </button>

      <p className="auth-switch">
        New to GoodKeys? <Link href="/register">Create an account</Link>
      </p>
    </form>
  );
}

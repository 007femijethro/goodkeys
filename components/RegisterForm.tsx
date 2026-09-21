"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, LoaderCircle, UserRound } from "lucide-react";

type Role = "tenant" | "agent";

export default function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("tenant");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Registration failed.");
        return;
      }

      setMessage("Account created successfully. Redirecting you to login...");
      setTimeout(() => router.push("/login?registered=1"), 700);
    } catch {
      setError("Unable to reach GoodKeys. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <span className="section-kicker">Create account</span>
      <h2>How will you use GoodKeys?</h2>

      <div className="role-grid">
        <button
          type="button"
          className={"role-card " + (role === "tenant" ? "active" : "")}
          onClick={() => setRole("tenant")}
        >
          <UserRound />
          <strong>I’m looking for a home</strong>
          <span>Search, save and book inspections.</span>
        </button>

        <button
          type="button"
          className={"role-card " + (role === "agent" ? "active" : "")}
          onClick={() => setRole("agent")}
        >
          <Building2 />
          <strong>I’m an agent or landlord</strong>
          <span>List properties and manage enquiries.</span>
        </button>
      </div>

      <label>
        Full name
        <input
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Your full name"
          autoComplete="name"
          required
        />
      </label>

      <label>
        Email address
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </label>

      <label>
        Password
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>

      {error && <div className="auth-alert auth-alert-error">{error}</div>}
      {message && <div className="auth-alert auth-alert-success">{message}</div>}

      <button className="button auth-submit" type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <LoaderCircle className="spin-icon" size={18} />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </button>

      <p className="legal-note">
        By continuing, you agree to GoodKeys’ Terms and Privacy Policy.
      </p>

      <p className="auth-switch">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </form>
  );
}

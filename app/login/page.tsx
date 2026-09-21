import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <Link className="auth-back" href="/">
          <ArrowLeft size={18} /> Back to GoodKeys
        </Link>
        <div className="auth-panel-copy">
          <span className="brand brand-auth">
            <span className="brand-mark"><KeyRound size={20} /></span>
            <span>Good<span>Keys</span></span>
          </span>
          <h1>Welcome back.</h1>
          <p>Your saved homes, inspections and conversations are waiting.</p>
        </div>
      </section>

      <section className="auth-form-panel">
        <LoginForm justRegistered={params.registered === "1"} />
      </section>
    </main>
  );
}

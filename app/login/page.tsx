import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <Link className="auth-back" href="/"><ArrowLeft size={18} /> Back to GoodKeys</Link>
        <div className="auth-panel-copy">
          <span className="brand brand-auth"><span className="brand-mark"><KeyRound size={20} /></span><span>Good<span>Keys</span></span></span>
          <h1>Welcome back.</h1>
          <p>Your saved homes, inspections and conversations are waiting.</p>
        </div>
      </section>
      <section className="auth-form-panel">
        <form className="auth-form">
          <span className="section-kicker">Log in</span>
          <h2>Access your account</h2>
          <label>Email address<input type="email" placeholder="you@example.com" /></label>
          <label>Password<input type="password" placeholder="••••••••" /></label>
          <div className="auth-row"><label className="check-row"><input type="checkbox" /> Remember me</label><a href="#">Forgot password?</a></div>
          <button className="button auth-submit" type="button">Log in</button>
          <p className="auth-switch">New to GoodKeys? <Link href="/register">Create an account</Link></p>
        </form>
      </section>
    </main>
  );
}

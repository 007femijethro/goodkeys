import Link from "next/link";
import { ArrowLeft, Building2, KeyRound, UserRound } from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <section className="auth-brand-panel register-panel">
        <Link className="auth-back" href="/"><ArrowLeft size={18} /> Back to GoodKeys</Link>
        <div className="auth-panel-copy">
          <span className="brand brand-auth"><span className="brand-mark"><KeyRound size={20} /></span><span>Good<span>Keys</span></span></span>
          <h1>A better way to rent starts here.</h1>
          <p>Create your GoodKeys account and choose the experience that fits you.</p>
        </div>
      </section>
      <section className="auth-form-panel">
        <form className="auth-form">
          <span className="section-kicker">Create account</span>
          <h2>How will you use GoodKeys?</h2>
          <div className="role-grid">
            <button type="button" className="role-card active"><UserRound /><strong>I’m looking for a home</strong><span>Search, save and book inspections.</span></button>
            <button type="button" className="role-card"><Building2 /><strong>I’m an agent or landlord</strong><span>List properties and manage enquiries.</span></button>
          </div>
          <label>Full name<input placeholder="Your full name" /></label>
          <label>Email address<input type="email" placeholder="you@example.com" /></label>
          <label>Password<input type="password" placeholder="Create a secure password" /></label>
          <button className="button auth-submit" type="button">Create account</button>
          <p className="legal-note">By continuing, you agree to GoodKeys’ Terms and Privacy Policy.</p>
          <p className="auth-switch">Already have an account? <Link href="/login">Log in</Link></p>
        </form>
      </section>
    </main>
  );
}

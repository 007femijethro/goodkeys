import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <section className="auth-brand-panel register-panel">
        <Link className="auth-back" href="/">
          <ArrowLeft size={18} /> Back to GoodKeys
        </Link>

        <div className="auth-panel-copy">
          <span className="brand brand-auth">
            <span className="brand-mark"><KeyRound size={20} /></span>
            <span>Good<span>Keys</span></span>
          </span>
          <h1>A better way to rent starts here.</h1>
          <p>Create your GoodKeys account and choose the experience that fits you.</p>
        </div>
      </section>

      <section className="auth-form-panel">
        <RegisterForm />
      </section>
    </main>
  );
}

import Link from "next/link";
import { Home, ShieldCheck, UsersRound, Building2 } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { requireSession } from "@/lib/session";

export default async function AdminDashboard() {
  const user = await requireSession(["admin"]);

  return (
    <main className="dashboard-page">
      <header className="dashboard-topbar">
        <Link href="/" className="brand">
          <span className="brand-mark"><Home size={18} /></span>
          <span>Good<span>Keys</span></span>
        </Link>
        <LogoutButton />
      </header>

      <section className="dashboard-shell">
        <div className="dashboard-welcome">
          <span className="section-kicker">Admin dashboard</span>
          <h1>Welcome, {user.fullName.split(" ")[0]}.</h1>
          <p>Your administrator session is active.</p>
        </div>

        <div className="dashboard-card-grid">
          <div className="dashboard-card"><UsersRound /><strong>Users</strong><span>Review GoodKeys accounts.</span></div>
          <div className="dashboard-card"><ShieldCheck /><strong>Verifications</strong><span>Review agents and listings.</span></div>
          <div className="dashboard-card"><Building2 /><strong>Properties</strong><span>Moderate marketplace listings.</span></div>
        </div>
      </section>
    </main>
  );
}

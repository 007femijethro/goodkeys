import Link from "next/link";
import { Building2, CalendarDays, Home, MessageCircle, PlusCircle } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { requireSession } from "@/lib/session";

export default async function AgentDashboard() {
  const user = await requireSession(["agent", "landlord"]);

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
          <span className="section-kicker">Agent dashboard</span>
          <h1>Welcome, {user.fullName.split(" ")[0]}.</h1>
          <p>Your agent session is active. Listing tools are the next workflow to connect.</p>
        </div>

        <div className="dashboard-card-grid">
          <div className="dashboard-card"><PlusCircle /><strong>Add property</strong><span>Create a new GoodKeys listing.</span></div>
          <div className="dashboard-card"><Building2 /><strong>My properties</strong><span>Manage your current listings.</span></div>
          <div className="dashboard-card"><CalendarDays /><strong>Inspections</strong><span>Accept or reschedule requests.</span></div>
          <div className="dashboard-card"><MessageCircle /><strong>Messages</strong><span>Talk with interested renters.</span></div>
        </div>
      </section>
    </main>
  );
}

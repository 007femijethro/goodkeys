import Link from "next/link";
import { CalendarDays, Heart, Home, MessageCircle, Search } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { requireSession } from "@/lib/session";

export default async function TenantDashboard() {
  const user = await requireSession(["tenant"]);

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
          <span className="section-kicker">Tenant dashboard</span>
          <h1>Welcome, {user.fullName.split(" ")[0]}.</h1>
          <p>Your GoodKeys account is active and your session is working.</p>
        </div>

        <div className="dashboard-card-grid">
          <Link href="/properties" className="dashboard-card"><Search /><strong>Find a home</strong><span>Browse verified rental properties.</span></Link>
          <div className="dashboard-card"><Heart /><strong>Saved homes</strong><span>Your favourites will appear here.</span></div>
          <div className="dashboard-card"><CalendarDays /><strong>Inspections</strong><span>Upcoming bookings will appear here.</span></div>
          <div className="dashboard-card"><MessageCircle /><strong>Messages</strong><span>Your agent conversations will appear here.</span></div>
        </div>
      </section>
    </main>
  );
}

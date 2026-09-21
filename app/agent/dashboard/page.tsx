import Link from "next/link";
import { Building2, CalendarDays, MessageCircle, PlusCircle, ShieldCheck, UserRound } from "lucide-react";
import AgentTopbar from "@/components/AgentTopbar";
import { requireSession } from "@/lib/session";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AgentDashboard() {
  const user = await requireSession(["agent", "landlord"]);
  const db = getDb();

  const [counts, profile] = await Promise.all([
    db.query(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE listing_status='active')::int AS active,
         COUNT(*) FILTER (WHERE listing_status='pending_review')::int AS pending,
         COUNT(*) FILTER (WHERE listing_status='draft')::int AS draft
       FROM gk.properties WHERE agent_user_id=$1`,
      [user.id]
    ),
    db.query(`SELECT verification_status FROM gk.agent_profiles WHERE user_id=$1`, [user.id])
  ]);

  const stats = counts.rows[0];
  const verification = profile.rows[0]?.verification_status ?? "unverified";

  return (
    <main className="dashboard-page">
      <AgentTopbar />
      <section className="dashboard-shell">
        <div className="dashboard-welcome">
          <span className="section-kicker">Agent dashboard</span>
          <h1>Welcome, {user.fullName.split(" ")[0]}.</h1>
          <p>Manage your profile, listings and verification status from one place.</p>
        </div>

        <div className="dashboard-stats">
          <div><span>Total listings</span><strong>{stats.total}</strong></div>
          <div><span>Active</span><strong>{stats.active}</strong></div>
          <div><span>Pending review</span><strong>{stats.pending}</strong></div>
          <div><span>Verification</span><strong className="capitalize">{verification}</strong></div>
        </div>

        <div className="dashboard-card-grid">
          <Link href="/agent/properties/new" className="dashboard-card"><PlusCircle /><strong>Add property</strong><span>Create a new listing and submit it for review.</span></Link>
          <Link href="/agent/properties" className="dashboard-card"><Building2 /><strong>My properties</strong><span>Track active, pending and rejected listings.</span></Link>
          <Link href="/agent/profile" className="dashboard-card"><UserRound /><strong>Agent profile</strong><span>Update your public business information.</span></Link>
          <Link href="/agent/verification" className="dashboard-card"><ShieldCheck /><strong>Verification</strong><span>Submit your identity details for review.</span></Link>
          <div className="dashboard-card"><CalendarDays /><strong>Inspections</strong><span>Inspection management is the next marketplace workflow.</span></div>
          <div className="dashboard-card"><MessageCircle /><strong>Messages</strong><span>Messaging will connect renters to your listings.</span></div>
        </div>
      </section>
    </main>
  );
}

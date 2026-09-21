import Link from "next/link";
import { Building2, Home, ShieldCheck, UsersRound } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import ReviewButtons from "@/components/ReviewButtons";
import AgentReviewButtons from "@/components/AgentReviewButtons";
import { requireSession } from "@/lib/session";
import { getDb } from "@/lib/db";
import { formatNaira } from "@/lib/properties";

export const dynamic="force-dynamic";

export default async function AdminDashboard() {
  const user=await requireSession(["admin"]);
  const db=getDb();

  const [pendingProperties,pendingAgents]=await Promise.all([
    db.query(
      `SELECT p.id,p.title,p.area,p.state,p.property_type,p.annual_rent,p.created_at,
              u.full_name AS agent_name,ap.business_name
       FROM gk.properties p
       JOIN gk.users u ON u.id=p.agent_user_id
       LEFT JOIN gk.agent_profiles ap ON ap.user_id=u.id
       WHERE p.listing_status='pending_review'
       ORDER BY p.created_at ASC`
    ),
    db.query(
      `SELECT DISTINCT ON (av.agent_user_id)
              av.agent_user_id,av.id_type,av.id_document_url,av.selfie_url,av.created_at,
              u.full_name,u.email,ap.business_name
       FROM gk.agent_verifications av
       JOIN gk.users u ON u.id=av.agent_user_id
       LEFT JOIN gk.agent_profiles ap ON ap.user_id=u.id
       WHERE av.status='pending'
       ORDER BY av.agent_user_id,av.created_at DESC`
    )
  ]);

  return <main className="dashboard-page">
    <header className="dashboard-topbar">
      <Link href="/" className="brand"><span className="brand-mark"><Home size={18}/></span><span>Good<span>Keys</span></span></Link>
      <LogoutButton/>
    </header>

    <section className="dashboard-shell">
      <div className="dashboard-welcome">
        <span className="section-kicker">Admin dashboard</span>
        <h1>Welcome, {user.fullName.split(" ")[0]}.</h1>
        <p>Review trust signals and marketplace listings before publication.</p>
      </div>

      <div className="dashboard-card-grid admin-summary">
        <div className="dashboard-card"><UsersRound/><strong>Users</strong><span>Account administration.</span></div>
        <div className="dashboard-card"><ShieldCheck/><strong>{pendingAgents.rowCount} agent reviews</strong><span>Identity submissions waiting for review.</span></div>
        <div className="dashboard-card"><Building2/><strong>{pendingProperties.rowCount} property reviews</strong><span>Listings waiting for marketplace review.</span></div>
      </div>

      <div className="panel-card admin-review-panel">
        <div className="form-section-heading"><div><h2>Pending agent verification</h2><p>Review identity references before granting a verified badge.</p></div></div>
        {pendingAgents.rows.length===0?<div className="empty-state compact-empty"><h3>No agent verification waiting</h3></div>:
        <div className="listing-table-wrap"><table className="listing-table"><thead><tr><th>Agent</th><th>ID type</th><th>Documents</th><th>Submitted</th><th>Action</th></tr></thead><tbody>
          {pendingAgents.rows.map(a=><tr key={a.agent_user_id}>
            <td><strong>{a.business_name||a.full_name}</strong><span>{a.email}</span></td>
            <td>{a.id_type}</td>
            <td><a href={a.id_document_url} target="_blank" rel="noreferrer">ID document</a> · <a href={a.selfie_url} target="_blank" rel="noreferrer">Selfie</a></td>
            <td>{new Date(a.created_at).toLocaleDateString()}</td>
            <td><AgentReviewButtons userId={a.agent_user_id}/></td>
          </tr>)}
        </tbody></table></div>}
      </div>

      <div className="panel-card admin-review-panel">
        <div className="form-section-heading"><div><h2>Pending property reviews</h2><p>Approved listings become visible immediately on the public marketplace.</p></div></div>
        {pendingProperties.rows.length===0?<div className="empty-state compact-empty"><h3>No properties waiting for review</h3></div>:
        <div className="listing-table-wrap"><table className="listing-table"><thead><tr><th>Property</th><th>Agent</th><th>Location</th><th>Rent</th><th>Action</th></tr></thead><tbody>
          {pendingProperties.rows.map(p=><tr key={p.id}><td><strong>{p.title}</strong><span>{p.property_type}</span></td><td>{p.business_name||p.agent_name}</td><td>{p.area}, {p.state}</td><td>{formatNaira(Number(p.annual_rent))}</td><td><ReviewButtons id={p.id}/></td></tr>)}
        </tbody></table></div>}
      </div>
    </section>
  </main>
}

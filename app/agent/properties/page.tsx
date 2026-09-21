import Link from "next/link";
import { PlusCircle } from "lucide-react";
import AgentTopbar from "@/components/AgentTopbar";
import { requireSession } from "@/lib/session";
import { getDb } from "@/lib/db";
import { formatNaira } from "@/lib/properties";

export const dynamic="force-dynamic";

export default async function AgentPropertiesPage({searchParams}:{searchParams:Promise<{created?:string}>}){
  const user=await requireSession(["agent","landlord"]);
  const params=await searchParams;
  const db=getDb();
  const result=await db.query(
    `SELECT p.*,
      (p.annual_rent+p.agency_fee+p.legal_fee+p.caution_fee+p.service_charge+p.inspection_fee+p.other_charges) AS move_in_cost
     FROM gk.properties p WHERE p.agent_user_id=$1 ORDER BY p.created_at DESC`,[user.id]
  );

  return <main className="dashboard-page"><AgentTopbar/><section className="dashboard-shell">
    <div className="page-heading-actions"><div className="dashboard-welcome"><span className="section-kicker">Listings</span><h1>My properties</h1><p>Manage every GoodKeys listing from draft to rented.</p></div>
    <Link className="button" href="/agent/properties/new"><PlusCircle size={17}/>Add property</Link></div>
    {params.created==="1"&&<div className="auth-alert auth-alert-success">Property submitted successfully and is waiting for admin review.</div>}
    {result.rows.length===0?<div className="empty-state"><h3>No properties yet</h3><p>Create your first listing to start the review process.</p><Link className="button" href="/agent/properties/new">Add property</Link></div>:
    <div className="listing-table-wrap"><table className="listing-table"><thead><tr><th>Property</th><th>Location</th><th>Rent</th><th>Move-in</th><th>Status</th><th>Created</th></tr></thead>
    <tbody>{result.rows.map(p=><tr key={p.id}><td><strong>{p.title}</strong><span>{p.property_type}</span></td><td>{p.area}, {p.state}</td><td>{formatNaira(Number(p.annual_rent))}</td><td>{formatNaira(Number(p.move_in_cost))}</td><td><span className={"status-badge status-"+p.listing_status}>{p.listing_status.replaceAll("_"," ")}</span></td><td>{new Date(p.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>}
  </section></main>
}

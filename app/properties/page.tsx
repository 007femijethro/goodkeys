import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import { getDb } from "@/lib/db";
import { SlidersHorizontal } from "lucide-react";
import type { Property } from "@/lib/properties";

export const dynamic="force-dynamic";

export default async function PropertiesPage() {
  const db=getDb();
  const result=await db.query(
    `SELECT p.id,p.title,p.property_type,p.bedrooms,p.bathrooms,p.state,p.area,
      p.annual_rent,p.verification_status,
      (p.annual_rent+p.agency_fee+p.legal_fee+p.caution_fee+p.service_charge+p.inspection_fee+p.other_charges) AS move_in_cost,
      (SELECT image_url FROM gk.property_images pi WHERE pi.property_id=p.id ORDER BY pi.is_cover DESC,pi.sort_order LIMIT 1) AS cover_image
     FROM gk.properties p
     WHERE p.listing_status='active' AND p.verification_status='verified'
     ORDER BY p.published_at DESC NULLS LAST,p.created_at DESC`
  );
  const properties:Property[]=result.rows.map(p=>({
    id:p.id,title:p.title,location:`${p.area}, ${p.state}`,price:Number(p.annual_rent),
    moveIn:Number(p.move_in_cost),beds:p.bedrooms,baths:p.bathrooms,type:p.property_type,
    image:p.cover_image||"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
    verified:p.verification_status==="verified"
  }));

  return <main><Header/><section className="listing-hero"><div className="container"><span className="section-kicker">Verified rental homes</span><h1>Find your next home.</h1><p>Browse approved GoodKeys listings and compare estimated move-in costs.</p></div></section>
    <section className="section listing-section">
      <div className="container filter-bar"><input placeholder="Search area or city"/><select defaultValue=""><option value="">Property type</option><option>Apartment</option><option>Duplex</option><option>Terrace</option></select><select defaultValue=""><option value="">Bedrooms</option><option>1+</option><option>2+</option><option>3+</option></select><select defaultValue=""><option value="">Budget</option><option>Under ₦2M</option><option>₦2M – ₦4M</option><option>Above ₦4M</option></select><button><SlidersHorizontal size={18}/>More filters</button></div>
      <div className="container results-heading"><div><strong>{properties.length} homes</strong><span> currently approved</span></div></div>
      {properties.length?<div className="container property-grid">{properties.map(p=><PropertyCard key={p.id} property={p}/>)}</div>:
      <div className="container empty-state public-empty"><h3>No approved listings yet</h3><p>New properties will appear here after GoodKeys admin review.</p></div>}
    </section>
  </main>
}

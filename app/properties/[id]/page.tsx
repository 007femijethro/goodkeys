import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, BedDouble, CalendarDays, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import { formatNaira } from "@/lib/properties";
import { getDb } from "@/lib/db";

export const dynamic="force-dynamic";

export default async function PropertyDetail({params}:{params:Promise<{id:string}>}){
  const {id}=await params; const db=getDb();
  const result=await db.query(
    `SELECT p.*,u.full_name AS agent_name,ap.business_name,ap.verification_status AS agent_verification_status,
     (p.annual_rent+p.agency_fee+p.legal_fee+p.caution_fee+p.service_charge+p.inspection_fee+p.other_charges) AS move_in_cost
     FROM gk.properties p JOIN gk.users u ON u.id=p.agent_user_id LEFT JOIN gk.agent_profiles ap ON ap.user_id=u.id
     WHERE p.id=$1 AND p.listing_status='active' AND p.verification_status='verified'`,[id]);
  if(!result.rowCount) notFound();
  const property=result.rows[0];
  const [images,amenities]=await Promise.all([
    db.query("SELECT image_url FROM gk.property_images WHERE property_id=$1 ORDER BY is_cover DESC,sort_order",[id]),
    db.query("SELECT amenity FROM gk.property_amenities WHERE property_id=$1 ORDER BY amenity",[id])
  ]);
  const photos=images.rows.map(x=>x.image_url);
  const fallback="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85";

  return <main><Header/><section className="property-detail"><div className="container">
    <Link className="detail-back" href="/properties"><ArrowLeft size={16}/>Back to properties</Link>
    <div className="detail-gallery"><img src={photos[0]||fallback} alt={property.title}/><div><img src={photos[1]||photos[0]||fallback} alt="Property interior"/><img src={photos[2]||photos[0]||fallback} alt="Property interior"/></div></div>
    <div className="detail-grid"><div className="detail-copy"><div className="detail-title-row"><div><span className="verified-pill" style={{position:"static",display:"inline-flex",marginBottom:12,background:"#e8f3ee"}}><ShieldCheck size={15}/>Verified listing</span><h1>{property.title}</h1><span className="detail-location"><MapPin size={16}/>{property.area}, {property.state}</span></div><div className="detail-price">{formatNaira(Number(property.annual_rent))}<span>/ year</span></div></div>
    <div className="detail-facts"><span><BedDouble size={19}/>{property.bedrooms} bedrooms</span><span><Bath size={19}/>{property.bathrooms} bathrooms</span></div>
    <h3>About this home</h3><p>{property.description||"This verified GoodKeys listing has been reviewed before publication."}</p>
    {amenities.rows.length>0&&<><h3>Amenities</h3><div className="amenity-list">{amenities.rows.map(a=><span key={a.amenity}>{a.amenity}</span>)}</div></>}
    <h3>Listed by</h3><p><strong>{property.business_name||property.agent_name}</strong>{property.agent_verification_status==="verified"?" · Verified agent":""}</p></div>
    <aside className="booking-card"><h3>Interested in this home?</h3><p>Review the total estimated cost before requesting an inspection.</p>
    <div className="cost-breakdown"><div><span>Annual rent</span><strong>{formatNaira(Number(property.annual_rent))}</strong></div><div><span>Agency fee</span><strong>{formatNaira(Number(property.agency_fee))}</strong></div><div><span>Legal fee</span><strong>{formatNaira(Number(property.legal_fee))}</strong></div><div><span>Caution fee</span><strong>{formatNaira(Number(property.caution_fee))}</strong></div><div><span>Service charge</span><strong>{formatNaira(Number(property.service_charge))}</strong></div><div className="cost-total"><span>Estimated move-in</span><strong>{formatNaira(Number(property.move_in_cost))}</strong></div></div>
    <button className="button"><CalendarDays size={18}/>Book an inspection</button><button className="secondary-button"><MessageCircle size={18} style={{verticalAlign:"middle",marginRight:7}}/>Message agent</button></aside></div>
  </div></section></main>
}

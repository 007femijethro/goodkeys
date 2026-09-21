import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getApiSession } from "@/lib/api-session";

export async function GET(_: Request, { params }: { params: Promise<{ id:string }> }) {
  const { id } = await params;
  const db = getDb();
  const result = await db.query(
    `SELECT p.*, u.full_name AS agent_name, ap.business_name, ap.verification_status AS agent_verification_status,
      (p.annual_rent+p.agency_fee+p.legal_fee+p.caution_fee+p.service_charge+p.inspection_fee+p.other_charges) AS move_in_cost
     FROM gk.properties p
     JOIN gk.users u ON u.id=p.agent_user_id
     LEFT JOIN gk.agent_profiles ap ON ap.user_id=u.id
     WHERE p.id=$1`,
    [id]
  );
  if (!result.rowCount) return NextResponse.json({ ok:false, message:"Property not found." }, { status:404 });

  const [images, amenities] = await Promise.all([
    db.query("SELECT * FROM gk.property_images WHERE property_id=$1 ORDER BY is_cover DESC,sort_order", [id]),
    db.query("SELECT amenity FROM gk.property_amenities WHERE property_id=$1 ORDER BY amenity", [id])
  ]);

  return NextResponse.json({ ok:true, property:result.rows[0], images:images.rows, amenities:amenities.rows.map(x=>x.amenity) });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id:string }> }) {
  const session = await getApiSession(["agent","landlord"]);
  if (!session) return NextResponse.json({ ok:false, message:"Unauthorized" }, { status:401 });
  const { id } = await params;
  const body = await request.json();

  const db=getDb();
  const result=await db.query(
    `UPDATE gk.properties SET
       title=COALESCE(NULLIF($3,''),title),
       description=COALESCE(NULLIF($4,''),description),
       annual_rent=COALESCE($5,annual_rent),
       listing_status=CASE WHEN listing_status='active' THEN 'pending_review' ELSE listing_status END,
       verification_status=CASE WHEN listing_status='active' THEN 'pending' ELSE verification_status END,
       updated_at=NOW()
     WHERE id=$1 AND agent_user_id=$2
     RETURNING *`,
    [id,session.id,String(body.title??"").trim(),String(body.description??"").trim(),
     body.annualRent === undefined ? null : Number(body.annualRent)]
  );
  if (!result.rowCount) return NextResponse.json({ ok:false, message:"Property not found." }, { status:404 });
  return NextResponse.json({ ok:true, property:result.rows[0] });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id:string }> }) {
  const session=await getApiSession(["agent","landlord"]);
  if(!session) return NextResponse.json({ok:false,message:"Unauthorized"},{status:401});
  const {id}=await params;
  const db=getDb();
  const result=await db.query("DELETE FROM gk.properties WHERE id=$1 AND agent_user_id=$2 RETURNING id",[id,session.id]);
  if(!result.rowCount) return NextResponse.json({ok:false,message:"Property not found."},{status:404});
  return NextResponse.json({ok:true,message:"Property deleted."});
}

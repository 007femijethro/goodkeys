import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getApiSession } from "@/lib/api-session";

export async function GET() {
  const session = await getApiSession(["agent", "landlord"]);
  if (!session) return NextResponse.json({ ok:false, message:"Unauthorized" }, { status:401 });

  const db = getDb();
  const result = await db.query(
    `SELECT p.*,
      (p.annual_rent + p.agency_fee + p.legal_fee + p.caution_fee +
       p.service_charge + p.inspection_fee + p.other_charges) AS move_in_cost,
      (SELECT image_url FROM gk.property_images pi
        WHERE pi.property_id=p.id ORDER BY pi.is_cover DESC, pi.sort_order LIMIT 1) AS cover_image
     FROM gk.properties p
     WHERE p.agent_user_id=$1
     ORDER BY p.created_at DESC`,
    [session.id]
  );

  return NextResponse.json({ ok:true, properties:result.rows });
}

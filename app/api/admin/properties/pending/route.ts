import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getApiSession } from "@/lib/api-session";

export async function GET() {
  const session=await getApiSession(["admin"]);
  if(!session) return NextResponse.json({ok:false,message:"Unauthorized"},{status:401});
  const db=getDb();
  const result=await db.query(
    `SELECT p.id,p.title,p.area,p.state,p.property_type,p.annual_rent,p.created_at,
            u.full_name AS agent_name,ap.business_name
       FROM gk.properties p
       JOIN gk.users u ON u.id=p.agent_user_id
       LEFT JOIN gk.agent_profiles ap ON ap.user_id=u.id
      WHERE p.listing_status='pending_review'
      ORDER BY p.created_at ASC`
  );
  return NextResponse.json({ok:true,properties:result.rows});
}

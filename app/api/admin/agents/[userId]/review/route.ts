import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getApiSession } from "@/lib/api-session";

export async function POST(request:Request,{params}:{params:Promise<{userId:string}>}) {
  const session=await getApiSession(["admin"]);
  if(!session) return NextResponse.json({ok:false,message:"Unauthorized"},{status:401});

  const {userId}=await params;
  const body=await request.json();
  const action=body.action === "approve" ? "approve" : body.action === "reject" ? "reject" : "";
  if(!action) return NextResponse.json({ok:false,message:"Invalid action."},{status:400});

  const db=getDb();
  const client=await db.connect();
  try{
    await client.query("BEGIN");
    const latest=await client.query(
      `SELECT id FROM gk.agent_verifications
        WHERE agent_user_id=$1 AND status='pending'
        ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    if(!latest.rowCount){
      await client.query("ROLLBACK");
      return NextResponse.json({ok:false,message:"No pending verification found."},{status:404});
    }

    await client.query(
      `UPDATE gk.agent_verifications
          SET status=$2, reviewed_by=$3, reviewed_at=NOW()
        WHERE id=$1`,
      [latest.rows[0].id, action==="approve"?"approved":"rejected", session.id]
    );

    await client.query(
      `UPDATE gk.agent_profiles
          SET verification_status=$2,
              verified_at=CASE WHEN $2='verified' THEN NOW() ELSE NULL END,
              updated_at=NOW()
        WHERE user_id=$1`,
      [userId, action==="approve"?"verified":"rejected"]
    );

    await client.query(
      `INSERT INTO gk.admin_actions(admin_user_id,action_type,entity_type,entity_id,notes)
       VALUES($1,$2,'agent',$3,NULLIF($4,''))`,
      [session.id,action,userId,String(body.notes??"")]
    );

    await client.query("COMMIT");
    return NextResponse.json({ok:true,message:action==="approve"?"Agent verified.":"Agent verification rejected."});
  }catch(error){
    await client.query("ROLLBACK");
    console.error(error);
    return NextResponse.json({ok:false,message:"Unable to review agent."},{status:500});
  }finally{client.release();}
}

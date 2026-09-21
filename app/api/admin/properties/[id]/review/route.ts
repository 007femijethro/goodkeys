import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getApiSession } from "@/lib/api-session";

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}) {
  const session=await getApiSession(["admin"]);
  if(!session) return NextResponse.json({ok:false,message:"Unauthorized"},{status:401});
  const {id}=await params;
  const body=await request.json();
  const action=body.action === "approve" ? "approve" : body.action === "reject" ? "reject" : "";

  if(!action) return NextResponse.json({ok:false,message:"Invalid action."},{status:400});

  const db=getDb();
  const client=await db.connect();
  try{
    await client.query("BEGIN");
    const result=await client.query(
      action==="approve"
      ? `UPDATE gk.properties SET listing_status='active',verification_status='verified',published_at=NOW(),updated_at=NOW() WHERE id=$1 RETURNING id,title`
      : `UPDATE gk.properties SET listing_status='rejected',verification_status='rejected',updated_at=NOW() WHERE id=$1 RETURNING id,title`,
      [id]
    );
    if(!result.rowCount){ await client.query("ROLLBACK"); return NextResponse.json({ok:false,message:"Property not found."},{status:404}); }
    await client.query(
      `INSERT INTO gk.admin_actions(admin_user_id,action_type,entity_type,entity_id,notes)
       VALUES($1,$2,'property',$3,NULLIF($4,''))`,
      [session.id,action,id,String(body.notes??"")]
    );
    await client.query("COMMIT");
    return NextResponse.json({ok:true,message:action==="approve"?"Property approved and published.":"Property rejected."});
  }catch(error){
    await client.query("ROLLBACK"); console.error(error);
    return NextResponse.json({ok:false,message:"Unable to review property."},{status:500});
  }finally{client.release();}
}

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getApiSession } from "@/lib/api-session";

export async function GET() {
  const session = await getApiSession(["agent", "landlord"]);
  if (!session) return NextResponse.json({ ok:false }, { status:401 });

  const db = getDb();
  const result = await db.query(
    `SELECT av.*, ap.verification_status
       FROM gk.agent_profiles ap
       LEFT JOIN LATERAL (
         SELECT *
           FROM gk.agent_verifications
          WHERE agent_user_id = $1
          ORDER BY created_at DESC
          LIMIT 1
       ) av ON TRUE
      WHERE ap.user_id = $1`,
    [session.id]
  );

  return NextResponse.json({ ok:true, verification: result.rows[0] ?? null });
}

export async function POST(request: Request) {
  const session = await getApiSession(["agent", "landlord"]);
  if (!session) return NextResponse.json({ ok:false, message:"Unauthorized" }, { status:401 });

  const body = await request.json();
  const idType = String(body.idType ?? "").trim();
  const idDocumentUrl = String(body.idDocumentUrl ?? "").trim();
  const selfieUrl = String(body.selfieUrl ?? "").trim();
  const notes = String(body.notes ?? "").trim();

  if (!idType || !idDocumentUrl || !selfieUrl) {
    return NextResponse.json(
      { ok:false, message:"ID type, ID document URL and selfie URL are required." },
      { status:400 }
    );
  }

  const db = getDb();
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO gk.agent_verifications
       (agent_user_id, id_type, id_document_url, selfie_url, notes, status)
       VALUES ($1,$2,$3,$4,NULLIF($5,''),'pending')`,
      [session.id, idType, idDocumentUrl, selfieUrl, notes]
    );
    await client.query(
      `UPDATE gk.agent_profiles
          SET verification_status='pending', updated_at=NOW()
        WHERE user_id=$1`,
      [session.id]
    );
    await client.query("COMMIT");
    return NextResponse.json({ ok:true, message:"Verification submitted for review." }, { status:201 });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return NextResponse.json({ ok:false, message:"Unable to submit verification." }, { status:500 });
  } finally {
    client.release();
  }
}

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getApiSession } from "@/lib/api-session";

export async function GET() {
  const session = await getApiSession(["agent", "landlord"]);
  if (!session) return NextResponse.json({ ok:false, message:"Unauthorized" }, { status:401 });

  const db = getDb();
  const result = await db.query(
    `SELECT u.full_name, u.email, u.phone,
            a.business_name, a.bio, a.office_address, a.cac_number,
            a.profile_image_url, a.verification_status
       FROM gk.users u
       LEFT JOIN gk.agent_profiles a ON a.user_id = u.id
      WHERE u.id = $1`,
    [session.id]
  );

  return NextResponse.json({ ok:true, profile: result.rows[0] ?? null });
}

export async function PUT(request: Request) {
  const session = await getApiSession(["agent", "landlord"]);
  if (!session) return NextResponse.json({ ok:false, message:"Unauthorized" }, { status:401 });

  const body = await request.json();
  const fullName = String(body.fullName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const businessName = String(body.businessName ?? "").trim();
  const bio = String(body.bio ?? "").trim();
  const officeAddress = String(body.officeAddress ?? "").trim();
  const cacNumber = String(body.cacNumber ?? "").trim();
  const profileImageUrl = String(body.profileImageUrl ?? "").trim();

  if (!fullName) {
    return NextResponse.json({ ok:false, message:"Full name is required." }, { status:400 });
  }

  const db = getDb();
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE gk.users
          SET full_name = $2, phone = NULLIF($3,''), updated_at = NOW()
        WHERE id = $1`,
      [session.id, fullName, phone]
    );

    await client.query(
      `INSERT INTO gk.agent_profiles
        (user_id, business_name, bio, office_address, cac_number, profile_image_url)
       VALUES ($1, NULLIF($2,''), NULLIF($3,''), NULLIF($4,''), NULLIF($5,''), NULLIF($6,''))
       ON CONFLICT (user_id) DO UPDATE SET
         business_name = EXCLUDED.business_name,
         bio = EXCLUDED.bio,
         office_address = EXCLUDED.office_address,
         cac_number = EXCLUDED.cac_number,
         profile_image_url = EXCLUDED.profile_image_url,
         updated_at = NOW()`,
      [session.id, businessName, bio, officeAddress, cacNumber, profileImageUrl]
    );

    await client.query("COMMIT");
    return NextResponse.json({ ok:true, message:"Profile updated successfully." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return NextResponse.json({ ok:false, message:"Unable to update profile." }, { status:500 });
  } finally {
    client.release();
  }
}

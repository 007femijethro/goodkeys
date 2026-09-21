import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getApiSession } from "@/lib/api-session";

function slugify(value: string) {
  return value.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function money(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const type = searchParams.get("type")?.trim() ?? "";
  const bedrooms = Number(searchParams.get("bedrooms") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? 0);

  const clauses = ["p.listing_status = 'active'", "p.verification_status = 'verified'"];
  const values: unknown[] = [];

  if (q) {
    values.push(`%${q}%`);
    clauses.push(`(p.area ILIKE $${values.length} OR p.lga ILIKE $${values.length} OR p.state ILIKE $${values.length})`);
  }
  if (type) {
    values.push(type);
    clauses.push(`p.property_type = $${values.length}`);
  }
  if (bedrooms > 0) {
    values.push(bedrooms);
    clauses.push(`p.bedrooms >= $${values.length}`);
  }
  if (maxPrice > 0) {
    values.push(maxPrice);
    clauses.push(`p.annual_rent <= $${values.length}`);
  }

  const db = getDb();
  const result = await db.query(
    `SELECT p.id, p.title, p.slug, p.property_type, p.bedrooms, p.bathrooms,
            p.state, p.lga, p.area, p.annual_rent, p.agency_fee, p.legal_fee,
            p.caution_fee, p.service_charge, p.inspection_fee, p.other_charges,
            p.verification_status,
            (p.annual_rent+p.agency_fee+p.legal_fee+p.caution_fee+p.service_charge+p.inspection_fee+p.other_charges) AS move_in_cost,
            (SELECT image_url FROM gk.property_images pi WHERE pi.property_id=p.id ORDER BY pi.is_cover DESC,pi.sort_order LIMIT 1) AS cover_image
       FROM gk.properties p
      WHERE ${clauses.join(" AND ")}
      ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC`,
    values
  );

  return NextResponse.json({ ok:true, properties:result.rows });
}

export async function POST(request: Request) {
  const session = await getApiSession(["agent", "landlord"]);
  if (!session) return NextResponse.json({ ok:false, message:"Unauthorized" }, { status:401 });

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const propertyType = String(body.propertyType ?? "").trim();
  const state = String(body.state ?? "").trim();
  const area = String(body.area ?? "").trim();

  if (!title || !propertyType || !state || !area || money(body.annualRent) <= 0) {
    return NextResponse.json(
      { ok:false, message:"Title, property type, state, area and annual rent are required." },
      { status:400 }
    );
  }

  const db = getDb();
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    const slug = `${slugify(title)}-${Date.now().toString(36)}`;

    const result = await client.query(
      `INSERT INTO gk.properties (
        agent_user_id,title,slug,description,property_type,bedrooms,bathrooms,toilets,
        state,lga,area,street_address,annual_rent,agency_fee,legal_fee,caution_fee,
        service_charge,inspection_fee,other_charges,furnished,serviced,parking_spaces,
        listing_status,verification_status,available_from
      ) VALUES (
        $1,$2,$3,NULLIF($4,''),$5,$6,$7,$8,$9,NULLIF($10,''),$11,NULLIF($12,''),
        $13,$14,$15,$16,$17,$18,$19,$20,$21,$22,'pending_review','pending',NULLIF($23,'')::date
      )
      RETURNING *`,
      [
        session.id,title,slug,String(body.description??"").trim(),propertyType,
        Number(body.bedrooms??0),Number(body.bathrooms??0),Number(body.toilets??0),
        state,String(body.lga??"").trim(),area,String(body.streetAddress??"").trim(),
        money(body.annualRent),money(body.agencyFee),money(body.legalFee),money(body.cautionFee),
        money(body.serviceCharge),money(body.inspectionFee),money(body.otherCharges),
        Boolean(body.furnished),Boolean(body.serviced),Number(body.parkingSpaces??0),
        String(body.availableFrom??"").trim()
      ]
    );

    const property = result.rows[0];
    const imageUrls = Array.isArray(body.imageUrls)
      ? body.imageUrls.map((x: unknown) => String(x).trim()).filter(Boolean).slice(0,20)
      : [];
    const amenities = Array.isArray(body.amenities)
      ? body.amenities.map((x: unknown) => String(x).trim()).filter(Boolean).slice(0,30)
      : [];

    for (let i=0;i<imageUrls.length;i++) {
      await client.query(
        `INSERT INTO gk.property_images(property_id,image_url,sort_order,is_cover)
         VALUES($1,$2,$3,$4)`,
        [property.id,imageUrls[i],i,i===0]
      );
    }
    for (const amenity of amenities) {
      await client.query(
        `INSERT INTO gk.property_amenities(property_id,amenity)
         VALUES($1,$2) ON CONFLICT DO NOTHING`,
        [property.id, amenity]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({
      ok:true,
      message:"Property submitted for admin review.",
      property
    }, { status:201 });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return NextResponse.json({ ok:false, message:"Unable to create property." }, { status:500 });
  } finally {
    client.release();
  }
}

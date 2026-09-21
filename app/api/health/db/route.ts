import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await db.query(
      `SELECT
        current_database() AS database,
        current_user AS db_user,
        NOW() AS connected_at,
        (
          SELECT COUNT(*)::int
          FROM information_schema.tables
          WHERE table_schema = 'gk'
        ) AS goodkeys_table_count`
    );

    return NextResponse.json({
      ok: true,
      service: "GoodKeys",
      database: result.rows[0],
      schema: "gk",
    });
  } catch (error) {
    console.error("GoodKeys DB health check failed", error);

    return NextResponse.json(
      {
        ok: false,
        service: "GoodKeys",
        database: "unavailable",
      },
      { status: 500 }
    );
  }
}

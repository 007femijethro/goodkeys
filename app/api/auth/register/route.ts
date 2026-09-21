import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

type RegisterBody = {
  fullName?: string;
  email?: string;
  password?: string;
  role?: "tenant" | "agent";
};

export async function POST(request: Request) {
  const db = getDb();
  const client = await db.connect();

  try {
    const body = (await request.json()) as RegisterBody;

    const fullName = body.fullName?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";
    const role = body.role === "agent" ? "agent" : "tenant";

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { ok: false, message: "Full name, email and password are required." },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { ok: false, message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    const existingUser = await client.query(
      "SELECT id FROM gk.users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (existingUser.rowCount) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { ok: false, message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const userResult = await client.query(
      `INSERT INTO gk.users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role, created_at`,
      [email, passwordHash, fullName, role]
    );

    const user = userResult.rows[0];

    if (role === "agent") {
      await client.query(
        `INSERT INTO gk.agent_profiles (user_id, verification_status)
         VALUES ($1, 'unverified')`,
        [user.id]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json(
      {
        ok: true,
        message: "GoodKeys account created successfully.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("GoodKeys registration failed", error);

    return NextResponse.json(
      { ok: false, message: "We could not create your account. Please try again." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

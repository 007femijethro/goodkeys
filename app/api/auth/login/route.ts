import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { createSessionToken, dashboardForRole } from "@/lib/auth";

type LoginBody = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = await db.query(
      `SELECT id, email, full_name, role, password_hash, status
         FROM gk.users
        WHERE email = $1
        LIMIT 1`,
      [email]
    );

    if (!result.rowCount) {
      return NextResponse.json(
        { ok: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    if (user.status !== "active") {
      return NextResponse.json(
        { ok: false, message: "This account is not currently active." },
        { status: 403 }
      );
    }

    if (!user.password_hash) {
      return NextResponse.json(
        { ok: false, message: "This account cannot use password login yet." },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return NextResponse.json(
        { ok: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const maxAge = body.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
    const sessionUser = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    };

    const token = createSessionToken(sessionUser, maxAge);
    const response = NextResponse.json({
      ok: true,
      message: "Login successful.",
      user: sessionUser,
      redirectTo: dashboardForRole(user.role),
    });

    response.cookies.set("goodkeys_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
    });

    return response;
  } catch (error) {
    console.error("GoodKeys login failed", error);
    return NextResponse.json(
      { ok: false, message: "We could not log you in. Please try again." },
      { status: 500 }
    );
  }
}

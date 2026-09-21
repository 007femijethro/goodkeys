import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get("goodkeys_session")?.value);

  if (!session) {
    return NextResponse.json(
      { ok: false, authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    user: {
      id: session.id,
      email: session.email,
      fullName: session.fullName,
      role: session.role,
    },
  });
}

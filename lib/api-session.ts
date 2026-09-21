import { cookies } from "next/headers";
import { verifySessionToken, type SessionUser } from "@/lib/auth";

export async function getApiSession(
  allowedRoles?: SessionUser["role"][]
) {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get("goodkeys_session")?.value);

  if (!session) return null;
  if (allowedRoles && !allowedRoles.includes(session.role)) return null;

  return session;
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dashboardForRole, verifySessionToken } from "@/lib/auth";

export async function requireSession(
  allowedRoles?: Array<"tenant" | "agent" | "landlord" | "admin">
) {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get("goodkeys_session")?.value);

  if (!session) {
    redirect("/login");
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    redirect(dashboardForRole(session.role));
  }

  return session;
}

import crypto from "node:crypto";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: "tenant" | "agent" | "landlord" | "admin";
};

type SessionPayload = SessionUser & {
  exp: number;
};

function getSecret() {
  const secret = process.env.SESSION_SECRET;

  if (secret) return secret;

  if (process.env.NODE_ENV !== "production") {
    return "goodkeys-local-development-secret-change-me";
  }

  throw new Error("SESSION_SECRET is not configured");
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signature(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createSessionToken(user: SessionUser, maxAgeSeconds: number) {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };

  const encoded = encode(JSON.stringify(payload));
  return `${encoded}.${signature(encoded)}`;
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token) return null;

  const [encoded, suppliedSignature] = token.split(".");
  if (!encoded || !suppliedSignature) return null;

  const expectedSignature = signature(encoded);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);

  if (
    supplied.length !== expected.length ||
    !crypto.timingSafeEqual(supplied, expected)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(decode(encoded)) as SessionPayload;

    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function dashboardForRole(role: SessionUser["role"]) {
  if (role === "admin") return "/admin";
  if (role === "agent" || role === "landlord") return "/agent/dashboard";
  return "/dashboard";
}

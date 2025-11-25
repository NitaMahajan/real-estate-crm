// packages/backend/src/lib/jwt.ts
import jwt from "jsonwebtoken";
// import { env } from process.env // we'll reference env validator later

const JWT_SECRET = process.env.JWT_SECRET || '';
const ACCESS_EXPIRES = "1h";
const REFRESH_EXPIRES = "30d";

type AccessPayload = { sub: string; role?: string; email?: string; typ: "access" };
type RefreshPayload = { sub: string; typ: "refresh" };


export function signAccessToken(payload: Omit<AccessPayload, "typ">) {
  const p = { ...payload, typ: "access" as const };
  return jwt.sign(p, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function signRefreshToken(payload: Omit<RefreshPayload, "typ">) {
  const p = { ...payload, typ: "refresh" as const };
  return jwt.sign(p, JWT_SECRET, { expiresIn: REFRESH_EXPIRES });
}

// verify raw token and return decoded payload
export function verifyRawToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as any;
}

// helper: verify access token specifically
export function verifyAccessToken(token: string) {
  const decoded = verifyRawToken(token) as any;
  if (!decoded || decoded.typ !== "access") throw new Error("Invalid token type");
  return decoded as AccessPayload;
}

// helper: verify refresh token specifically
export function verifyRefreshToken(token: string) {
  const decoded = verifyRawToken(token) as any;
  if (!decoded || decoded.typ !== "refresh") throw new Error("Invalid token type");
  return decoded as RefreshPayload;
}
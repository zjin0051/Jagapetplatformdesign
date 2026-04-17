import crypto from "crypto";
import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

const SESSION_COOKIE = "shell&fin_session";
const SESSION_DAYS = 30;

export function hashPassword(password: string, salt?: string) {
  const actualSalt = salt ?? crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, actualSalt, 64).toString("hex");
  return `${actualSalt}:${derived}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(":");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(key, "hex");
  const b = Buffer.from(derived, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function createSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function buildSessionCookie(token: string) {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function getCookie(req: any, name: string) {
  const cookieHeader = req.headers.cookie || "";
  const parts = cookieHeader.split(";").map((p: string) => p.trim());
  const match = parts.find((p: string) => p.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

export async function getSessionUser(req: any) {
  const token = getCookie(req, SESSION_COOKIE);
  if (!token) return null;

  const tokenHash = sha256(token);

  const rows = await sql`
    select u.user_id, u.username, q.answers
    from public.user_session s
    join public.app_user u on u.user_id = s.user_id
    left join public.user_quiz_profile q on q.user_id = u.user_id
    where s.session_token_hash = ${tokenHash}
      and s.expires_at > now()
    limit 1
  `;

  return rows[0] ?? null;
}

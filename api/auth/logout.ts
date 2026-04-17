import { clearSessionCookie, getCookie, sha256, sql } from "../_lib/auth";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = getCookie(req, "jagapet_session");
    if (token) {
      await sql`
        delete from public.user_session
        where session_token_hash = ${sha256(token)}
      `;
    }

    res.setHeader("Set-Cookie", clearSessionCookie());
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
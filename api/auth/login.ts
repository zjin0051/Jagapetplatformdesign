import {
  sql,
  verifyPassword,
  createSessionToken,
  sha256,
  buildSessionCookie,
} from "../_lib/auth";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username, password } = req.body || {};
    const cleanUsername = String(username || "").trim().toLowerCase();
    const cleanPassword = String(password || "");

    const rows = await sql`
      select user_id, username, password_hash
      from public.app_user
      where username = ${cleanUsername}
      limit 1
    `;

    const user = rows[0];
    if (!user || !verifyPassword(cleanPassword, user.password_hash)) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const sessionToken = createSessionToken();
    const sessionHash = sha256(sessionToken);

    await sql`
      insert into public.user_session (user_id, session_token_hash, expires_at)
      values (${user.user_id}, ${sessionHash}, now() + interval '30 days')
    `;

    res.setHeader("Set-Cookie", buildSessionCookie(sessionToken));
    return res.status(200).json({
      user: {
        userId: user.user_id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
import {
  sql,
  hashPassword,
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

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(cleanUsername)) {
      return res.status(400).json({
        error: "Username must be 3-30 characters and use letters, numbers, or underscores only.",
      });
    }

    if (cleanPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    const existing = await sql`
      select user_id from public.app_user where username = ${cleanUsername} limit 1
    `;

    if (existing.length > 0) {
      return res.status(409).json({ error: "Username already exists." });
    }

    const passwordHash = hashPassword(cleanPassword);

    const inserted = await sql`
      insert into public.app_user (username, password_hash)
      values (${cleanUsername}, ${passwordHash})
      returning user_id, username
    `;

    const user = inserted[0];
    const sessionToken = createSessionToken();
    const sessionHash = sha256(sessionToken);

    await sql`
      insert into public.user_session (user_id, session_token_hash, expires_at)
      values (${user.user_id}, ${sessionHash}, now() + interval '30 days')
    `;

    res.setHeader("Set-Cookie", buildSessionCookie(sessionToken));
    return res.status(201).json({
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
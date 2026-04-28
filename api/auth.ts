import {
  sql,
  hashPassword,
  verifyPassword,
  createSessionToken,
  sha256,
  buildSessionCookie,
  clearSessionCookie,
  getCookie,
  getSessionUser,
} from "./_lib/auth.js";

function getAction(req: any) {
  const rawAction = req.query?.action;

  if (Array.isArray(rawAction)) {
    return rawAction[0];
  }

  return String(rawAction || "");
}

async function login(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body || {};
  const cleanUsername = String(username || "").trim().toLowerCase();
  const cleanPassword = String(password || "");

  const rows = await sql`
    select user_id, user_name, user_password_hash
    from public.user
    where user_name = ${cleanUsername}
    limit 1
  `;

  const user = rows[0];

  if (!user || !verifyPassword(cleanPassword, user.user_password_hash)) {
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
      username: user.user_name,
    },
  });
}

async function logout(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = getCookie(req, "shell&fin_session");

  if (token) {
    await sql`
      delete from public.user_session
      where session_token_hash = ${sha256(token)}
    `;
  }

  res.setHeader("Set-Cookie", clearSessionCookie());

  return res.status(200).json({ ok: true });
}

async function me(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sessionUser = await getSessionUser(req);

  if (!sessionUser) {
    return res.status(200).json({ user: null });
  }

  return res.status(200).json({
    user: {
      userId: sessionUser.user_id,
      username: sessionUser.user_name,
      answers: sessionUser.answers ?? null,
    },
  });
}

async function register(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body || {};

  const cleanUsername = String(username || "").trim().toLowerCase();
  const cleanPassword = String(password || "");

  if (!/^[a-zA-Z0-9_]{3,30}$/.test(cleanUsername)) {
    return res.status(400).json({
      error:
        "Username must be 3-30 characters and use letters, numbers, or underscores only.",
    });
  }

  if (cleanPassword.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters.",
    });
  }

  const existing = await sql`
    select user_id
    from public.user
    where user_name = ${cleanUsername}
    limit 1
  `;

  if (existing.length > 0) {
    return res.status(409).json({ error: "Username already exists." });
  }

  const passwordHash = hashPassword(cleanPassword);

  const inserted = await sql`
    insert into public.user (user_name, user_password_hash)
    values (${cleanUsername}, ${passwordHash})
    returning user_id, user_name
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
      username: user.user_name,
    },
  });
}

export default async function handler(req: any, res: any) {
  try {
    const action = getAction(req);

    if (action === "login") {
      return await login(req, res);
    }

    if (action === "logout") {
      return await logout(req, res);
    }

    if (action === "me") {
      return await me(req, res);
    }

    if (action === "register") {
      return await register(req, res);
    }

    return res.status(404).json({
      error: "Unknown auth action.",
      action,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
import { getSessionUser, sql } from "./_lib/auth";

export default async function handler(req: any, res: any) {
  try {
    const sessionUser = await getSessionUser(req);

    if (!sessionUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "GET") {
      return res.status(200).json({
        username: sessionUser.username,
        answers: sessionUser.answers ?? null,
      });
    }

    if (req.method === "POST") {
      const { answers } = req.body || {};

      if (!answers || typeof answers !== "object") {
        return res.status(400).json({ error: "Missing answers" });
      }

      const rows = await sql`
        insert into public.user_quiz_profile (user_id, answers, updated_at)
        values (${sessionUser.user_id}, ${JSON.stringify(answers)}::jsonb, now())
        on conflict (user_id)
        do update set answers = excluded.answers, updated_at = now()
        returning answers, updated_at
      `;

      return res.status(200).json(rows[0]);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
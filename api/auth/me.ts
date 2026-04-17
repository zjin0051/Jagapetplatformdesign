import { getSessionUser } from "../_lib/auth";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sessionUser = await getSessionUser(req);

    if (!sessionUser) {
      return res.status(200).json({ user: null });
    }

    return res.status(200).json({
      user: {
        userId: sessionUser.user_id,
        username: sessionUser.username,
        answers: sessionUser.answers ?? null,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
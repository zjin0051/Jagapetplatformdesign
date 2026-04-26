import { getSessionUser, sql } from "./_lib/auth.js";

function mapTask(row: any) {
  return {
    id: row.pet_task_id,
    petListId: row.pet_list_id,
    type: row.pet_task_type,
    done: row.pet_task_done,
    count: Number(row.pet_task_count ?? 1),
    interval: Number(row.pet_task_interval ?? 1),
    intervalUnit: row.pet_task_interval_unit || "day",
    lastCompleted: row.pet_task_last_done,
  };
}

export default async function handler(req: any, res: any) {
  try {
    const sessionUser = await getSessionUser(req);

    if (!sessionUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method !== "PATCH") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { taskId } = req.body || {};

    if (!taskId) {
      return res.status(400).json({ error: "Missing taskId" });
    }

    const rows = await sql`
      update public.pet_task t
      set
        pet_task_done = true,
        pet_task_last_done = now()
      from public.pet_list pl
      where t.pet_list_id = pl.pet_list_id
        and pl.user_id = ${sessionUser.user_id}
        and t.pet_task_id = ${String(taskId)}
      returning
        t.pet_task_id,
        t.pet_list_id,
        t.pet_task_type,
        t.pet_task_done,
        t.pet_task_created_at,
        t.pet_task_last_done,
        t.pet_task_count,
        t.pet_task_interval,
        t.pet_task_interval_unit
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(200).json(mapTask(rows[0]));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
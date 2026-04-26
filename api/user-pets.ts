import { randomUUID } from "crypto";
import { getSessionUser, sql } from "./_lib/auth.js";

type FrequencySpec = {
  count: number;
  interval: number;
  unit: "day" | "week" | "month" | "year";
};

function parseFrequency(
  rawText: unknown,
  fallback: FrequencySpec,
): FrequencySpec {
  const text = String(rawText || "")
    .toLowerCase()
    .trim();

  if (!text) return fallback;

  let count = 1;
  let interval = 1;
  let unit: FrequencySpec["unit"] = fallback.unit;

  if (
    text.includes("twice") ||
    text.includes("2x") ||
    text.includes("2 times")
  ) {
    count = 2;
  }

  const numberMatch = text.match(/(\d+)/);
  if (numberMatch && !text.includes("-")) {
    count = Number(numberMatch[1]);
  }

  if (text.includes("daily") || text.includes("day")) {
    unit = "day";
  } else if (text.includes("weekly") || text.includes("week")) {
    unit = "week";
  } else if (text.includes("monthly") || text.includes("month")) {
    unit = "month";
  } else if (text.includes("yearly") || text.includes("year")) {
    unit = "year";
  }

  if (
    text.includes("bi-weekly") ||
    text.includes("biweekly") ||
    text.includes("fortnight")
  ) {
    count = 1;
    interval = 2;
    unit = "week";
  }

  return { count, interval, unit };
}

function buildDefaultTasks(careProfile: any) {
  return [
    {
      type: "feeding",
      frequency: parseFrequency(careProfile?.feeding_frequency, {
        count: 1,
        interval: 1,
        unit: "day",
      }),
    },
    {
      type: "water-change",
      frequency: parseFrequency(careProfile?.cleaning_frequency, {
        count: 1,
        interval: 1,
        unit: "week",
      }),
    },
    {
      type: "health-check",
      frequency: parseFrequency(careProfile?.vet_checkup_frequency, {
        count: 1,
        interval: 1,
        unit: "month",
      }),
    },
  ];
}

function mapPet(row: any) {
  return {
    petListId: row.pet_list_id,
    petId: row.pet_id,
    nickname: row.pet_list_name,
    age: row.pet_list_age === null ? null : Number(row.pet_list_age),
    speciesName:
      row.pet_vernacular_name || row.pet_scientific_name || "Unknown species",
    scientificName: row.pet_scientific_name,
    imageUrl: row.pet_image_ref,
  };
}

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

async function getUserPetsAndTasks(userId: string) {
  const petRows = await sql`
    select
      pl.pet_list_id,
      pl.user_id,
      pl.pet_list_name,
      pl.pet_list_age,
      pl.pet_id,
      p.pet_vernacular_name,
      p.pet_scientific_name,
      p.pet_image_ref
    from public.pet_list pl
    join public.pet p on p.pet_id = pl.pet_id
    where pl.user_id = ${userId}
  `;

  const taskRows = await sql`
    select
      t.pet_task_id,
      t.pet_list_id,
      t.pet_task_type,
      t.pet_task_done,
      t.pet_task_created_at,
      t.pet_task_last_done,
      t.pet_task_count,
      t.pet_task_interval,
      t.pet_task_interval_unit
    from public.pet_task t
    join public.pet_list pl on pl.pet_list_id = t.pet_list_id
    where pl.user_id = ${userId}
    order by t.pet_task_created_at asc
  `;

  return {
    pets: petRows.map(mapPet),
    tasks: taskRows.map(mapTask),
  };
}

export default async function handler(req: any, res: any) {
  let step = "starting";
  try {
    step = "getting session user";
    const sessionUser = await getSessionUser(req);

    if (!sessionUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "GET") {
      const data = await getUserPetsAndTasks(sessionUser.user_id);
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      step = "validating request body";
      const { petId, nickname, age } = req.body || {};

      if (!petId || !nickname || !String(nickname).trim()) {
        return res.status(400).json({ error: "Missing petId or nickname" });
      }

      const ageValue =
        age === undefined || age === null || age === "" ? null : Number(age);

      if (ageValue !== null && Number.isNaN(ageValue)) {
        return res.status(400).json({ error: "Invalid age" });
      }

      step = "checking pet species";
      const petRows = await sql`
        select pet_id
        from public.pet
        where pet_id = ${String(petId)}
        limit 1
      `;

      if (petRows.length === 0) {
        return res.status(404).json({ error: "Pet species not found" });
      }

      const petListId = randomUUID();

      step = "inserting pet_list";
      await sql`
        insert into public.pet_list (
          pet_list_id,
          user_id,
          pet_list_name,
          pet_list_age,
          pet_id
        )
        values (
          ${petListId},
          ${sessionUser.user_id},
          ${String(nickname).trim()},
          ${ageValue},
          ${String(petId)}
        )
      `;

      step = "reading pet_care_profile";
      // const careRows = await sql`
      //   select
      //     feeding_frequency,
      //     cleaning_frequency,
      //     vet_checkup_frequency
      //   from public.pet_care_profile
      //   where pet_id = ${String(petId)}
      //   limit 1
      // `;

      // const defaultTasks = buildDefaultTasks(careRows[0]);
      let careProfile = null;

      try {
        const careRows = await sql`
          select
            feeding_frequency,
            cleaning_frequency,
            vet_checkup_frequency
          from public.pet_care_profile
          where pet_id = ${String(petId)}
          limit 1
        `;

        careProfile = careRows[0] ?? null;
      } catch (error: any) {
        if (error?.code === "42P01") {
          console.warn(
            "pet_care_profile table does not exist yet. Using fallback task frequencies.",
          );
        } else {
          throw error;
        }
      }

      const defaultTasks = buildDefaultTasks(careProfile);

      for (const task of defaultTasks) {
        step = `inserting pet_task: ${task.type}`;
        await sql`
          insert into public.pet_task (
            pet_task_id,
            pet_list_id,
            pet_task_type,
            pet_task_done,
            pet_task_created_at,
            pet_task_last_done,
            pet_task_count,
            pet_task_interval,
            pet_task_interval_unit
          )
          values (
            ${randomUUID()},
            ${petListId},
            ${task.type},
            false,
            now(),
            null,
            ${task.frequency.count},
            ${task.frequency.interval},
            ${task.frequency.unit}
          )
        `;
      }
      step = "loading updated pets and tasks";
      const data = await getUserPetsAndTasks(sessionUser.user_id);
      return res.status(201).json(data);
    }

    if (req.method === "DELETE") {
      const petListId = String(req.query.petListId || "");

      if (!petListId) {
        return res.status(400).json({ error: "Missing petListId" });
      }

      const ownerRows = await sql`
        select pet_list_id
        from public.pet_list
        where pet_list_id = ${petListId}
          and user_id = ${sessionUser.user_id}
        limit 1
      `;

      if (ownerRows.length === 0) {
        return res.status(404).json({ error: "Pet not found" });
      }

      await sql`
        delete from public.pet_task
        where pet_list_id = ${petListId}
      `;

      await sql`
        delete from public.pet_list
        where pet_list_id = ${petListId}
          and user_id = ${sessionUser.user_id}
      `;

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("[/api/user-pets error]", { step, error });

    return res.status(500).json({
      error: `Failed while ${step}`,
      detail: error?.message,
      code: error?.code,
      constraint: error?.constraint,
    });
  }
}

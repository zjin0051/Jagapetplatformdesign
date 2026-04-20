import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: any, res: any) {
  try {
    const rows = await sql`
      select
        pet_id,
        pet_vernacular_name,
        pet_scientific_name,
        pet_care_level,
        pet_is_native,
        pet_danger,
        pet_invasive_risk,
        pet_image_ref,
        pet_comments
      from public.pet
      where
        pet_care_level ilike '%beginner%'
        and pet_is_native = true
        and pet_image_ref is not null
        and pet_image_ref <> ''
        and pet_invasive_risk ilike '%low%'
        and pet_danger ilike '%low%'
      limit 4
    `;

    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

import { neon } from "@neondatabase/serverless";
import { getCostQuartiles, getPurchaseCostCategory } from "./_lib/petCost";

export default async function handler(req: any, res: any) {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is missing");
    }

    const sql = neon(databaseUrl);

    console.log("[recommendations] step 1: fetching all costs");
    const allCostRows = await sql`
      select pet_cost::float8 as pet_cost
      from public.pet
      where pet_cost is not null
    `;

    const allCosts = allCostRows
      .map((row: any) => Number(row.pet_cost))
      .filter((cost: number) => Number.isFinite(cost));

    const { q1, q3 } = getCostQuartiles(allCosts);

    console.log("[recommendations] step 2: fetching recommended pets");
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
        pet_comments,
        pet_cost::float8 as pet_cost
      from public.pet
      where
        pet_care_level ilike '%Beginner%'
        and pet_is_native ilike 'Native%'
        and pet_image_ref is not null
      limit 4
    `;

    console.log("[recommendations] raw rows:", rows);

    const enrichedRows = rows.map((row: any) => {
      const petCost = row.pet_cost == null ? null : Number(row.pet_cost);

      return {
        pet_id: String(row.pet_id),
        pet_vernacular_name: row.pet_vernacular_name ?? null,
        pet_scientific_name: row.pet_scientific_name ?? null,
        pet_care_level: row.pet_care_level ?? null,
        pet_is_native: row.pet_is_native ?? null,
        pet_danger: row.pet_danger ?? null,
        pet_invasive_risk: row.pet_invasive_risk ?? null,
        pet_image_ref:
          typeof row.pet_image_ref === "string" ? row.pet_image_ref : null,
        pet_comments: row.pet_comments ?? null,
        pet_cost: petCost,
        pet_purchase_cost_category: getPurchaseCostCategory(petCost, q1, q3),
      };
    });

    console.log("[recommendations] success:", enrichedRows);

    return res.status(200).json(enrichedRows);
  } catch (error) {
    console.error("[recommendations] error:", error);
    console.error(
      "[recommendations] stack:",
      error instanceof Error ? error.stack : String(error),
    );

    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

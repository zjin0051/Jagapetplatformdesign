import { neon } from "@neondatabase/serverless";
import {
  buildLifetimeBudgetThresholds,
  enrichPetsWithLifetimeBudget,
} from "./_lib/petBudget.js";

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: any, res: any) {
  try {
    const allBudgetRows = await sql`
      select
        pet_cost::float8 as pet_cost,
        pet_longevity::float8 as pet_longevity,
        pet_care_level,
        pet_max_length::float8 as pet_max_length
      from public.pet
    `;

    const normalizedBudgetRows = allBudgetRows.map((row: any) => ({
      pet_cost: row.pet_cost == null ? null : Number(row.pet_cost),
      pet_longevity:
        row.pet_longevity == null ? null : Number(row.pet_longevity),
      pet_care_level: row.pet_care_level ?? null,
      pet_max_length:
        row.pet_max_length == null ? null : Number(row.pet_max_length),
    }));

    const thresholds = buildLifetimeBudgetThresholds(normalizedBudgetRows);

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
        pet_cost::float8 as pet_cost,
        pet_longevity::float8 as pet_longevity,
        pet_max_length::float8 as pet_max_length
      from public.pet
      where
        pet_care_level ilike '%Beginner%'
        and pet_is_native ilike 'Native%'
        and pet_image_ref is not null
      order by pet_id
    `;

    const normalizedRows = rows.map((row: any) => ({
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
      pet_cost: row.pet_cost == null ? null : Number(row.pet_cost),
      pet_longevity:
        row.pet_longevity == null ? null : Number(row.pet_longevity),
      pet_max_length:
        row.pet_max_length == null ? null : Number(row.pet_max_length),
    }));

    const enrichedRows = enrichPetsWithLifetimeBudget(
      normalizedRows,
      thresholds,
    ).map(({ pet_lifetime_budget_score, ...pet }) => pet);

    return res.status(200).json(enrichedRows);
  } catch (error) {
    console.error("recommendations error:", error);

    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
} 
import { sql } from "./_lib/auth.js";

function formatNumber(value: any, unit: string) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return `${num} ${unit}`;
}

function asText(value: any): string | null {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value.map(asText).filter(Boolean).join(". ");
  }

  if (typeof value === "object") {
    return Object.values(value).map(asText).filter(Boolean).join(". ");
  }

  return String(value);
}

function asStringArray(value: any): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map(asText).filter(Boolean) as string[];
  }

  if (typeof value === "object") {
    return Object.values(value).map(asText).filter(Boolean) as string[];
  }

  return [String(value)];
}

function asIllnessArray(value: any) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((item, index) => {
      if (typeof item === "string") {
        return {
          name: item,
          symptoms: "",
          treatment: "",
        };
      }

      return {
        name: item.name || item.illness || item.title || `Illness ${index + 1}`,
        symptoms: asText(item.symptoms) || "",
        treatment: asText(item.treatment) || "",
      };
    });
  }

  if (typeof value === "object") {
    return Object.entries(value).map(([name, details]: any) => ({
      name,
      symptoms: asText(details?.symptoms) || "",
      treatment: asText(details?.treatment) || "",
    }));
  }

  return [];
}

function formatFeedingFrequency(value: any) {
  const freq = Number(value);

  if (!Number.isFinite(freq) || freq <= 0) return null;
  if (freq === 1) return "Daily";
  if (freq === 2) return "Twice daily";

  return `${freq} times per day`;
}

function formatWaterChangeFrequency(value: any) {
  const freq = Number(value);

  if (!Number.isFinite(freq) || freq <= 0) return null;
  if (freq === 1) return "Weekly";
  if (freq === 2) return "Twice weekly";

  return `${freq} times per week`;
}

function formatDiet(value: any) {
  if (!value) return null;

  const parts = [
    value.main_type ? `Main diet: ${value.main_type}` : null,
    value.remarks || null,
  ].filter(Boolean);

  return parts.join(". ");
}

function mapCareGuide(row: any) {
  return {
    petId: row.pet_id,
    name: row.pet_vernacular_name || row.pet_scientific_name || "Unknown Pet",
    scientificName: row.pet_scientific_name,
    vernacularName: row.pet_vernacular_name,

    maxLength: formatNumber(row.pet_max_length, "cm"),
    maxWeight: formatNumber(row.pet_max_weight, "kg"),
    longevity: formatNumber(row.pet_longevity, "years"),
    careLevel: row.pet_care_level,

    temperature: row.pet_temperature,
    baskingTemp: row.pet_care_basking_temp,
    phRange: row.pet_ph_range,
    waterHardness: row.pet_water_hardness,
    waterDepth: row.pet_care_water_depth,
    tankSize: row.pet_tank_size,

    feedingFreq: formatFeedingFrequency(row.pet_care_feeding_freq),
    waterChangeFreq: formatWaterChangeFrequency(row.pet_care_water_chg_freq),
    dietDetails: formatDiet(row.pet_diet),

    tankRequirements: asText(row.pet_care_tank_requirements),
    tankMates: row.pet_care_tank_mates,

    healthSigns: asStringArray(row.pet_care_health_signs),
    sicknessSigns: asStringArray(row.pet_care_sickness_signs),
    commonIllness: asIllnessArray(row.pet_care_common_illness),
  };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const petId = String(req.query.petId || "");

    if (!petId) {
      return res.status(400).json({ error: "Missing petId" });
    }

    const rows = await sql`
      select
        p.pet_id,
        p.pet_scientific_name,
        p.pet_vernacular_name,
        p.pet_genus,
        p.pet_max_length,
        p.pet_max_weight,
        p.pet_longevity,
        p.pet_temperature,
        p.pet_ph_range,
        p.pet_water_hardness,
        p.pet_tank_size,
        p.pet_diet,
        p.pet_care_level,

        pc.pet_care_water_depth,
        pc.pet_care_basking_temp,
        pc.pet_care_cool_temp,
        pc.pet_care_water_chg_freq,
        pc.pet_care_feeding_freq,
        pc.pet_care_tank_mates,
        pc.pet_care_tank_requirements,
        pc.pet_care_health_signs,
        pc.pet_care_sickness_signs,
        pc.pet_care_common_illness
      from public.pet p
      left join public.pet_care pc
        on pc.pet_genus = p.pet_genus
      where p.pet_id = ${petId}
      limit 1
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: "Pet not found" });
    }

    return res.status(200).json(mapCareGuide(rows[0]));
  } catch (error: any) {
    console.error("[/api/care-guide error]", error);

    return res.status(500).json({
      error: "Failed to load care guide",
      detail: error?.message,
      code: error?.code,
    });
  }
}
import type {
  Pet,
  PetBodyShape,
  PetTraits,
  RecommendedPet,
} from "../types/pet.types";

export function getPetDisplayName(pet: Pet | RecommendedPet) {
  return (
    pet.pet_vernacular_name ??
    pet.pet_scientific_name ??
    ""
  ).toLowerCase();
}

export function getPetCommonNames(pet: Pet | RecommendedPet) {
  const vernacularNames = (pet.pet_vernacular_name ?? "")
    .split(/[;,]/)
    .map((name) => name.trim())
    .filter(Boolean);

  return {
    primaryCommonName:
      vernacularNames[0] ?? pet.pet_scientific_name ?? "Unknown Pet",
    otherCommonNames: vernacularNames.slice(1),
  };
}

export function formatPetBodyShape(bodyShape: PetBodyShape): string {
  if (!bodyShape) return "-";

  if ("fish" in bodyShape) {
    return bodyShape.fish.body_shape ?? "-";
  }

  if ("turtle" in bodyShape) {
    const { shell_type, no_of_toes_fore, no_of_toes_hind } = bodyShape.turtle;

    return (
      [
        shell_type ? `Shell type: ${shell_type}` : null,
        no_of_toes_fore != null ? `Fore toes: ${no_of_toes_fore}` : null,
        no_of_toes_hind != null ? `Hind toes: ${no_of_toes_hind}` : null,
      ]
        .filter(Boolean)
        .join(", ") || "-"
    );
  }

  return "-";
}

export function formatPetTraits(traits: PetTraits): string {
  if (!traits) return "-";

  if ("fish" in traits) {
    return "-";
  }

  if ("turtle" in traits) {
    const { carapace_colour, dorsal_colour, dorsal_pattern, underside_colour } =
      traits.turtle;

    return (
      [
        carapace_colour ? `Carapace Colour: ${carapace_colour}` : null,
        dorsal_colour ? `Dorsal Colour: ${dorsal_colour}` : null,
        dorsal_pattern ? `Dorsal Pattern: ${dorsal_pattern}` : null,
        underside_colour ? `Underside Colour: ${underside_colour}` : null,
      ]
        .filter(Boolean)
        .join(", ") || "-"
    );
  }

  return "-";
}

export function displayText(
  value: string | null | undefined,
  fallback = "Unknown",
) {
  if (value == null || value.trim() === "") return fallback;
  return value;
}

export function displayNumber(
  value: number | null | undefined,
  suffix = "",
  fallback = "Unknown",
) {
  if (value == null || Number.isNaN(value)) return fallback;
  return `${value}${suffix}`;
}

export function formatCurrencyMYR(value: number) {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function splitTraits(value: string | null | undefined) {
  if (!value) return [];

  return value
    .split(/[,;/|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isInvasiveSpecies(value: string | null | undefined) {
  return (value ?? "").toLowerCase() === "invasive";
}

export function normalizeDangerBadge(value: string | null | undefined) {
  const text = (value ?? "").toLowerCase();

  if (
    text.includes("high") ||
    text.includes("dangerous") ||
    text.includes("venom") ||
    text.includes("poison") ||
    text.includes("aggressive") ||
    text.includes("strongly") ||
    text.includes("aggressive") ||
    text.includes("venomous") ||
    text.includes("poisonous") ||
    text.includes("strongly")
  ) {
    return "High";
  }

  if (
    text.includes("medium") ||
    text.includes("moderate") ||
    text.includes("caution")
  ) {
    return "Medium";
  }

  if (
    text.includes("harmless") ||
    text.includes("weakly") ||
    text.includes("electrosensing") ||
    text.includes("special")
  ) {
    return "Low";
  }

  return "Unknown";
}

export function getCostBadgeClasses(cost: string) {
  switch (cost) {
    case "High":
      return "inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700";
    case "Low":
      return "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700";
    case "Medium":
      return "inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700";
    default:
      return "inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700";
  }
}

export function getDangerBadgeClasses(danger: string) {
  switch (danger) {
    case "High":
      return "inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700";
    case "Low":
      return "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700";
    case "Medium":
      return "inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700";
    default:
      return "inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700";
  }
}

export function getSpeciesDangerBadgeClasses(danger: string) {
  switch (danger) {
    case "High":
      return "inline-flex items-center gap-1 rounded-full bg-red-100 px-4 py-1.5 text-sm font-semibold text-red-700";
    case "Low":
      return "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700";
    case "Medium":
      return "inline-flex items-center gap-1 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700";
    default:
      return "inline-flex items-center gap-1 rounded-full bg-stone-100 px-4 py-1.5 text-sm font-semibold text-stone-700";
  }
}

export function getCareBadgeClasses(careLevel: string) {
  switch (careLevel) {
    case "Advanced":
      return "inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700";
    case "Beginner":
      return "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700";
    default:
      return "inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700";
  }
}

export function getSpeciesCareBadgeClasses(careLevel: string) {
  switch (careLevel) {
    case "Advanced":
      return "inline-flex items-center gap-1 rounded-full bg-red-100 px-4 py-1.5 text-sm font-semibold text-red-700";
    case "Beginner":
      return "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700";
    case "Intermediate":
      return "inline-flex items-center gap-1 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700";
    default:
      return "inline-flex items-center gap-1 rounded-full bg-stone-100 px-4 py-1.5 text-sm font-semibold text-stone-700";
  }
}

export function getNativeBadgeClasses(nativeStatus: string | null) {
  switch (nativeStatus) {
    case "Invasive":
      return "inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700";
    case "Native":
      return "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700";
    default:
      return "inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700";
  }
}

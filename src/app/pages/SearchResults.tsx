import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";
import {
  Search,
  Fish,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  HandHeart,
  ShieldAlert,
  Skull,
  ScanEye,
} from "lucide-react";
import { motion } from "motion/react";

type PetSearchResult = {
  pet_id: string;
  pet_scientific_name: string | null;
  pet_vernacular_name: string | null;
  pet_genus: string | null;
  pet_family: string | null;
  pet_body_shape: string | null;
  pet_traits: string | null;
  pet_max_length: number | null;
  pet_max_weight: number | null;
  pet_longevity: number | null;
  pet_habitat: string | null;
  pet_temperature: string | null;
  pet_ph_range: string | null;
  pet_water_hardness: string | null;
  pet_tank_size: string | null;
  pet_cost: number | null;
  pet_migration_type: string | null;
  pet_danger: string | null;
  pet_is_native: string | null;
  pet_comments: string | null;
  pet_aquarium: boolean | null;
  pet_image_ref: string | null;
  pet_banned: boolean | null;
  pet_invasive_risk: string | null;
  pet_care_level: string | null;
};

type SortOption =
  | "aquarium"
  | "alphabet_asc"
  | "alphabet_desc"
  | "invasive_risk_desc"
  | "invasive_risk_asc"
  | "care_level_desc"
  | "care_level_asc"
  | "native_status_desc"
  | "native_status_asc"
  | "cost_desc"
  | "cost_asc";

function getInvasiveRiskRank(value: string | null | undefined) {
  switch ((value ?? "").toLowerCase()) {
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return -1; // missing/unknown goes last
  }
}

function getCareLevelRank(value: string | null | undefined) {
  switch ((value ?? "").toLowerCase()) {
    case "advanced":
      return 3;
    case "intermediate":
      return 2;
    case "beginner":
      return 1;
    default:
      return -1;
  }
}

function getNativeStatusRank(value: string | null | undefined) {
  switch ((value ?? "").toLowerCase()) {
    case "invasive":
      return 3;
    case "not native":
      return 2;
    case "native":
      return 1;
    default:
      return -1;
  }
}

function getPetDisplayName(pet: PetSearchResult) {
  return (
    pet.pet_vernacular_name ??
    pet.pet_scientific_name ??
    ""
  ).toLowerCase();
}

function compareWithMissingLast(
  aValue: number,
  bValue: number,
  direction: "asc" | "desc",
) {
  const aMissing = aValue < 0;
  const bMissing = bValue < 0;

  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;

  return direction === "asc" ? aValue - bValue : bValue - aValue;
}

function displayText(value: string | null | undefined, fallback = "Unknown") {
  if (value == null || value.trim() === "") return fallback;
  return value;
}

function normalizeDangerBadge(value: string | null | undefined) {
  const text = (value ?? "").toLowerCase();

  if (
    text.includes("aggressive") ||
    text.includes("venomous") ||
    text.includes("poisonous") ||
    text.includes("strongly")
  ) {
    return "High";
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

function getDangerBadgeClasses(danger: string) {
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

function getCareBadgeClasses(careLevel: string) {
  switch (careLevel) {
    case "Advanced":
      return "inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700";
    case "Beginner":
      return "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700";
    default:
      return "inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700";
  }
}

function getNativeBadgeClasses(nativeStatus: string | null) {
  switch (nativeStatus) {
    case "Invasive":
      return "inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700";
    case "Native":
      return "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700";
    default:
      return "inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700";
  }
}

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<PetSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("aquarium");

  useEffect(() => {
    async function runSearch() {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Search failed");
        }

        setResults(data ?? []);
      } catch (err: any) {
        setError(err.message || "Search failed");
        setResults([]);
      }

      setLoading(false);
    }

    runSearch();
  }, [query]);

  const sortedResults = useMemo(() => {
    const items = [...results];

    items.sort((a, b) => {
      switch (sortBy) {
        case "aquarium": {
          const aRank = a.pet_aquarium === true ? 1 : 0;
          const bRank = b.pet_aquarium === true ? 1 : 0;

          if (aRank !== bRank) return bRank - aRank;
          return getPetDisplayName(a).localeCompare(getPetDisplayName(b));
        }

        case "alphabet_asc":
          return getPetDisplayName(a).localeCompare(getPetDisplayName(b));

        case "alphabet_desc":
          return getPetDisplayName(b).localeCompare(getPetDisplayName(a));

        case "invasive_risk_desc": {
          const result = compareWithMissingLast(
            getInvasiveRiskRank(a.pet_invasive_risk),
            getInvasiveRiskRank(b.pet_invasive_risk),
            "desc",
          );
          if (result !== 0) return result;
          return getPetDisplayName(a).localeCompare(getPetDisplayName(b));
        }

        case "invasive_risk_asc": {
          const result = compareWithMissingLast(
            getInvasiveRiskRank(a.pet_invasive_risk),
            getInvasiveRiskRank(b.pet_invasive_risk),
            "asc",
          );
          if (result !== 0) return result;
          return getPetDisplayName(a).localeCompare(getPetDisplayName(b));
        }

        case "care_level_desc": {
          const result = compareWithMissingLast(
            getCareLevelRank(a.pet_care_level),
            getCareLevelRank(b.pet_care_level),
            "desc",
          );
          if (result !== 0) return result;
          return getPetDisplayName(a).localeCompare(getPetDisplayName(b));
        }

        case "care_level_asc": {
          const result = compareWithMissingLast(
            getCareLevelRank(a.pet_care_level),
            getCareLevelRank(b.pet_care_level),
            "asc",
          );
          if (result !== 0) return result;
          return getPetDisplayName(a).localeCompare(getPetDisplayName(b));
        }

        case "native_status_desc": {
          const result = compareWithMissingLast(
            getNativeStatusRank(a.pet_is_native),
            getNativeStatusRank(b.pet_is_native),
            "desc",
          );
          if (result !== 0) return result;
          return getPetDisplayName(a).localeCompare(getPetDisplayName(b));
        }

        case "native_status_asc": {
          const result = compareWithMissingLast(
            getNativeStatusRank(a.pet_is_native),
            getNativeStatusRank(b.pet_is_native),
            "asc",
          );
          if (result !== 0) return result;
          return getPetDisplayName(a).localeCompare(getPetDisplayName(b));
        }

        case "cost_desc": {
          const aCost = a.pet_cost ?? -1;
          const bCost = b.pet_cost ?? -1;
          const result = compareWithMissingLast(aCost, bCost, "desc");
          if (result !== 0) return result;
          return getPetDisplayName(a).localeCompare(getPetDisplayName(b));
        }

        case "cost_asc": {
          const aCost = a.pet_cost ?? -1;
          const bCost = b.pet_cost ?? -1;
          const result = compareWithMissingLast(aCost, bCost, "asc");
          if (result !== 0) return result;
          return getPetDisplayName(a).localeCompare(getPetDisplayName(b));
        }

        default:
          return 0;
      }
    });

    return items;
  }, [results, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-stone-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/")}
          className="group mb-6 flex items-center gap-2 text-stone-600 transition hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          Back
        </button>

        <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-8 text-white shadow-xl">
          <div className="mb-3 flex items-center gap-3">
            <Search className="h-7 w-7" />
            <h1 className="text-3xl font-black tracking-tight">
              Search Results
            </h1>
          </div>
          <p className="text-emerald-50">
            Searching for: <span className="font-semibold">"{query}"</span>
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <p className="text-stone-600">Searching pets...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <h2 className="text-xl font-bold">Search error</h2>
            </div>
            <p className="text-red-800">{error}</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="mb-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
              <div className="mb-2 flex items-center gap-2 text-emerald-700">
                <Sparkles className="h-5 w-5" />
                <h2 className="text-xl font-bold">Matching pets</h2>
              </div>
              <p className="text-stone-700">
                We found {results.length} matching result
                {results.length === 1 ? "" : "s"} for your search.
              </p>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <label
                htmlFor="sort"
                className="text-sm font-semibold text-stone-700"
              >
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm outline-none transition focus:border-emerald-500"
              >
                <option value="aquarium">Most Common</option>
                <option value="alphabet_asc">Alphabet: A to Z</option>
                <option value="alphabet_desc">Alphabet: Z to A</option>
                <option value="invasive_risk_desc">
                  Invasive risk: High to Low
                </option>
                <option value="invasive_risk_asc">
                  Invasive risk: Low to High
                </option>
                <option value="care_level_desc">
                  Care level: Advanced to Beginner
                </option>
                <option value="care_level_asc">
                  Care level: Beginner to Advanced
                </option>
                <option value="native_status_desc">
                  Native status: Invasive to Native
                </option>
                <option value="native_status_asc">
                  Native status: Native to Invasive
                </option>
                <option value="cost_desc">Cost: High to Low</option>
                <option value="cost_asc">Cost: Low to High</option>
              </select>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {sortedResults.map((pet, index) => {
                const danger = normalizeDangerBadge(pet.pet_danger);
                const vernacularNames = (pet.pet_vernacular_name ?? "")
                  .split(";")
                  .map((name) => name.trim())
                  .filter(Boolean);

                const primaryCommonName =
                  vernacularNames[0] ??
                  pet.pet_scientific_name ??
                  "Unknown Pet";

                const otherCommonNames = vernacularNames.slice(1);

                return (
                  <motion.div
                    key={pet.pet_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={`/species/${pet.pet_id}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-stone-100 transition-all flex flex-col group cursor-pointer h-full"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={
                            pet.pet_image_ref
                              ? `/pet_image/${pet.pet_image_ref}`
                              : "/pet_image/pet_placeholder.png"
                          }
                          alt={
                            pet.pet_vernacular_name ?? "Pet Image Placeholder"
                          }
                          className="w-full h-full object-cover group-hover:scale1-105 transition duration-500"
                        />
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          {pet.pet_invasive_risk && (
                            <span
                              className={getDangerBadgeClasses(
                                pet.pet_invasive_risk,
                              )}
                            >
                              <ShieldAlert className="w-3 h-3" />
                              {pet.pet_invasive_risk} Risk
                            </span>
                          )}
                          {pet.pet_care_level && (
                            <span
                              className={getCareBadgeClasses(
                                pet.pet_care_level,
                              )}
                            >
                              <HandHeart className="w-3 h-3" />
                              {pet.pet_care_level}
                            </span>
                          )}
                          {pet.pet_is_native && (
                            <span
                              className={getNativeBadgeClasses(
                                pet.pet_is_native,
                              )}
                            >
                              <Fish className="w-3 h-3" />
                              {pet.pet_is_native}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-stone-900 mb-1 group-hover:text-emerald-700 transition">
                          {primaryCommonName}
                        </h3>
                        <p className="text-sm text-stone-500 italic mb-2 font-serif">
                          {pet.pet_scientific_name}
                        </p>
                        {otherCommonNames.length > 0 && (
                          <p className="text-sm text-stone-500 mb-3">
                            <span className="font-semibold">A.K.A:</span>{" "}
                            {otherCommonNames.join(", ")}
                          </p>
                        )}
                        <div className="mb-4 flex flex-wrap gap-2">
                          <span className={getDangerBadgeClasses(danger)}>
                            <Skull className="w-3 h-3" />
                            {danger} Danger
                          </span>
                          {pet.pet_aquarium && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                              <ScanEye className="w-3 h-3" />
                              Common
                            </span>
                          )}
                        </div>
                        <p className="text-stone-600 text-sm mb-6 flex-1 line-clamp-3">
                          {displayText(
                            pet.pet_comments,
                            "No description is available for this pet yet.",
                          )}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-emerald-700 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                            View Profile & Care Guide →
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
              <AlertCircle className="h-7 w-7 text-stone-500" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900">No pets found</h2>
            <p className="mx-auto mt-3 max-w-2xl text-stone-600">
              We could not find any pets matching "{query}". Try a scientific
              name, vernacular name, genus, or family.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Browse Home
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="rounded-full border-2 border-stone-300 px-6 py-3 font-semibold text-stone-700 transition hover:border-emerald-600 hover:text-emerald-700"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

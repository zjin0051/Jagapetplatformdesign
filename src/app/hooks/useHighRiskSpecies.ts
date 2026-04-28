import { useQuery } from "@tanstack/react-query";
import type { RecommendedPet } from "../types/pet.types";

type HighRiskSpeciesResponse = RecommendedPet[];

async function fetchHighRiskSpecies(): Promise<HighRiskSpeciesResponse> {
  const response = await fetch("/api/high-risk-species");
  const raw = await response.text();

  let data: unknown;

  try {
    data = raw ? JSON.parse(raw) : [];
  } catch {
    console.error("Non-JSON response from /api/high-risk-species:", raw);
    throw new Error(
      `API returned ${response.status} but not JSON. Open /api/high-risk-species directly in the browser and check your terminal.`,
    );
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error?: unknown }).error === "string"
        ? (data as { error: string }).error
        : "Failed to load high risk species";

    throw new Error(message);
  }

  return Array.isArray(data) ? (data as HighRiskSpeciesResponse) : [];
}

export function useHighRiskSpecies() {
  const query = useQuery({
    queryKey: ["high-risk-species"],
    queryFn: fetchHighRiskSpecies,
    staleTime: 1000 * 60 * 30,
  });

  return {
    highRiskSpecies: query.data ?? [],
    loading: query.isPending,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
import { useQuery } from "@tanstack/react-query";
import type { RecommendedPet } from "../types/pet.types";

type RecommendationsResponse = RecommendedPet[];

async function fetchPetRecommendations(): Promise<RecommendationsResponse> {
  const response = await fetch("/api/recommendations");
  const raw = await response.text();

  let data: unknown;

  try {
    data = raw ? JSON.parse(raw) : [];
  } catch {
    console.error("Non-JSON response from /api/recommendations:", raw);
    throw new Error(
      `API returned ${response.status} but not JSON. Open /api/recommendations directly in the browser and check your terminal.`,
    );
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error?: unknown }).error === "string"
        ? (data as { error: string }).error
        : "Failed to load recommendations";

    throw new Error(message);
  }

  return Array.isArray(data) ? (data as RecommendationsResponse) : [];
}

export function usePetRecommendations() {
  const query = useQuery({
    queryKey: ["pet-recommendations"],
    queryFn: fetchPetRecommendations,
    staleTime: 1000 * 60 * 30,
  });

  return {
    recommendations: query.data ?? [],
    loading: query.isPending,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
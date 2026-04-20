import { useQuery } from "@tanstack/react-query";
import type { RecommendedPet } from "../types/pet.types";

type RecommendationsResponse = RecommendedPet[];

async function fetchPetRecommendations(): Promise<RecommendationsResponse> {
  const response = await fetch("/api/recommendations");
  const data = await response.json();

  console.log("recommendations api data:", data);

  if (!response.ok) {
    throw new Error(data.error || "Failed to load recommendations");
  }

  return data ?? [];
}

export function usePetRecommendations() {
  const query = useQuery({
    queryKey: ["pet-recommendations"],
    queryFn: fetchPetRecommendations,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    recommendations: query.data ?? [],
    loading: query.isPending,
    error: query.error instanceof Error ? query.error.message : null,
  };
}

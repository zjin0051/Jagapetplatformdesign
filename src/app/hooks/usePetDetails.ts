import { useQuery } from "@tanstack/react-query";
import type { Pet } from "../types/pet.types";

type UsePetDetailResult = {
  pet: Pet | null;
  relatedPets: Pet[];
  loading: boolean;
  error: string | null;
};

type PetDetailResponse = {
  pet: Pet;
  relatedPets?: Pet[];
};

async function fetchPetDetail(id: string): Promise<PetDetailResponse> {
  const response = await fetch(`/api/pet?id=${encodeURIComponent(id)}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load pet");
  }

  return {
    pet: data.pet ?? data,
    relatedPets: data.relatedPets ?? [],
  };
}

export function usePetDetail(id: string | undefined): UsePetDetailResult {
  const query = useQuery({
    queryKey: ["pet-detail", id],
    queryFn: () => fetchPetDetail(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });

  return {
    pet: query.data?.pet ?? null,
    relatedPets: query.data?.relatedPets ?? [],
    loading: !!id && query.isPending,
    error: !id
      ? "Missing pet id."
      : query.error instanceof Error
        ? query.error.message
        : null,
  };
}

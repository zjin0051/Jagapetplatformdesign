import { useQuery } from "@tanstack/react-query";
import type { Pet } from "../types/pet.types";

type UsePetSearchResult = {
  results: Pet[];
  loading: boolean;
  error: string | null;
};

async function fetchPetSearch(query: string): Promise<Pet[]> {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Search failed");
  }

  return data ?? [];
}

export function usePetSearch(query: string): UsePetSearchResult {
  const trimmedQuery = query.trim();

  const searchQuery = useQuery({
    queryKey: ["pet-search", trimmedQuery],
    queryFn: () => fetchPetSearch(trimmedQuery),
    enabled: !!trimmedQuery,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    results: trimmedQuery ? searchQuery.data ?? [] : [],
    loading: !!trimmedQuery && searchQuery.isPending,
    error:
      trimmedQuery && searchQuery.error instanceof Error
        ? searchQuery.error.message
        : null,
  };
}
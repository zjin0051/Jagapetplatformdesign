import { useMemo } from "react";
import type { Pet, SortOption } from "../types/pet.types";
import { sortPets } from "../utils/petSort";

export function useSortedPets(results: Pet[], sortBy: SortOption) {
  return useMemo(() => sortPets(results, sortBy), [results, sortBy]);
}

import { useEffect, useState } from "react";
import type { Pet } from "../types/pet.types";

type UsePetSearchResult = {
  results: Pet[];
  loading: boolean;
  error: string | null;
};

export function usePetSearch(query: string): UsePetSearchResult {
  const [results, setResults] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function runSearch() {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        setResults([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Search failed");
        }

        if (!cancelled) {
          setResults(data ?? []);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Search failed");
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [query]);

  return { results, loading, error };
}

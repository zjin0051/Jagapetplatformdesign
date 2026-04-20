import { useEffect, useState } from "react";
import type { Pet } from "../types/pet.types";

type UsePetRecommendationsResult = {
  recommendations: Pet[];
  loading: boolean;
  error: string | null;
};

export function usePetRecommendations(): UsePetRecommendationsResult {
  const [recommendations, setRecommendations] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRecommendations() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/recommendations");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load recommendations");
        }

        if (!cancelled) {
          setRecommendations(data ?? []);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Failed to load recommendations");
          setRecommendations([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, []);

  return { recommendations, loading, error };
}
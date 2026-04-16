import { useEffect, useState } from "react";
import type { Pet } from "../types/pet.types";

type UsePetDetailResult = {
  pet: Pet | null;
  relatedPets: Pet[];
  loading: boolean;
  error: string | null;
};

export function usePetDetail(id: string | undefined): UsePetDetailResult {
  const [pet, setPet] = useState<Pet | null>(null);
  const [relatedPets, setRelatedPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPet() {
      if (!id) {
        setError("Missing pet id.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/pet?id=${encodeURIComponent(id)}`);
        const data = await response.json();

        if (!response.ok) {
          setPet(null);
          setRelatedPets([]);
          setError(data.error || "Failed to load pet");
          return;
        }

        setPet(data.pet ?? data);
        setRelatedPets(data.relatedPets ?? []);
      } catch {
        setPet(null);
        setRelatedPets([]);
        setError("Failed to load pet");
      } finally {
        setLoading(false);
      }
    }

    fetchPet();
  }, [id]);

  return { pet, relatedPets, loading, error };
}

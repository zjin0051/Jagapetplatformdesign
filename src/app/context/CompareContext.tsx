import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Pet } from "../types/pet.types";

type CompareContextType = {
  comparePets: Pet[];
  toggleCompare: (pet: Pet) => void;
  removeCompare: (petId: string) => void;
  clearCompare: () => void;
  isInCompare: (petId: string) => boolean;
  isCompareFull: boolean;
};

const CompareContext = createContext<CompareContextType | null>(null);

const STORAGE_KEY = "comparePets";
const MAX_COMPARE_ITEMS = 4;

export function CompareProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [comparePets, setComparePets] = useState<Pet[]>(() => {
    if (typeof window === "undefined") return [];

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      return JSON.parse(raw) as Pet[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(comparePets));
  }, [comparePets]);

  const toggleCompare = (pet: Pet) => {
    setComparePets((current) => {
      const exists = current.some((item) => item.pet_id === pet.pet_id);

      if (exists) {
        return current.filter((item) => item.pet_id !== pet.pet_id);
      }

      if (current.length >= MAX_COMPARE_ITEMS) {
        return current;
      }

      return [...current, pet];
    });
  };

  const removeCompare = (petId: string) => {
    setComparePets((current) =>
      current.filter((item) => item.pet_id !== petId),
    );
  };

  const clearCompare = () => {
    setComparePets([]);
  };

  const isInCompare = (petId: string) => {
    return comparePets.some((item) => item.pet_id === petId);
  };

  const value = useMemo(
    () => ({
      comparePets,
      toggleCompare,
      removeCompare,
      clearCompare,
      isInCompare,
      isCompareFull: comparePets.length >= MAX_COMPARE_ITEMS,
    }),
    [comparePets],
  );

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);

  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }

  return context;
}
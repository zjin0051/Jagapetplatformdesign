import { getPurchaseCostCategory } from "./petCost";

type PetLike = {
  pet_cost?: number | null;
  [key: string]: unknown;
};

export function enrichPetWithCostCategory<T extends PetLike>(
  pet: T,
  q1: number,
  q3: number,
) {
  return {
    ...pet,
    pet_purchase_cost_category: getPurchaseCostCategory(pet.pet_cost, q1, q3),
  };
}

export function enrichPetsWithCostCategory<T extends PetLike>(
  pets: T[],
  q1: number,
  q3: number,
) {
  return pets.map((pet) => enrichPetWithCostCategory(pet, q1, q3));
}

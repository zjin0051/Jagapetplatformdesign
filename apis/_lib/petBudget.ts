export type LifetimeBudgetCategory = "Low" | "Medium" | "High" | "Unknown";

type BudgetPetLike = {
  pet_cost?: number | null;
  pet_longevity?: number | null;
  pet_care_level?: string | null;
  pet_max_length?: number | null;
};

type Quartiles = {
  q1: number;
  q3: number;
};

export type LifetimeBudgetThresholds = {
  cost: Quartiles;
  longevity: Quartiles;
  maxLength: Quartiles;
  totalScore: Quartiles;
};

function getPercentile(sortedValues: number[], percentile: number): number {
  if (sortedValues.length === 0) return NaN;

  const index = (sortedValues.length - 1) * percentile;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) return sortedValues[lower];

  const weight = index - lower;
  return (
    sortedValues[lower] + (sortedValues[upper] - sortedValues[lower]) * weight
  );
}

export function getQuartiles(
  values: Array<number | null | undefined>,
): Quartiles {
  const validValues = values
    .filter(
      (value): value is number =>
        typeof value === "number" && Number.isFinite(value),
    )
    .sort((a, b) => a - b);

  if (validValues.length === 0) {
    return { q1: NaN, q3: NaN };
  }

  return {
    q1: getPercentile(validValues, 0.25),
    q3: getPercentile(validValues, 0.75),
  };
}

function getNumericScore(
  value: number | null | undefined,
  q1: number,
  q3: number,
): 1 | 2 | 3 | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  if (!Number.isFinite(q1) || !Number.isFinite(q3)) {
    return null;
  }

  if (value <= q1) return 1;
  if (value <= q3) return 2;
  return 3;
}

export function getCareLevelScore(
  careLevel: string | null | undefined,
): 1 | 2 | 3 | null {
  if (!careLevel) return null;

  const value = careLevel.toLowerCase();

  if (value.includes("beginner")) return 1;
  if (value.includes("intermediate")) return 2;
  if (
    value.includes("advanced") ||
    value.includes("expert") ||
    value.includes("difficult")
  ) {
    return 3;
  }

  return null;
}

export function getLifetimeBudgetScore(
  pet: BudgetPetLike,
  thresholds: Omit<LifetimeBudgetThresholds, "totalScore">,
): number | null {
  const scores = [
    getNumericScore(pet.pet_cost, thresholds.cost.q1, thresholds.cost.q3),
    getNumericScore(
      pet.pet_longevity,
      thresholds.longevity.q1,
      thresholds.longevity.q3,
    ),
    getNumericScore(
      pet.pet_max_length,
      thresholds.maxLength.q1,
      thresholds.maxLength.q3,
    ),
    getCareLevelScore(pet.pet_care_level),
  ].filter((score): score is 1 | 2 | 3 => score !== null);

  // Require at least 2 signals, otherwise too shaky
  if (scores.length < 2) return null;

  return scores.reduce((sum, score) => sum + score, 0);
}

export function getLifetimeBudgetCategory(
  totalScore: number | null | undefined,
  q1: number,
  q3: number,
): LifetimeBudgetCategory {
  if (typeof totalScore !== "number" || !Number.isFinite(totalScore)) {
    return "Unknown";
  }

  if (!Number.isFinite(q1) || !Number.isFinite(q3)) {
    return "Unknown";
  }

  if (totalScore <= q1) return "Low";
  if (totalScore <= q3) return "Medium";
  return "High";
}

export function buildLifetimeBudgetThresholds<T extends BudgetPetLike>(
  pets: T[],
): LifetimeBudgetThresholds {
  const cost = getQuartiles(pets.map((pet) => pet.pet_cost));
  const longevity = getQuartiles(pets.map((pet) => pet.pet_longevity));
  const maxLength = getQuartiles(pets.map((pet) => pet.pet_max_length));

  const totalScores = pets
    .map((pet) =>
      getLifetimeBudgetScore(pet, {
        cost,
        longevity,
        maxLength,
      }),
    )
    .filter((score): score is number => typeof score === "number");

  const totalScore = getQuartiles(totalScores);

  return {
    cost,
    longevity,
    maxLength,
    totalScore,
  };
}

export function enrichPetWithLifetimeBudget<T extends BudgetPetLike>(
  pet: T,
  thresholds: LifetimeBudgetThresholds,
) {
  const totalScore = getLifetimeBudgetScore(pet, thresholds);

  return {
    ...pet,
    pet_lifetime_budget_score: totalScore,
    pet_lifetime_budget_category: getLifetimeBudgetCategory(
      totalScore,
      thresholds.totalScore.q1,
      thresholds.totalScore.q3,
    ),
  };
}

export function enrichPetsWithLifetimeBudget<T extends BudgetPetLike>(
  pets: T[],
  thresholds: LifetimeBudgetThresholds,
) {
  return pets.map((pet) => enrichPetWithLifetimeBudget(pet, thresholds));
}

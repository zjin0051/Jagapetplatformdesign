export type PurchaseCostCategory = "Low" | "Medium" | "High" | "Unknown";

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

export function getCostQuartiles(costs: Array<number | null | undefined>) {
  const validCosts = costs
    .filter(
      (cost): cost is number =>
        typeof cost === "number" && Number.isFinite(cost),
    )
    .sort((a, b) => a - b);

  if (validCosts.length === 0) {
    return { q1: NaN, q3: NaN };
  }

  return {
    q1: getPercentile(validCosts, 0.25),
    q3: getPercentile(validCosts, 0.75),
  };
}

export function getPurchaseCostCategory(
  petCost: number | null | undefined,
  q1: number,
  q3: number,
): PurchaseCostCategory {
  if (typeof petCost !== "number" || !Number.isFinite(petCost)) {
    return "Unknown";
  }

  if (!Number.isFinite(q1) || !Number.isFinite(q3)) {
    return "Unknown";
  }

  if (petCost <= q1) return "Low";
  if (petCost <= q3) return "Medium";
  return "High";
}

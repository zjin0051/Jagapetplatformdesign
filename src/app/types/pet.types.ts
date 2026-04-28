export type PurchaseCostCategory = "Low" | "Medium" | "High" | "Unknown";
export type LifetimeBudgetCategory = "Low" | "Medium" | "High" | "Unknown";

export type FishBodyShape = {
  fish: {
    body_shape: string | null;
  };
};

export type TurtleBodyShape = {
  turtle: {
    shell_type: string | null;
    no_of_toes_fore: number | null;
    no_of_toes_hind: number | null;
  };
};

export type PetBodyShape = FishBodyShape | TurtleBodyShape | null;

export type FishTraits = {
  fish: Record<string, never>; // or {} if fish currently has no extra traits
};

export type TurtleTraits = {
  turtle: {
    carapace_colour: string | null;
    dorsal_colour: string | null;
    dorsal_pattern: string | null;
    underside_colour: string | null;
  };
};

export type PetTraits = FishTraits | TurtleTraits | null;

export type PetDiet = {
  main_type: string | null;
  remarks: string | null;
} | null;

export type Pet = {
  pet_id: string;
  pet_scientific_name: string | null;
  pet_vernacular_name: string | null;
  pet_genus: string | null;
  pet_family: string | null;
  pet_body_shape: PetBodyShape;
  pet_traits: PetTraits;
  pet_max_length: number | null;
  pet_max_weight: number | null;
  pet_longevity: number | null;
  pet_habitat: string | null;
  pet_temperature: string | null;
  pet_ph_range: string | null;
  pet_water_hardness: string | null;
  pet_tank_size: string | null;
  pet_cost: number | null;
  pet_migration_type: string | null;
  pet_danger: string | null;
  pet_is_native: string | null;
  pet_comments: string | null;
  pet_aquarium: boolean | null;
  pet_image_ref: string | null;
  pet_banned: boolean | null;
  pet_invasive_risk: string | null;
  pet_care_level: string | null;
  pet_purchase_cost_category?: PurchaseCostCategory;
  pet_lifetime_budget_category?: LifetimeBudgetCategory;
  pet_diet: PetDiet;
};

export type RecommendedPet = {
  pet_id: string;
  pet_vernacular_name: string | null;
  pet_scientific_name: string | null;
  pet_care_level: string | null;
  pet_is_native: string | null;
  pet_danger: string | null;
  pet_invasive_risk: string | null;
  pet_image_ref: string | null;
  pet_comments: string | null;
  pet_cost: number | null;
  pet_purchase_cost_category?: PurchaseCostCategory;
  pet_lifetime_budget_category?: LifetimeBudgetCategory;
};

export type QuizRecommendationPet = {
  pet_id: string;
  pet_vernacular_name: string | null;
  pet_scientific_name: string | null;
  pet_care_level: string | null;
  pet_is_native: string | null;
  pet_danger: string | null;
  pet_invasive_risk: string | null;
  pet_image_ref: string | null;
  pet_comments: string | null;
  pet_cost: number | null;
  pet_longevity: number | null;
  pet_max_length: number | null;
  pet_tank_size: string | null;
  pet_lifetime_budget_category?: LifetimeBudgetCategory;
};

export type SortOption =
  | "aquarium"
  | "alphabet_asc"
  | "alphabet_desc"
  | "invasive_risk_desc"
  | "invasive_risk_asc"
  | "care_level_desc"
  | "care_level_asc"
  | "native_status_desc"
  | "native_status_asc"
  | "cost_desc"
  | "cost_asc";

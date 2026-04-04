import type { ItemDefinition, ItemInstance } from "./types";

export type NutritionUnit = "meal" | "item" | "day" | (string & {});

type NutritionInput = Pick<ItemDefinition, "traits"> | Pick<ItemInstance, "traits"> | string[] | undefined;

const CALORIE_PREFIX = "nutrition:calories:";
const UNIT_PREFIX = "nutrition:unit:";

function getTraits(input: NutritionInput): string[] {
  if (!input) {
    return [];
  }

  return Array.isArray(input) ? input : (input.traits ?? []);
}

function findTraitValue(traits: string[], prefix: string): string | undefined {
  const trait = traits.find((entry) => entry.startsWith(prefix));
  return trait ? trait.slice(prefix.length) : undefined;
}

export function getNutritionCalories(input: NutritionInput): number | undefined {
  const traits = getTraits(input);
  const raw = findTraitValue(traits, CALORIE_PREFIX);

  if (!raw) {
    return undefined;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}

export function getNutritionUnit(input: NutritionInput): NutritionUnit | undefined {
  const traits = getTraits(input);
  const raw = findTraitValue(traits, UNIT_PREFIX);
  return raw as NutritionUnit | undefined;
}

export function getNutrition(input: NutritionInput): { calories: number; unit?: NutritionUnit } | undefined {
  const calories = getNutritionCalories(input);
  if (calories === undefined) {
    return undefined;
  }

  return {
    calories,
    unit: getNutritionUnit(input),
  };
}

export function getNutritionCaloriesForQuantity(input: NutritionInput, quantity: number): number | undefined {
  const calories = getNutritionCalories(input);
  if (calories === undefined) {
    return undefined;
  }

  return calories * quantity;
}

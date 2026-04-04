import type { ItemDefinition, ItemInstance } from "./types";
export type NutritionUnit = "meal" | "item" | "day" | (string & {});
type NutritionInput = Pick<ItemDefinition, "traits"> | Pick<ItemInstance, "traits"> | string[] | undefined;
export declare function getNutritionCalories(input: NutritionInput): number | undefined;
export declare function getNutritionUnit(input: NutritionInput): NutritionUnit | undefined;
export declare function getNutrition(input: NutritionInput): {
    calories: number;
    unit?: NutritionUnit;
} | undefined;
export declare function getNutritionCaloriesForQuantity(input: NutritionInput, quantity: number): number | undefined;
export {};
//# sourceMappingURL=nutrition.d.ts.map
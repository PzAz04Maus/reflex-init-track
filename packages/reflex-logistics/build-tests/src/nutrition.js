"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNutritionCalories = getNutritionCalories;
exports.getNutritionUnit = getNutritionUnit;
exports.getNutrition = getNutrition;
exports.getNutritionCaloriesForQuantity = getNutritionCaloriesForQuantity;
const CALORIE_PREFIX = "nutrition:calories:";
const UNIT_PREFIX = "nutrition:unit:";
function getTraits(input) {
    if (!input) {
        return [];
    }
    return Array.isArray(input) ? input : (input.traits ?? []);
}
function findTraitValue(traits, prefix) {
    const trait = traits.find((entry) => entry.startsWith(prefix));
    return trait ? trait.slice(prefix.length) : undefined;
}
function getNutritionCalories(input) {
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
function getNutritionUnit(input) {
    const traits = getTraits(input);
    const raw = findTraitValue(traits, UNIT_PREFIX);
    return raw;
}
function getNutrition(input) {
    const calories = getNutritionCalories(input);
    if (calories === undefined) {
        return undefined;
    }
    return {
        calories,
        unit: getNutritionUnit(input),
    };
}
function getNutritionCaloriesForQuantity(input, quantity) {
    const calories = getNutritionCalories(input);
    if (calories === undefined) {
        return undefined;
    }
    return calories * quantity;
}

import { SMALL_ARMS_AMMUNITION_ITEMS } from "./ammunition";
import { ARMOR_CATALOG } from "./armorCatalog";
import { CLOTHING_CATALOG } from "./clothingCatalog";
import { CLOSE_COMBAT_WEAPONS } from "./closeCombatCatalog";
import { ILLUMINATION_ITEMS } from "./electronics-catalog/illumination";
import {
  MAGNIFICATION_ITEMS,
  NIGHT_VISION_ITEMS,
  THERMAL_IMAGING_ITEMS,
} from "./electronics-catalog/vision";
import { POWERED_TOOLS, GENERATORS, STILLS } from "./electronics-catalog/poweredTools";
import { GENERIC_CATALOG } from "./genericCatalog";
import { RANGED_CATALOG } from "./rangedCatalog";
import { SIGNAL_CATALOG } from "./signalCatalog";
import type { ItemDefinition } from "./types";
import { MEDIA_CATALOG } from "./mediaCatalog";
import { PERSONAL_CATALOG } from "./personalCatalog";
import { STORAGE_CATALOG } from "./storageCatalog";
import { CONSUMABLES_CATALOG } from "./consumablesCatalog";
import { MEDICAL_CATALOG } from "./medicalCatalog";
import { ELECTRONICS_CATALOG } from "./electronicsCatalog";
import { AMMUNITION_HANDLING_ITEMS } from "./weapon-attachments-catalog/ammunitionHandling";
import {
  FIRE_CONTROL_MODIFICATIONS,
  MISCELLANEOUS_ACCESSORIES,
  RAIL_ACCESSORIES,
  SHOTGUN_MODIFICATIONS,
} from "./weapon-attachments-catalog/accessories";
import { OPTICS } from "./weapon-attachments-catalog/optics";
import { HAND_TOOLS, ARMAMENT_TOOLS, SPECIALIST_TOOLS } from "./tools-catalog";
import {
  PURIFICATION_ITEMS,
  FOOD_ACQUISITION_ITEMS,
  FIRE_AND_COOKING_ITEMS,
  SANITATION_ITEMS,
  NAVIGATION_ITEMS,
  SHELTER_ITEMS,
  TERRAIN_MOBILITY_ITEMS,
  CAMOUFLAGE_AND_LINES_ITEMS,
} from "./survival-catalog";

export * from "./ammunition";
export * from "./armorCatalog";
export * from "./clothingCatalog";
export * from "./closeCombatCatalog";
export { ILLUMINATION_ITEMS } from "./electronics-catalog/illumination";
export {
  MAGNIFICATION_ITEMS,
  NIGHT_VISION_ITEMS,
  THERMAL_IMAGING_ITEMS,
} from "./electronics-catalog/vision";
export { POWERED_TOOLS, GENERATORS, STILLS } from "./electronics-catalog/poweredTools";
export * from "./genericCatalog";
export * from "./rangedCatalog";
export * from "./signalCatalog";
export { AMMUNITION_HANDLING_ITEMS } from "./weapon-attachments-catalog/ammunitionHandling";
export {
  FIRE_CONTROL_MODIFICATIONS,
  MISCELLANEOUS_ACCESSORIES,
  RAIL_ACCESSORIES,
  SHOTGUN_MODIFICATIONS,
} from "./weapon-attachments-catalog/accessories";
export { OPTICS } from "./weapon-attachments-catalog/optics";
export { HAND_TOOLS, ARMAMENT_TOOLS, SPECIALIST_TOOLS } from "./tools-catalog";
export {
  PURIFICATION_ITEMS,
  FOOD_ACQUISITION_ITEMS,
  FIRE_AND_COOKING_ITEMS,
  SANITATION_ITEMS,
  NAVIGATION_ITEMS,
  SHELTER_ITEMS,
  TERRAIN_MOBILITY_ITEMS,
  CAMOUFLAGE_AND_LINES_ITEMS,
} from "./survival-catalog";

export * from "./mediaCatalog";
export * from "./personalCatalog";
export * from "./storageCatalog";
export * from "./consumablesCatalog";
export * from "./medicalCatalog";
export { ELECTRONICS_CATALOG } from "./electronicsCatalog";

export const WEAPON_ATTACHMENTS: ItemDefinition[] = [
  ...AMMUNITION_HANDLING_ITEMS,
  ...OPTICS,
  ...RAIL_ACCESSORIES,
  ...MISCELLANEOUS_ACCESSORIES,
  ...FIRE_CONTROL_MODIFICATIONS,
  ...SHOTGUN_MODIFICATIONS,
];

export const TOOLS_CATALOG: ItemDefinition[] = [
  ...HAND_TOOLS,
  ...ARMAMENT_TOOLS,
  ...SPECIALIST_TOOLS,
  ...POWERED_TOOLS,
  ...GENERATORS,
  ...STILLS,
];

export const SURVIVAL_CATALOG: ItemDefinition[] = [
  ...PURIFICATION_ITEMS,
  ...FOOD_ACQUISITION_ITEMS,
  ...FIRE_AND_COOKING_ITEMS,
  ...SANITATION_ITEMS,
  ...NAVIGATION_ITEMS,
  ...SHELTER_ITEMS,
  ...TERRAIN_MOBILITY_ITEMS,
  ...CAMOUFLAGE_AND_LINES_ITEMS,
];

export const GEAR_CATALOG: ItemDefinition[] = [
  ...GENERIC_CATALOG,
  ...CLOTHING_CATALOG,
  ...SMALL_ARMS_AMMUNITION_ITEMS,
  ...CLOSE_COMBAT_WEAPONS,
  ...ELECTRONICS_CATALOG,
  ...SIGNAL_CATALOG,
  ...RANGED_CATALOG,
  ...WEAPON_ATTACHMENTS,
  ...ARMOR_CATALOG,
  ...TOOLS_CATALOG,
  ...SURVIVAL_CATALOG,
  ...MEDIA_CATALOG,
  ...PERSONAL_CATALOG,
  ...STORAGE_CATALOG,
  ...CONSUMABLES_CATALOG,
  ...MEDICAL_CATALOG,
];
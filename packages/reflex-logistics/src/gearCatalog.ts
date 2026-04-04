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
import { POWERED_TOOLS } from "./electronics-catalog/poweredTools";
import { GENERIC_CATALOG } from "./genericCatalog";
import { RANGED_CATALOG } from "./rangedCatalog";
import { SIGNAL_CATALOG } from "./signalCatalog";
import type { ItemDefinition } from "./types";
import { AMMUNITION_HANDLING_ITEMS } from "./weapon-attachments-catalog/ammunitionHandling";
import {
  FIRE_CONTROL_MODIFICATIONS,
  MISCELLANEOUS_ACCESSORIES,
  RAIL_ACCESSORIES,
  SHOTGUN_MODIFICATIONS,
} from "./weapon-attachments-catalog/accessories";
import { OPTICS } from "./weapon-attachments-catalog/optics";

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
export { POWERED_TOOLS } from "./electronics-catalog/poweredTools";
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

export const ELECTRONICS_CATALOG: ItemDefinition[] = [
  ...ILLUMINATION_ITEMS,
  ...MAGNIFICATION_ITEMS,
  ...NIGHT_VISION_ITEMS,
  ...THERMAL_IMAGING_ITEMS,
  ...POWERED_TOOLS,
];

export const WEAPON_ATTACHMENTS: ItemDefinition[] = [
  ...AMMUNITION_HANDLING_ITEMS,
  ...OPTICS,
  ...RAIL_ACCESSORIES,
  ...MISCELLANEOUS_ACCESSORIES,
  ...FIRE_CONTROL_MODIFICATIONS,
  ...SHOTGUN_MODIFICATIONS,
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
];
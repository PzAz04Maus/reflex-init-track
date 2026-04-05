import { SMALL_ARMS_AMMUNITION_ITEMS } from "./ammunition";
import { ARMOR_CATALOG } from "./armorCatalog";
import { CLOTHING_CATALOG } from "./clothingCatalog";
import { CLOSE_COMBAT_WEAPONS } from "./closeCombatCatalog";
import { DEMOLITION_CATALOG } from "./demolitionsCatalog";
import { ELECTRONICS_CATALOG } from "./electronicsCatalog";
import { GENERIC_CATALOG } from "./genericCatalog";
import { RANGED_CATALOG } from "./rangedCatalog";
import type { ItemDefinition } from "./types";
import { WEAPON_ATTACHMENTS } from "./weaponAttachmentsCatalog";

export * from "./ammunition";
export * from "./armorCatalog";
export * from "./clothingCatalog";
export * from "./closeCombatCatalog";
export * from "./demolitionsCatalog";
export * from "./electronicsCatalog";
export * from "./genericCatalog";
export * from "./lightSupportWeapons";
export * from "./rangedCatalog";
export * from "./weaponAttachmentsCatalog";

export const GEAR_CATALOG: ItemDefinition[] = [
  ...GENERIC_CATALOG,
  ...CLOTHING_CATALOG,
  ...SMALL_ARMS_AMMUNITION_ITEMS,
  ...CLOSE_COMBAT_WEAPONS,
  ...DEMOLITION_CATALOG,
  ...ELECTRONICS_CATALOG,
  ...RANGED_CATALOG,
  ...WEAPON_ATTACHMENTS,
  ...ARMOR_CATALOG,
];
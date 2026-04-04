import { SMALL_ARMS_AMMUNITION_ITEMS } from "./ammunition";
import { ARMOR_CATALOG } from "./armorCatalog";
import { ELECTRONICS_CATALOG } from "./electronicsCatalog";
import { GENERIC_CATALOG } from "./genericCatalog";
import { RANGED_CATALOG } from "./rangedCatalog";
import type { ItemDefinition } from "./types";
import { WEAPON_ATTACHMENTS } from "./weaponAttachmentsCatalog";

export * from "./ammunition";
export * from "./armorCatalog";
export * from "./electronicsCatalog";
export * from "./genericCatalog";
export * from "./rangedCatalog";
export * from "./weaponAttachmentsCatalog";

export const GEAR_CATALOG: ItemDefinition[] = [
  ...GENERIC_CATALOG,
  ...SMALL_ARMS_AMMUNITION_ITEMS,
  ...ELECTRONICS_CATALOG,
  ...RANGED_CATALOG,
  ...WEAPON_ATTACHMENTS,
  ...ARMOR_CATALOG,
];
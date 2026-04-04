import { createItemDefinition } from "./inventory";
import type { ItemDefinition } from "./types";

export const BACKPACK: ItemDefinition = createItemDefinition({
  id: "gear:backpack",
  name: "Backpack",
  weight: 3,
  voucherCost: { "worn:torso": 1 },
});

export const RIFLE_SLING: ItemDefinition = createItemDefinition({
  id: "gear:generic-sling",
  name: "Generic Sling",
  weight: 1,
  tags: ["sling"],
  grantsCarryProfiles: {
    slung: {
      voucherCost: { "worn:shoulder": 1 },
      description: "Attached host item may be carried slung without using the hands.",
    },
  },
  voucherBonus: { "worn:shoulder": 1 },
});

export const GENERIC_CATALOG: ItemDefinition[] = [BACKPACK, RIFLE_SLING];
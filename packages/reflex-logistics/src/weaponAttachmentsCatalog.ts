import type { ItemDefinition } from "./types";
import { AMMUNITION_HANDLING_ITEMS } from "./weapon-attachments-catalog/ammunitionHandling";
import {
  FIRE_CONTROL_MODIFICATIONS,
  MISCELLANEOUS_ACCESSORIES,
  RAIL_ACCESSORIES,
  SHOTGUN_MODIFICATIONS,
} from "./weapon-attachments-catalog/accessories";
import { OPTICS } from "./weapon-attachments-catalog/optics";

export { AMMUNITION_HANDLING_ITEMS } from "./weapon-attachments-catalog/ammunitionHandling";
export {
  FIRE_CONTROL_MODIFICATIONS,
  MISCELLANEOUS_ACCESSORIES,
  RAIL_ACCESSORIES,
  SHOTGUN_MODIFICATIONS,
} from "./weapon-attachments-catalog/accessories";
export { OPTICS } from "./weapon-attachments-catalog/optics";

export const WEAPON_ATTACHMENTS: ItemDefinition[] = [
  ...AMMUNITION_HANDLING_ITEMS,
  ...OPTICS,
  ...RAIL_ACCESSORIES,
  ...MISCELLANEOUS_ACCESSORIES,
  ...FIRE_CONTROL_MODIFICATIONS,
  ...SHOTGUN_MODIFICATIONS,
];

import type { ItemDefinition } from "./types";
import { ILLUMINATION_ITEMS } from "./electronics-catalog/illumination";
import {
	MAGNIFICATION_ITEMS,
	NIGHT_VISION_ITEMS,
	THERMAL_IMAGING_ITEMS,
} from "./electronics-catalog/vision";
import { POWERED_TOOLS } from "./electronics-catalog/poweredTools";
import { COMMUNICATION_ITEMS } from "./electronics-catalog/communication";

export { ILLUMINATION_ITEMS } from "./electronics-catalog/illumination";
export {
	MAGNIFICATION_ITEMS,
	NIGHT_VISION_ITEMS,
	THERMAL_IMAGING_ITEMS,
} from "./electronics-catalog/vision";
export { POWERED_TOOLS } from "./electronics-catalog/poweredTools";
export { COMMUNICATION_ITEMS } from "./electronics-catalog/communication";

export const ELECTRONICS_CATALOG: ItemDefinition[] = [
	...ILLUMINATION_ITEMS,
	...MAGNIFICATION_ITEMS,
	...NIGHT_VISION_ITEMS,
	...THERMAL_IMAGING_ITEMS,
	...POWERED_TOOLS,
	...COMMUNICATION_ITEMS,
];

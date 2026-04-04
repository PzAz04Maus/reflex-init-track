import type { ItemDefinition } from "./types";
import { ILLUMINATION_ITEMS } from "./electronics-catalog/illumination";
import {
	MAGNIFICATION_ITEMS,
	NIGHT_VISION_ITEMS,
	THERMAL_IMAGING_ITEMS,
} from "./electronics-catalog/vision";
import { POWERED_TOOLS } from "./electronics-catalog/poweredTools";
import { COMMUNICATION_ITEMS } from "./electronics-catalog/communication";
import { PHOTOGRAPHY_ITEMS } from "./electronics-catalog/photography";
import { SENSOR_ITEMS } from "./electronics-catalog/sensors";
import {
	COMPUTER_SYSTEMS,
	COMPUTER_PERIPHERALS,
	SOFTWARE_ITEMS,
} from "./electronics-catalog/computing";
import { CONSUMER_ELECTRONICS } from "./electronics-catalog/consumerElectronics";

export { ILLUMINATION_ITEMS } from "./electronics-catalog/illumination";
export {
	MAGNIFICATION_ITEMS,
	NIGHT_VISION_ITEMS,
	THERMAL_IMAGING_ITEMS,
} from "./electronics-catalog/vision";
export { POWERED_TOOLS } from "./electronics-catalog/poweredTools";
export { COMMUNICATION_ITEMS } from "./electronics-catalog/communication";
export { PHOTOGRAPHY_ITEMS } from "./electronics-catalog/photography";
export { SENSOR_ITEMS } from "./electronics-catalog/sensors";
export {
	COMPUTER_SYSTEMS,
	COMPUTER_PERIPHERALS,
	SOFTWARE_ITEMS,
} from "./electronics-catalog/computing";
export { CONSUMER_ELECTRONICS } from "./electronics-catalog/consumerElectronics";

export const ELECTRONICS_CATALOG: ItemDefinition[] = [
	...ILLUMINATION_ITEMS,
	...MAGNIFICATION_ITEMS,
	...NIGHT_VISION_ITEMS,
	...THERMAL_IMAGING_ITEMS,
	...POWERED_TOOLS,
	...COMMUNICATION_ITEMS,
	...PHOTOGRAPHY_ITEMS,
	...SENSOR_ITEMS,
	...COMPUTER_SYSTEMS,
	...COMPUTER_PERIPHERALS,
	...SOFTWARE_ITEMS,
	...CONSUMER_ELECTRONICS,
];

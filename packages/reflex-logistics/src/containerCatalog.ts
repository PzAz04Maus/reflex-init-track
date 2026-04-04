import type { ContainerDefinition } from "./types";
import {
  FIXED_LBE_COMPONENT_CONTAINERS,
  FIXED_LOAD_BEARING_CONTAINERS,
} from "./container-catalog/fixedLoadBearing";
import { MODULAR_LOAD_BEARING_CONTAINERS, MODULAR_LOAD_BEARING_POUCHES } from "./container-catalog/modularLoadBearing";
import { PACK_CONTAINERS } from "./container-catalog/packs";
import { SURVIVAL_CONTAINERS } from "./container-catalog/survival";
import { DRY_GOODS_STORAGE_CONTAINERS, LIQUID_STORAGE_CONTAINERS } from "./container-catalog/storage";

export { FIXED_LBE_COMPONENT_CONTAINERS, FIXED_LOAD_BEARING_CONTAINERS } from "./container-catalog/fixedLoadBearing";
export { MODULAR_LOAD_BEARING_CONTAINERS, MODULAR_LOAD_BEARING_POUCHES } from "./container-catalog/modularLoadBearing";
export { PACK_CONTAINERS } from "./container-catalog/packs";
export { SURVIVAL_CONTAINERS } from "./container-catalog/survival";
export { DRY_GOODS_STORAGE_CONTAINERS, LIQUID_STORAGE_CONTAINERS } from "./container-catalog/storage";

export const CONTAINER_CATALOG: ContainerDefinition[] = [
  ...PACK_CONTAINERS,
  ...FIXED_LOAD_BEARING_CONTAINERS,
  ...FIXED_LBE_COMPONENT_CONTAINERS,
  ...MODULAR_LOAD_BEARING_CONTAINERS,
  ...MODULAR_LOAD_BEARING_POUCHES,
  ...SURVIVAL_CONTAINERS,
  ...LIQUID_STORAGE_CONTAINERS,
  ...DRY_GOODS_STORAGE_CONTAINERS,
];
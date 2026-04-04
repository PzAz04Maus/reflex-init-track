import type { VehicleDefinitionInit } from "../types/vehicles";
import { VehicleDefinition } from "../types/vehicles";

function def(init: VehicleDefinitionInit): VehicleDefinition {
  return new VehicleDefinition(init);
}

// Source: Twilight 2013 Core OEF PDF p.279+ (written p.277+ — military vehicle catalog)

export const MILITARY_VEHICLES: VehicleDefinition[] = [
  // Entries will be added as the catalog pages are ingested.
];

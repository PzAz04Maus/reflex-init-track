import type { VehicleDefinitionInit } from "../types/vehicles";
import { VehicleDefinition } from "../types/vehicles";

function def(init: VehicleDefinitionInit): VehicleDefinition {
  return new VehicleDefinition(init);
}

// Source: Twilight 2013 Core OEF PDF p.279 (written p.277 — vehicle catalog begins)

export const CIVILIAN_VEHICLES: VehicleDefinition[] = [
  // Entries will be added as the catalog pages are ingested.
];

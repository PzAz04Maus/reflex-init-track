import { ANIMAL_DRAWN_VEHICLES } from "./animalDrawnVehicles";
import { CIVILIAN_GROUND_VEHICLES } from "./civilianGroundVehicles";
import { CIVILIAN_WATERCRAFT } from "./civilianWatercraft";

// Source: Twilight 2013 Core OEF PDF p.284+ (civilian and non-combat vehicle catalog pages in this pass)

export const CIVILIAN_VEHICLES = [
  ...CIVILIAN_GROUND_VEHICLES,
  ...CIVILIAN_WATERCRAFT,
  ...ANIMAL_DRAWN_VEHICLES,
];

import { VehicleDefinition } from "../types/vehicles";
import type {
  VehicleDefinitionInit,
  VehicleFuelStats,
  VehicleGroundSpeed,
  VehicleMovementKind,
  VehicleMovementMode,
} from "../types/vehicles";

const SOURCE_BOOK = "Twilight 2013 Core OEF PDF";

type SourcePage = number | string;

export function source(page: SourcePage): string {
  return `Source: ${SOURCE_BOOK} p.${page}`;
}

export function sources(...pages: SourcePage[]): string[] {
  return pages.map(source);
}

export function fuel(types: VehicleFuelStats["types"], tankCapacityLiters: number, consumptionPerHour: number): VehicleFuelStats {
  return {
    types: [...types],
    tankCapacityLiters,
    consumptionPerHour,
  };
}

export function groundSpeed(road: number, crossCountry: number): VehicleGroundSpeed {
  return { road, crossCountry };
}

export function movementMode(
  id: string,
  label: string,
  kind: VehicleMovementKind,
  init: Omit<VehicleMovementMode, "id" | "label" | "kind">,
): VehicleMovementMode {
  return {
    id,
    label,
    kind,
    ...init,
  };
}

export function defineVehicle(
  init: Omit<VehicleDefinitionInit, "weight" | "source" | "tags"> & {
    sourcePages: SourcePage[];
    tags?: string[];
  },
): VehicleDefinition {
  return new VehicleDefinition({
    ...init,
    weight: init.vehicle.weightKg,
    source: sources(...init.sourcePages),
    tags: ["vehicle", ...(init.tags ?? [])],
  });
}
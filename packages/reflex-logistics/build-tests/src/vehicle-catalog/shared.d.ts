import { VehicleDefinition } from "../types/vehicles";
import type { VehicleDefinitionInit, VehicleFuelStats, VehicleGroundSpeed, VehicleMovementKind, VehicleMovementMode } from "../types/vehicles";
type SourcePage = number | string;
export declare function source(page: SourcePage): string;
export declare function sources(...pages: SourcePage[]): string[];
export declare function fuel(types: VehicleFuelStats["types"], tankCapacityLiters: number, consumptionPerHour: number): VehicleFuelStats;
export declare function groundSpeed(road: number, crossCountry: number): VehicleGroundSpeed;
export declare function movementMode(id: string, label: string, kind: VehicleMovementKind, init: Omit<VehicleMovementMode, "id" | "label" | "kind">): VehicleMovementMode;
export declare function defineVehicle(init: Omit<VehicleDefinitionInit, "weight" | "source" | "tags"> & {
    sourcePages: SourcePage[];
    tags?: string[];
}): VehicleDefinition;
export {};
//# sourceMappingURL=shared.d.ts.map
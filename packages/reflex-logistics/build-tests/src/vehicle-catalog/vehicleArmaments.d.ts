import type { WeaponPenetration, WeaponRangeProfile, WeaponSpeedProfile } from "../types/weapons";
export interface VehicleArmamentAmmunition {
    id: string;
    name: string;
    source: string[];
    damage: number;
    penetration?: WeaponPenetration;
    effects?: string[];
    weightText?: string;
    barterValue: string;
    streetPrice: number;
    notes?: string[];
    traits?: string[];
}
export interface VehicleArmamentSystem {
    id: string;
    name: string;
    category: "autocannon" | "tank-gun" | "guided-missile-launcher" | "machine-gun-variant";
    source: string[];
    description: string;
    capacity: string;
    range: WeaponRangeProfile;
    rateOfFire: string;
    speed: WeaponSpeedProfile;
    weightText?: string;
    barterValue?: string;
    streetPrice?: number;
    powerRequirement?: string;
    variantOfWeaponId?: string;
    ammoOptions?: VehicleArmamentAmmunition[];
    traits?: string[];
    notes?: string[];
}
export declare const VEHICLE_ARMAMENTS: VehicleArmamentSystem[];
export declare const VEHICLE_ARMAMENTS_BY_ID: Record<string, VehicleArmamentSystem>;
//# sourceMappingURL=vehicleArmaments.d.ts.map
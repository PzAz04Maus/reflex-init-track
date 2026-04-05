import type { ItemDamageProfile } from "./types";
export interface LightSupportWeaponAmmunition {
    id: string;
    name: string;
    source: string[];
    damage?: ItemDamageProfile[];
    damageText?: string;
    effects?: string[];
    weightText: string;
    barterValue: string;
    streetPrice: number;
    traits?: string[];
    notes?: string[];
}
export interface LightSupportWeaponSystem {
    id: string;
    name: string;
    category: "shoulder-fired-grenade-launcher" | "underbarrel-grenade-launcher" | "automatic-grenade-launcher" | "disposable-rocket-launcher" | "reusable-rocket-launcher" | "guided-missile-launcher" | "mortar";
    source: string[];
    caliber?: string;
    capacity: string;
    range: string;
    rateOfFire: string;
    speed: string;
    recoil?: number | string;
    bulk: number;
    weightText: string;
    barterValue: string;
    streetPrice: number;
    description: string;
    traits?: string[];
    notes?: string[];
    ammoOptions?: LightSupportWeaponAmmunition[];
}
export interface LightSupportWeaponReferenceRule {
    id: string;
    name: string;
    source: string[];
    traits: string[];
    notes: string[];
}
export declare const LIGHT_SUPPORT_WEAPONS: LightSupportWeaponSystem[];
export declare const LIGHT_SUPPORT_WEAPONS_BY_ID: Record<string, LightSupportWeaponSystem>;
export declare const LIGHT_SUPPORT_WEAPONS_RULES: LightSupportWeaponReferenceRule[];
//# sourceMappingURL=lightSupportWeapons.d.ts.map
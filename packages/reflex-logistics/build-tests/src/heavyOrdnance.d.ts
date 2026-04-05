export interface HeavyOrdnanceAmmunition {
    id: string;
    name: string;
    source: string[];
    damage?: number;
    damageText?: string;
    effects?: string[];
    weightText: string;
    barterValue: string;
    streetPrice: number;
    traits?: string[];
    notes?: string[];
}
export interface HeavyOrdnanceSystem {
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
    ammoOptions?: HeavyOrdnanceAmmunition[];
}
export interface HeavyOrdnanceReferenceRule {
    id: string;
    name: string;
    source: string[];
    traits: string[];
    notes: string[];
}
export declare const HEAVY_ORDNANCE: HeavyOrdnanceSystem[];
export declare const HEAVY_ORDNANCE_BY_ID: Record<string, HeavyOrdnanceSystem>;
export declare const HEAVY_ORDNANCE_RULES: HeavyOrdnanceReferenceRule[];
//# sourceMappingURL=heavyOrdnance.d.ts.map
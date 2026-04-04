import type { ItemDefinition } from "./types";
type SmallArmsAmmoCategory = "pistol-cartridge" | "rifle-cartridge" | "shotgun-shell";
type SmallArmsSpecialAmmoCode = "AP" | "HP" | "T";
type SmallArmsAmmunitionDefinition = {
    id: string;
    caliber: string;
    category: SmallArmsAmmoCategory;
    weightKgPer100Rounds: number;
    barterValue: string;
    streetPrice: number;
    availableSpecialTypes: SmallArmsSpecialAmmoCode[];
    magazineWeightNotes: string[];
    ball?: ItemDefinition;
    slug?: ItemDefinition;
    armorPiercing?: ItemDefinition;
    hollowpoint?: ItemDefinition;
    tracer?: ItemDefinition;
    buckshot?: ItemDefinition;
};
export declare const SMALL_ARMS_AMMUNITION_RULES: {
    readonly defaultLoading: "Unless otherwise noted, listed ammunition weights and prices are for default ball/FMJ loads in 100-round lots.";
    readonly armorPiercing: readonly ["Armor-piercing ammunition uses a hard metal core or tip to enhance armor penetration at the cost of overpenetration through soft targets.", "AP ammunition has a Damage rating 1 lower than normal and a Penetration rating one step better than normal.", "AP ammunition costs 5x the base value for that caliber."];
    readonly hollowpoint: readonly ["Hollowpoint ammunition exposes part of the lead core, improving expansion in soft tissue but reducing retained structural integrity on impact.", "HP ammunition has a Damage rating 2 greater than normal and a Penetration rating one step worse than normal.", "HP ammunition costs 2x the base value for that caliber.", "HP ammunition is commonly issued to military police and security personnel rather than line troops."];
    readonly tracer: readonly ["Tracer ammunition uses a small incendiary charge at the base of the bullet to produce a visible streak in flight.", "Tracer has the same damage characteristics as default ball/FMJ ammunition of the same caliber.", "When used in belts or mixed into ammunition at roughly a 1:4 ratio, tracer provides an additional +1 bonus to burst attacks.", "Tracer ammunition costs 4x the base value for that caliber and may start fires at the GM's discretion."];
    readonly buckshot: readonly ["Shotgun weapon data assumes slug ammunition by default.", "When firing buckshot, halve the weapon's base Damage, reduce Penetration to Nil, and grant a +2 attack bonus.", "The attacker's margin of success is doubled for purposes of determining final Damage when firing buckshot.", "Buckshot costs the same as slug ammunition."];
};
export declare const PISTOL_CARTRIDGES: SmallArmsAmmunitionDefinition[];
export declare const RIFLE_CARTRIDGES: SmallArmsAmmunitionDefinition[];
export declare const SHOTGUN_SHELLS: SmallArmsAmmunitionDefinition[];
export declare const SMALL_ARMS_AMMUNITION: SmallArmsAmmunitionDefinition[];
export declare const SMALL_ARMS_AMMUNITION_ITEMS: ItemDefinition[];
export {};
//# sourceMappingURL=ammunition.d.ts.map
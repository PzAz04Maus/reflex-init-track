import type { ItemDefinition, WeaponAccuracyModifier } from "../types";
export declare function defineWeaponAttachment(input: {
    id: string;
    name: string;
    weight: number;
    kind: string;
    compatibleWeaponTags: string[];
    tags?: string[];
    traits?: string[];
    barterValue?: string;
    streetPrice?: number | string;
    powerRequirement?: string;
    description?: string;
    range?: string;
    speedModifier?: string;
    accuracyModifier?: WeaponAccuracyModifier;
    visualRangeModifier?: number;
    recoilModifierPercent?: number;
    bulkOverride?: number;
    weightModifierPercent?: number;
    grantsCarryProfiles?: Record<string, {
        voucherCost: Record<string, number>;
        description?: string;
    }>;
    voucherBonus?: Record<string, number>;
    notes?: string[];
}): ItemDefinition;
export declare function defineAccessoryItem(input: {
    id: string;
    name: string;
    weight: number;
    tags?: string[];
    traits?: string[];
    barterValue?: string;
    streetPrice?: number | string;
    powerRequirement?: string;
    description?: string;
    grantsCarryProfiles?: Record<string, {
        voucherCost: Record<string, number>;
        description?: string;
    }>;
    voucherBonus?: Record<string, number>;
}): ItemDefinition;
//# sourceMappingURL=helpers.d.ts.map
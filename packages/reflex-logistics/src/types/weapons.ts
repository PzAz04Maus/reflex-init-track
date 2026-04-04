import type { RangeBandName } from "reflex-core";

export interface WeaponStatModifier {
  hip: number;
  snap: number;
  aimed: number;
  reload?: number;
}

export interface WeaponAccuracyModifier {
  hip?: number;
  snap?: number;
  aimed?: number;
}

export interface WeaponPenetration {
  optimum: string;
  maximum?: string;
}

export interface WeaponRangeProfile {
  optimum: RangeBandName;
  maximum?: RangeBandName;
  indirect?: RangeBandName;
}

export interface WeaponSpeedProfile {
  hip: number;
  snap: number;
  aimed: number;
  reload?: number;
}

export interface WeaponAttachmentModifier {
  rangeOverride?: WeaponRangeProfile;
  speedModifier?: WeaponStatModifier;
  accuracyModifier?: WeaponAccuracyModifier;
  visualRangeModifier?: number;
  recoilModifierPercent?: number;
  bulkOverride?: number;
  weightModifierPercent?: number;
}

export interface WeaponAttachmentStats {
  kind: string;
  compatibleWeaponTags: string[];
  modifier: WeaponAttachmentModifier;
  notes?: string[];
}

export interface RangedWeaponStats {
  caliber?: string;
  capacity?: number | string;
  damage: number;
  penetration: WeaponPenetration;
  range: WeaponRangeProfile;
  rateOfFire?: string;
  speed: WeaponSpeedProfile;
  recoil?: number;
  bulk?: number;
  supportedAttachmentKinds?: string[];
  crewServed?: boolean;
  requiresEmplacement?: boolean;
  barterValue?: string;
  streetPrice?: number;
  traits?: string[];
}
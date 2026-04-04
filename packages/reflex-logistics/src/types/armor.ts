export interface ArmorCoverageRegion {
  location: string;
  coveragePercent?: number;
}

export interface ArmorInsertSlot {
  key: string;
  label: string;
  maxInserts: number;
  coverage: ArmorCoverageRegion[];
}

export interface ArmorStats {
  kind: "helmet" | "body-armor" | "trauma-plate" | (string & {});
  rating?: number;
  coverage: ArmorCoverageRegion[];
  layering?: "exclusive" | "overlay" | "insert";
  insertSlots?: ArmorInsertSlot[];
  compatibleInsertSlots?: string[];
  barterValue?: string;
  streetPrice?: number;
  traits?: string[];
  notes?: string[];
}
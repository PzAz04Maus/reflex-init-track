export interface VehicleConversionRule {
    id: string;
    name: string;
    source: string[];
    requiredCheck: string;
    periodHours: number;
    targetTotal: number;
    traits: string[];
    effects: string[];
    notes?: string[];
}
export interface VehicleReferenceRule {
    id: string;
    name: string;
    source: string[];
    traits: string[];
    notes: string[];
}
export interface AnimalTrainingLevel {
    id: string;
    name: string;
    source: string[];
    requiredCheck: string;
    trainingPeriod: string;
    targetTotal: number;
    traits: string[];
    notes: string[];
}
export declare const VEHICLE_EQUIPMENT_ROLE_CODES: VehicleReferenceRule;
export declare const TRUCK_VARIATION_RULE: VehicleReferenceRule;
export declare const VEHICLE_CONVERSION_RULES: VehicleConversionRule[];
export declare const ANIMAL_TRAINING_LEVELS: AnimalTrainingLevel[];
export declare const MOUNTED_AND_DRAFT_RULES: VehicleReferenceRule[];
//# sourceMappingURL=mechanics.d.ts.map
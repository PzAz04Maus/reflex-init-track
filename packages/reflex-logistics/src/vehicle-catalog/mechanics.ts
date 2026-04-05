import { sources } from "./shared";

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

export const VEHICLE_EQUIPMENT_ROLE_CODES: VehicleReferenceRule = {
  id: "vehicle:equipment-role-codes",
  name: "Vehicle Equipment Role Codes",
  source: sources(286),
  traits: ["vehicle:equipment-role-codes"],
  notes: [
    "C = commander-mounted equipment.",
    "D = driver-mounted equipment.",
    "G = gunner-mounted equipment.",
    "L = loader-mounted equipment.",
  ],
};

export const TRUCK_VARIATION_RULE: VehicleReferenceRule = {
  id: "vehicle:truck-variations",
  name: "Truck Variations",
  source: sources(285),
  traits: [
    "vehicle:truck-closed-box-weight-plus-10pct",
    "vehicle:truck-bulk-tank-weight-plus-10pct",
    "vehicle:truck-bulk-tank-pump-100lpm",
  ],
  notes: [
    "2.5-ton truck bulk tank capacity: 2,200 L.",
    "5-ton truck bulk tank capacity: 5,500 L.",
    "10-ton truck bulk tank capacity: 9,500 L.",
    "Closed cargo boxes and bulk tank variants add 10% to listed vehicle weight.",
  ],
};

export const VEHICLE_CONVERSION_RULES: VehicleConversionRule[] = [
  {
    id: "vehicle-conversion:technical",
    name: "Technical Conversion",
    source: sources(285),
    requiredCheck: "Incremental Mechanics/Machinist (MUS)",
    periodHours: 5,
    targetTotal: 3,
    traits: [
      "vehicle:conversion:technical",
      "vehicle:conversion:requires-cutting-welding-torch",
      "vehicle:conversion:requires-mechanics-tools",
    ],
    effects: [
      "Reduce cargo capacity by 500 kg.",
      "Increase all hull armor values by 1.",
      "Add one crew position with a weapon mount.",
    ],
    notes: ["Applies to consumer vehicles; other conversions are GM discretion."],
  },
  {
    id: "vehicle-conversion:gun-truck-2-5-ton",
    name: "Gun Truck Conversion (2.5-ton)",
    source: sources(285),
    requiredCheck: "Incremental Mechanics/Machinist (MUS)",
    periodHours: 5,
    targetTotal: 6,
    traits: [
      "vehicle:conversion:gun-truck",
      "vehicle:conversion:requires-cutting-welding-torch",
      "vehicle:conversion:requires-mechanics-tools",
      "vehicle:soft-skinned-armor-hit-chance-75pct",
    ],
    effects: [
      "Reduce cargo capacity by 80%.",
      "Increase all hull armor values by 2.",
      "Add two crew positions with weapon mounts.",
    ],
  },
  {
    id: "vehicle-conversion:gun-truck-5-ton",
    name: "Gun Truck Conversion (5-ton)",
    source: sources(285),
    requiredCheck: "Incremental Mechanics/Machinist (MUS)",
    periodHours: 5,
    targetTotal: 10,
    traits: [
      "vehicle:conversion:gun-truck",
      "vehicle:conversion:requires-cutting-welding-torch",
      "vehicle:conversion:requires-mechanics-tools",
      "vehicle:soft-skinned-armor-hit-chance-75pct",
    ],
    effects: [
      "Reduce cargo capacity by 80%.",
      "Increase all hull armor values by 3.",
      "Add four crew positions with weapon mounts.",
    ],
  },
];

export const ANIMAL_TRAINING_LEVELS: AnimalTrainingLevel[] = [
  {
    id: "animal-training:untrained",
    name: "Untrained",
    source: sources(296),
    requiredCheck: "Incremental Animal Husbandry (RES) or Mounts (RES)",
    trainingPeriod: "2 weeks",
    targetTotal: 6,
    traits: ["animal-training:untrained"],
    notes: [
      "Domestic animals raised in captivity start here by default.",
      "Feral animals must first be captured before training.",
    ],
  },
  {
    id: "animal-training:docile",
    name: "Docile",
    source: sources(296),
    requiredCheck: "Incremental Animal Husbandry (RES) or Mounts (RES)",
    trainingPeriod: "1 week",
    targetTotal: 4,
    traits: ["animal-training:docile"],
    notes: ["Docile animals can haul loads but still treat ridden travel as pushing."],
  },
  {
    id: "animal-training:riding",
    name: "Riding",
    source: sources(296),
    requiredCheck: "Incremental Mounts (RES)",
    trainingPeriod: "2 weeks",
    targetTotal: 6,
    traits: ["animal-training:riding"],
    notes: ["Riding animals function normally for mounted travel and can still pull loads."],
  },
  {
    id: "animal-training:cavalry",
    name: "Cavalry",
    source: sources(296),
    requiredCheck: "Incremental Mounts (RES)",
    trainingPeriod: "1 month",
    targetTotal: 6,
    traits: ["animal-training:cavalry"],
    notes: ["Cavalry animals remain usable in combat while under a trained rider."],
  },
];

export const MOUNTED_AND_DRAFT_RULES: VehicleReferenceRule[] = [
  {
    id: "vehicle:animal-endurance",
    name: "Beast of Burden Endurance",
    source: sources(296),
    traits: ["animal:endurance-safe-travel-12-hours", "animal:rest-required-10-hours"],
    notes: [
      "Animals can travel 12 hours at safe speed before every extra hour counts as pushing.",
      "Hours pushed at up to 2x speed count as 3 hours; at up to 3x speed count as 6 hours.",
      "Each combat scene counts as one hour of travel for endurance.",
    ],
  },
  {
    id: "vehicle:mounted-combat",
    name: "Mounted Combat",
    source: sources(296, 297),
    traits: [
      "animal:mounted-combat:riding-mount-requires-control-check",
      "animal:mounted-combat:cavalry-uses-cuf-threshold",
      "animal:mounted-action-penalty:stationary:-1",
      "animal:mounted-action-penalty:at-safe-speed:-4",
      "animal:mounted-action-penalty:up-to-double-safe-speed:-6",
    ],
    notes: [
      "An uncontrolled mount flees combat at best possible speed until the rider regains control.",
      "Mount and rider are separate targets; a miss by 1 or 2 strikes the other target instead.",
      "Draft animals and their conveyances are targeted separately in combat.",
    ],
  },
];
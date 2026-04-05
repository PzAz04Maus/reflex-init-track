import { ItemDefinition, ItemInstance } from "./items";
import type { ItemDefinitionInit, ItemInstanceInit } from "./items";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Physical layout of the vehicle (p.276).
 * Standard: rectangular box on wheels, no turret.
 * Turreted: prominent turret with main armament + multiple crew.
 * CIH (Crew In Hull): small or remote turret, single crew member.
 * FlushDeck: watercraft — working spaces entirely within hull.
 * Superstructure: watercraft — built-up structure above deck level.
 */
export type VehicleConfiguration =
  | "standard"
  | "turreted"
  | "crew-in-hull"
  | "flush-deck"
  | "superstructure"
  | (string & {});

// ---------------------------------------------------------------------------
// Suspension
// ---------------------------------------------------------------------------

/** Motive suspension arrangement (p.276). Affects cross-country movement.
 * Std: Standard Wheeled — Trk: Tracked — OR: Off-Road Wheeled.
 */
export type VehicleSuspension = "std" | "or" | "trk" | (string & {});

// ---------------------------------------------------------------------------
// Fuel
// ---------------------------------------------------------------------------

/** Fuel types recognised by the Reflex System (pp.276–278).
 * G=Gasoline, D=Diesel, A=Alcohol, H=Hybrid (G/D + electric), S=Solid (coal/wood).
 * AvG=Aviation Gasoline, AvJ=Jet Fuel.
 */
export type VehicleFuelType = "G" | "D" | "A" | "H" | "S" | "AvG" | "AvJ" | (string & {});

export interface VehicleFuelStats {
  /** Fuel types the engine can burn without modification. */
  types: VehicleFuelType[];
  /** Tank capacity in litres. */
  tankCapacityLiters: number;
  /** Litres consumed per hour at safe Travel Speed.
   * Idling consumes half; pushing consumes twice. */
  consumptionPerHour: number;
}

// ---------------------------------------------------------------------------
// Speed
// ---------------------------------------------------------------------------

/** Ground vehicle speeds: road and cross-country in km/hr (travel) or m/exchange (combat). */
export interface VehicleGroundSpeed {
  road: number;
  crossCountry: number;
}

/** Watercraft speeds: single value in km/hr (travel) or m/exchange (combat). */
export type VehicleWaterSpeed = number;

export type VehicleSpeedProfile = VehicleGroundSpeed | VehicleWaterSpeed;

export type VehicleMovementKind =
  | "ground"
  | "water"
  | "sail"
  | "towed"
  | "animal-drawn"
  | (string & {});

export interface VehicleMovementMode {
  id: string;
  label: string;
  kind: VehicleMovementKind;
  /** Safe travel speed for this movement mode. */
  travelSpeed?: VehicleSpeedProfile;
  /** Safe combat speed for this movement mode. */
  combatSpeed?: VehicleSpeedProfile;
  /** Fuel used by this movement mode, if any. */
  fuel?: VehicleFuelStats;
  /** Stable lookup traits for rule handling. */
  traits?: string[];
  /** Human-readable notes that belong to this specific movement mode. */
  notes?: string[];
}

// ---------------------------------------------------------------------------
// Crew
// ---------------------------------------------------------------------------

/** Crew and passenger capacity (p.276).
 * e.g. "2+2" → { crew: 2, passengers: 2 }
 */
export interface VehicleCrewConfig {
  crew: number;
  passengers?: number;
}

// ---------------------------------------------------------------------------
// Armor
// ---------------------------------------------------------------------------

/** Per-facing armor rating entry (p.277).
 * Common key conventions:
 * Ground vehicles: section + facing — e.g. "HF", "HS", "HR", "TF", "TS", "TR", "Susp".
 * Watercraft: "Hull", "Superstructure", "Waterline".
 */
export interface VehicleArmorEntry {
  rating: number;
  /** Spaced armor (-Sp): 50% chance the margin of success is not added on explosive hits. */
  spaced?: boolean;
  /** Composite armor (-Cp): Penetration is treated as ×2 vs this facing. */
  composite?: boolean;
}

/** Record keyed by location abbreviation, e.g. { HF: { rating: 5 }, HR: { rating: 3, spaced: true } } */
export type VehicleArmorStats = Record<string, VehicleArmorEntry>;

// ---------------------------------------------------------------------------
// Systems
// ---------------------------------------------------------------------------

/** Vehicle systems as described in the source stat blocks (p.277). */
export interface VehicleSystems {
  /** Permanent weapon systems and mounting points. */
  armament?: string[];
  /** Stable references into ranged-weapon or vehicle-armament catalogs. */
  armamentIds?: string[];
  /** Internal magazine/stowage capacity description. */
  ammo?: string;
  /** Communication systems integral to the vehicle. */
  comm?: string;
  /** Sensor systems (headlights through chemical warfare detectors). */
  sensors?: string;
  /** Auxiliary systems not covered above (cranes, mine plows, medical gear, etc.). */
  aux?: string;
}

// ---------------------------------------------------------------------------
// Vehicular Equipment (p.276)
// ---------------------------------------------------------------------------

/** Optional factory-fitted or common upgrade equipment for vehicles. */
export interface VehicleEquipment {
  /** Amphibious running gear — grants waterborne movement at ¼ normal cross-country speed. */
  amphibiousRunningGear?: boolean;
  /** Number of firing ports allowing passengers to fire personal weapons. */
  firingPorts?: number;
  /** Nuclear, Biological, and Chemical protection system. */
  nbcDefenseSystem?: boolean;
  /** Self-recovery winch — 100 m steel cable, max load = 110% laden weight. */
  selfRecoveryWinch?: boolean;
  /** Weapon mount count — each equivalent to a heavy tripod for mount purposes. */
  weaponMounts?: number;
}

// ---------------------------------------------------------------------------
// VehicleStats — primary stat block
// ---------------------------------------------------------------------------

export interface VehicleStats {
  configuration: VehicleConfiguration;
  /** Undefined for watercraft. */
  suspension?: VehicleSuspension;
  /** Watercraft only: litres of water the vessel can take before sinking (p.277). */
  // currently I believe this mechanic is broken in the core rules, as it doesn't interact with buoyancy or weight at all. 
  // TODO: It will need to be developed firsthand if we want to support it properly.
  buoyancy?: number;
  crew: VehicleCrewConfig;
  /** Original source text when the crew line contains variants or special roles. */
  crewText?: string;
  /** Maximum cargo in kg when the source provides a weight-based capacity. */
  cargoKg?: number;
  cargoText?: string;
  /** Maximum trailer or towed load in kg, if explicitly listed. */
  towingCapacityKg?: number;
  /** Laden weight (fuel + ammo + crew, no cargo/passengers) in kg. */
  weightKg: number;
  weightText?: string;
  /** Maintenance requirement in hours per period of use. */
  maintenanceHours: number;
  /** One or more propulsion profiles; first entry is the default mode. */
  movementModes: VehicleMovementMode[];
  armor?: VehicleArmorStats;
  systems?: VehicleSystems;
  equipment?: VehicleEquipment;
  traits?: string[];
  notes?: string[];
}

// ---------------------------------------------------------------------------
// Clone helpers (internal)
// ---------------------------------------------------------------------------

function cloneGroundSpeed(s: VehicleGroundSpeed): VehicleGroundSpeed {
  return { ...s };
}

function cloneSpeedProfile(s: VehicleSpeedProfile): VehicleSpeedProfile {
  if (typeof s === "number") return s;
  return cloneGroundSpeed(s);
}

function cloneFuelStats(fuel: VehicleFuelStats): VehicleFuelStats {
  return {
    ...fuel,
    types: [...fuel.types],
  };
}

function cloneMovementMode(mode: VehicleMovementMode): VehicleMovementMode {
  return {
    ...mode,
    travelSpeed: mode.travelSpeed ? cloneSpeedProfile(mode.travelSpeed) : undefined,
    combatSpeed: mode.combatSpeed ? cloneSpeedProfile(mode.combatSpeed) : undefined,
    fuel: mode.fuel ? cloneFuelStats(mode.fuel) : undefined,
    traits: mode.traits ? [...mode.traits] : undefined,
    notes: mode.notes ? [...mode.notes] : undefined,
  };
}

function cloneArmorStats(armor: VehicleArmorStats): VehicleArmorStats {
  const out: VehicleArmorStats = {};
  for (const [key, entry] of Object.entries(armor)) {
    out[key] = { ...entry };
  }
  return out;
}

function cloneVehicleStats(v: VehicleStats): VehicleStats {
  return {
    ...v,
    crew: { ...v.crew },
    movementModes: v.movementModes.map(cloneMovementMode),
    armor: v.armor ? cloneArmorStats(v.armor) : undefined,
    systems: v.systems
      ? {
          ...v.systems,
          armament: v.systems.armament ? [...v.systems.armament] : undefined,
          armamentIds: v.systems.armamentIds ? [...v.systems.armamentIds] : undefined,
        }
      : undefined,
    equipment: v.equipment ? { ...v.equipment } : undefined,
    traits: v.traits ? [...v.traits] : undefined,
    notes: v.notes ? [...v.notes] : undefined,
  };
}

// ---------------------------------------------------------------------------
// Definition / Instance init types
// ---------------------------------------------------------------------------

export interface VehicleDefinitionInit extends ItemDefinitionInit {
  vehicle: VehicleStats;
}

export interface VehicleInstanceInit extends ItemInstanceInit {
  vehicle: VehicleStats;
}

// ---------------------------------------------------------------------------
// VehicleDefinition class
// ---------------------------------------------------------------------------

export class VehicleDefinition extends ItemDefinition {
  vehicle: VehicleStats;

  constructor(input: VehicleDefinitionInit) {
    super(input);
    this.vehicle = cloneVehicleStats(input.vehicle);
  }

  protected override toInit(): VehicleDefinitionInit {
    return {
      ...super.toInit(),
      vehicle: cloneVehicleStats(this.vehicle),
    };
  }

  isWatercraft(): boolean {
    return (
      this.vehicle.configuration === "flush-deck" ||
      this.vehicle.configuration === "superstructure"
    );
  }

  isTracked(): boolean {
    return this.vehicle.suspension === "trk";
  }

  hasNBC(): boolean {
    return this.vehicle.equipment?.nbcDefenseSystem ?? false;
  }

  hasAmphibiousGear(): boolean {
    return this.vehicle.equipment?.amphibiousRunningGear ?? false;
  }

  getPrimaryMovementMode(): VehicleMovementMode | undefined {
    return this.vehicle.movementModes[0];
  }

  getMovementMode(id: string): VehicleMovementMode | undefined {
    return this.vehicle.movementModes.find((mode) => mode.id === id);
  }

  getArmorFacing(key: string): VehicleArmorEntry | undefined {
    return this.vehicle.armor?.[key];
  }

  override instantiate(
    input: Omit<VehicleInstanceInit, keyof VehicleDefinitionInit | "quantity"> & { quantity?: number } = {},
  ): VehicleInstance {
    return new VehicleInstance({
      ...this.toInit(),
      quantity: input.quantity ?? 1,
      location: input.location,
      attachmentIds: input.attachmentIds,
      attachedToItemId: input.attachedToItemId,
      carryMode: input.carryMode,
    });
  }
}

// ---------------------------------------------------------------------------
// VehicleInstance class
// ---------------------------------------------------------------------------

export class VehicleInstance extends ItemInstance {
  vehicle: VehicleStats;

  constructor(input: VehicleInstanceInit) {
    super(input);
    this.vehicle = cloneVehicleStats(input.vehicle);
  }

  protected override toInit(): VehicleDefinitionInit {
    return {
      ...super.toInit(),
      vehicle: cloneVehicleStats(this.vehicle),
    };
  }

  protected override toInstanceInit(): VehicleInstanceInit {
    return {
      ...super.toInstanceInit(),
      vehicle: cloneVehicleStats(this.vehicle),
    };
  }
}

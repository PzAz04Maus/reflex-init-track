# Combat State Types Reference

This document describes the main types used in the Reflex Init Track system, located in /src/core/types.ts

---

## CharacterId
- **Type:** `string`
- **Description:** Unique identifier for a character.

## CharacterState
- **Fields:**
  - `character: Record<CharacterId, CharacterData>` — All character data by ID.
  - `initiative: Record<CharacterId, InitiativeState>` — Initiative state by ID.
  - `actions: Record<CharacterId, ActionState | null>` — Actions by ID.
- **Description:** Aggregates all per-character state for a scenario.

## CharacterRecord
- **Fields:**
  - `id: CharacterId` — Unique character ID.
  - `name: string` — Displayed Character name.
  - `ownerUserId?: string | null` — User who owns the character.
  - `actorUuid?: string | null` — External actor reference (e.g., VTT).
  - `combatantId?: string | null` — External combatant reference.
  - `data: CharacterData` — Core stats and values.
  - `bio: CharacterBio` — Biographical info.
  - `equipment: EquipmentState` — Equipment carried.
  - `init: InitiativeState` — Current initiative state.
  - `action?: ActionState | null` — Current or planned action.
- **Description:** The main object representing a character in combat.

## CharacterData
- **Fields:**
  - `ooda: number` — OODA (Observe-Orient-Decide-Act) stat.
- **Description:** Core stats for a character.

## CharacterBio
- **Fields:**
  - `age?: number`
  - `gender?: string`
  - `height?: string`
  - `weight?: string`
  - `description?: string`
  - `ethnicity?: string`
  - `imageUrl?: string`
  - `career?: careerData[]` — List of career entries.
- **Description:** Biographical and descriptive information for a character.

## careerData
- **Fields:**
  - `job: string` — Career/job name.
  - `years: number` — Years spent in the role.
  - `dateStarted?: string` — Start date.
  - `dateEnded?: string` — End date.
  - `description: string` — Description of the role.
- **Description:** Represents a single career entry in a character's bio.

## InitiativeState
- **Fields:**
  - `base: number` — Base initiative value.
  - `initial: number` — Initial initiative at combat start.
  - `val: number` — Current initiative value.
  - `joined: boolean` — Whether the character is active in combat.
  - `joinedMidFight?: boolean` — If the character joined after combat started.
- **Description:** Tracks initiative for a character during combat.

## ActionState
- **Fields:**
  - `id: string` — Action identifier.
  - `name: string` — Action name.
  - `cost: number` — Initiative/action cost.
- **Description:** Represents a planned or current action for a character.

## AddActorInput
- **Fields:**
  - `character: CharacterData` — Character stats.
  - `state: Partial<InitiativeState>` — Partial initiative state for joining.
- **Description:** Input for adding a new actor to combat.

## CombatState
- **Fields:**
  - `actors: CharacterRecord[]` — All actors in the current combat.
  - `lastActingIds: CharacterId[]` — IDs of actors who acted last.
  - `round: number` — Current round number.
- **Description:** The main state object for a combat encounter.

## TurnAdvanceResult
- **Fields:**
  - `state: CombatState` — Updated combat state after advancing turn.
  - `actingIds: CharacterId[]` — IDs of actors who acted this turn.
- **Description:** Result of advancing the turn, including new state and acting actors.

---

For further details, see the source code in `src/core/types.ts`.

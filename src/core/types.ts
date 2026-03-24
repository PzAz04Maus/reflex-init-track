export type ActorId = string; // This is the displayed identifier for an actor
export type ActorCallsign = string; // This is a unique identifier for an actor, used for internal tracking and referencing.

export interface Actor {
  id: ActorId;
  callsign: ActorCallsign;
  name: string;
  tick: number;
  actionCost: number;
  joined: boolean;
}

export interface CombatState {
  actors: Actor[];
  exchange: number;
}

export type CombatAction =
  | { type: "addActor"; actor: Actor }
  | { type: "removeActor"; actorId: ActorId }
  | { type: "setActionCost"; actorId: ActorId; actionCost: number }
  | { type: "setTick"; actorId: ActorId; tick: number }
  | { type: "toggleJoined"; actorId: ActorId }
  | { type: "advanceTurn" }
  | { type: "reset"; state: CombatState };
export interface ResourceData {
  value: number;
  max: number;
}

export interface ReflexStatsData {
  ooda: number;
  speed: number;
  awareness: number;
}

export interface ReflexCombatData {
  tick: number;
  actionCost: number;
  declaredAction: string;
  joined: boolean;
}

export interface ReflexCharacterSystemData {
  stats: ReflexStatsData;
  resources: {
    hp: ResourceData;
    fatigue: ResourceData;
  };
  combat: ReflexCombatData;
}

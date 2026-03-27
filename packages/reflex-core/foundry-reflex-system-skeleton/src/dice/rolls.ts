export async function rollBasic(formula: string, flavor?: string): Promise<Roll> {
  const roll = new Roll(formula);
  await roll.evaluate();
  await roll.toMessage({ flavor: flavor ?? "Roll" });
  return roll;
}

export async function rollOoda(actor: Actor): Promise<Roll> {
  const systemData = actor.system as Record<string, any>;
  const ooda = Number(systemData.stats?.ooda ?? 0);
  return rollBasic(`1d10 + ${ooda}`, `${actor.name} rolls OODA`);
}

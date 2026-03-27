export class ReflexActor extends Actor {
  prepareDerivedData(): void {
    super.prepareDerivedData();
    const systemData = this.system as Record<string, any>;

    const hp = systemData.resources?.hp;
    if (hp) hp.value = Math.clamp(hp.value ?? 0, 0, hp.max ?? 0);

    const fatigue = systemData.resources?.fatigue;
    if (fatigue) fatigue.value = Math.clamp(fatigue.value ?? 0, 0, fatigue.max ?? 0);
  }

  async advanceTick(): Promise<void> {
    const systemData = this.system as Record<string, any>;
    const tick = Number(systemData.combat?.tick ?? 0);
    const actionCost = Number(systemData.combat?.actionCost ?? 0);
    await this.update({ "system.combat.tick": tick + actionCost });
  }
}

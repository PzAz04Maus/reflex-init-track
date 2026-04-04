// @ts-ignore: Foundry VTT global types
declare const Actor: any;
import { clamp } from "../../../../reflex-framework/src/utils/clamp";

export class ReflexActor extends (Actor as { new (...args: any[]): any }) {
  prepareDerivedData(): void {
    super.prepareDerivedData();
    const systemData = (this as any).system as Record<string, any>;

    const hp = systemData.resources?.hp;
    if (hp) hp.value = clamp(hp.value ?? 0, 0, hp.max ?? 0);

    const fatigue = systemData.resources?.fatigue;
    if (fatigue) fatigue.value = clamp(fatigue.value ?? 0, 0, fatigue.max ?? 0);
  }

  async advanceTick(): Promise<void> {
    const systemData = (this as any).system as Record<string, any>;
    const tick = Number(systemData.combat?.tick ?? 0);
    const actionCost = Number(systemData.combat?.actionCost ?? 0);
    await (this as any).update({ "system.combat.tick": tick + actionCost } as any);
  }
}
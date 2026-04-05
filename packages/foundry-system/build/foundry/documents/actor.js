import { clamp } from "../../../../reflex-framework/src/utils/clamp";
export class ReflexActor extends Actor {
    prepareDerivedData() {
        super.prepareDerivedData();
        const systemData = this.system;
        const hp = systemData.resources?.hp;
        if (hp)
            hp.value = clamp(hp.value ?? 0, 0, hp.max ?? 0);
        const fatigue = systemData.resources?.fatigue;
        if (fatigue)
            fatigue.value = clamp(fatigue.value ?? 0, 0, fatigue.max ?? 0);
    }
    async advanceTick() {
        const systemData = this.system;
        const tick = Number(systemData.combat?.tick ?? 0);
        const actionCost = Number(systemData.combat?.actionCost ?? 0);
        await this.update({ "system.combat.tick": tick + actionCost });
    }
}

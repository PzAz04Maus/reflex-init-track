// Register a hook to read rolls from chat messages
export function registerReadRollFromChatHook() {
    Hooks.on("createChatMessage", (message) => {
        const m = message;
        const rawRolls = (m._source?.rolls ?? []);
        if (!rawRolls.length)
            return;
        console.group("[Option 2] Read roll(s) from chat message");
        console.log("Message ID:", m.id);
        console.log("Alias:", m.alias);
        console.log("Raw rolls:", rawRolls);
        console.groupEnd();
    });
}
// Register a hook to intercept system rolls
export function registerInterceptSystemRollHook() {
    Hooks.on("createChatMessage", (message) => {
        const m = message;
        if (!m.isRoll)
            return;
        const rawRolls = (m._source?.rolls ?? []);
        // Add custom logic here if needed
    });
}
// Simple synchronous d20 roller for logic-only use (not for chat/system rolls)
export function rollD20() {
    return Math.floor(Math.random() * 20) + 1;
}
export async function createAndEvaluateRoll() {
    const roll = await new Roll("1d20 + 5").evaluate();
    console.log("[Option 1] Formula:", roll.formula);
    console.log("[Option 1] Total:", roll.total);
    console.log("[Option 1] Terms:", roll.terms);
    console.log("[Option 1] Dice:", roll.dice);
    await roll.toMessage({
        speaker: ChatMessage.getSpeaker(),
        flavor: "Module-generated test roll"
    });
}
export async function createActorBasedRoll(actorId) {
    const actor = game.actors?.get(actorId);
    if (!actor) {
        console.warn(`[Option 1b] Actor not found: ${actorId}`);
        return;
    }
    const rollData = actor.getRollData();
    const roll = await new Roll("1d20 + @abilities.dex.mod", rollData).evaluate();
    console.log("[Option 1b] Actor:", actor.name);
    console.log("[Option 1b] Total:", roll.total);
    await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: `${actor.name} makes a Dex-based roll`
    });
}

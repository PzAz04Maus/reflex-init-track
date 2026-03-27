
// Simple synchronous d20 roller for logic-only use (not for chat/system rolls)
export function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

export async function createAndEvaluateRoll(): Promise<void> {
  const roll = await new Roll("1d20 + 5").evaluate();

  console.log("[Option 1] Formula:", roll.formula);
  console.log("[Option 1] Total:", roll.total);
  console.log("[Option 1] Terms:", roll.terms);
  console.log("[Option 1] Dice:", roll.dice);

  await (roll as any).toMessage({
    speaker: ChatMessage.getSpeaker(),
    flavor: "Module-generated test roll"
  });
}

export async function createActorBasedRoll(actorId: string): Promise<void> {
  const actor = game.actors?.get(actorId);
  if (!actor) {
    console.warn(`[Option 1b] Actor not found: ${actorId}`);
    return;
  }

  const rollData = actor.getRollData();
  const roll = await new Roll("1d20 + @abilities.dex.mod", rollData).evaluate();

  console.log("[Option 1b] Actor:", actor.name);
  console.log("[Option 1b] Total:", roll.total);

  await (roll as any).toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `${actor.name} makes a Dex-based roll`
  });
}

export function registerReadRollFromChatHook(): void {
  Hooks.on("createChatMessage", (message: ChatMessage) => {
    const m = message as any;
    const rawRolls = (m._source?.rolls ?? []) as unknown[];

    if (!rawRolls.length) return;

    console.group("[Option 2] Read roll(s) from chat message");
    console.log("Message ID:", m.id);
    console.log("Alias:", m.alias);
    console.log("Raw rolls:", rawRolls);
    console.groupEnd();
  });
}

export function registerInterceptSystemRollHook(): void {
  Hooks.on("createChatMessage", (message: ChatMessage) => {
    const m = message as any;
    if (!m.isRoll) return;

    const rawRolls = (m._source?.rolls ?? []) as unknown[];
    const firstRoll = rawRolls[0];
    if (!firstRoll) return;

    console.group("[Option 3] Intercepted system roll");
    console.log("Message ID:", m.id);
    console.log("Speaker:", m.alias);
    console.log("Raw first roll:", firstRoll);
    console.log("Raw message:", m);
    console.groupEnd();
  });
}

export function registerAllRollExamples(): void {
  registerReadRollFromChatHook();
  registerInterceptSystemRollHook();
}
// Foundry VTT globals are available if @league-of-foundry-developers/foundry-vtt-types is installed and referenced in tsconfig.json
// Register a hook to read rolls from chat messages
  Hooks.on("createChatMessage", (message: InstanceType<typeof ChatMessage>) => {
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

// Register a hook to intercept system rolls
  Hooks.on("createChatMessage", (message: InstanceType<typeof ChatMessage>) => {
    const m = message as any;
    if (!m.isRoll) return;

    const rawRolls = (m._source?.rolls ?? []) as unknown[];
    // Add custom logic here if needed
  });
}

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


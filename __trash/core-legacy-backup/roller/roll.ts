
// Re-export roller functions from reflex-core
export * from "../../../reflex-core/src/dice/rolls";
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
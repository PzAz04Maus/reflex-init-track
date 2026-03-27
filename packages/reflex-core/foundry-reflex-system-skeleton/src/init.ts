import { REFLEX } from "./config";
import { ReflexActor } from "./documents/actor";
import { ReflexItem } from "./documents/item";
import { ReflexActorSheet } from "./sheets/actor-sheet";
import { ReflexItemSheet } from "./sheets/item-sheet";

Hooks.once("init", () => {
  console.log(`${REFLEX.id} | Initializing system`);

  CONFIG.Actor.documentClass = ReflexActor;
  CONFIG.Item.documentClass = ReflexItem;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(REFLEX.id, ReflexActorSheet, {
    types: ["character", "vehicle", "unit"],
    makeDefault: true,
    label: "REFLEX.SheetActor"
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(REFLEX.id, ReflexItemSheet, {
    types: ["weapon", "gear", "effect"],
    makeDefault: true,
    label: "REFLEX.SheetItem"
  });
});

Hooks.once("ready", () => {
  console.log(`${REFLEX.id} | Ready`);
});

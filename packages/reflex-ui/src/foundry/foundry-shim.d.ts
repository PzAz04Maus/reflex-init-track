declare const Hooks: any;
declare const game: any;
declare const ui: any;
declare const foundry: any;
declare const HandlebarsApplicationMixin: any;
declare const ApplicationV2: any;
declare function renderTemplate(path: string, data: unknown): Promise<string>;

declare interface CombatLike {
  getFlag(scope: string, key: string): Promise<unknown>;
  setFlag(scope: string, key: string, value: unknown): Promise<void>;
  combatants?: Iterable<any>;
}
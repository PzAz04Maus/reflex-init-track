export declare class ReflexActorSheet extends ActorSheet {
    static get defaultOptions(): ActorSheet.Options;
    get template(): string;
    getData(options?: any): Promise<Record<string, unknown>>;
    activateListeners(html: JQuery): void;
}
//# sourceMappingURL=actor-sheet.d.ts.map
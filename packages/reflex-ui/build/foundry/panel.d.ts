export declare class ReflexSchedulerPanel extends foundry.applications.api.ApplicationV2 {
    static DEFAULT_OPTIONS: {
        id: string;
        classes: string[];
        tag: string;
        window: {
            title: string;
        };
        position: {
            width: number;
            height: "auto";
        };
    };
    _prepareContext(): Promise<Record<string, unknown>>;
    _onRender(_context: Record<string, unknown>, _options: Record<string, unknown>): Promise<void>;
}
//# sourceMappingURL=panel.d.ts.map
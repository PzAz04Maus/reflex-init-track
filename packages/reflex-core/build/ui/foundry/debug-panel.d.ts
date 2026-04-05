declare const MixedApplication: any;
export declare class ReflexDebugPanel extends MixedApplication {
    static DEFAULT_OPTIONS: {
        id: string;
        classes: string[];
        tag: string;
        window: {
            title: string;
        };
        position: {
            width: number;
            height: number;
        };
    };
    _prepareContext(): Promise<Record<string, unknown>>;
    _renderHTML(context: Record<string, unknown>): Promise<string>;
    _onRender(_context: Record<string, unknown>, _options: Record<string, unknown>): Promise<void>;
}
export declare function registerReflexDebugPanel(): void;
export {};
//# sourceMappingURL=debug-panel.d.ts.map
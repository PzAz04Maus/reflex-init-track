export declare const RangeBand: {
    readonly Personal: 0;
    readonly Gunfighting: readonly [1, 7];
    readonly CQB: readonly [8, 25];
    readonly Tight: readonly [26, 100];
    readonly Medium: readonly [101, 200];
    readonly Open: readonly [201, 400];
    readonly Sniping: readonly [401, 800];
    readonly Extreme: readonly [801, 1600];
};
export declare const RangeBandNames: (keyof typeof RangeBand)[];
export type RangeBandName = Extract<keyof typeof RangeBand, string>;
//# sourceMappingURL=rangeBands.d.ts.map
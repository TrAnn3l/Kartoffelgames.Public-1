export declare class DifferenceSearch<TA, TB> {
    private readonly mCompareFunction;
    /**
     * Constructor.
     * @param pCompareFunction - Compare function to compare two items.
     */
    constructor(pCompareFunction: (itemA: TA, itemB: TB) => boolean);
    /**
     * Get differences of the two item lists.
     * @param pItemListA - Item list A.
     * @param pItemListB - Item list B.
     */
    differencesOf(pItemListA: Array<TA>, pItemListB: Array<TB>): Array<HistoryItem<TA, TB>>;
}
export declare type HistoryItemRemove<T> = {
    changeState: ChangeState.Remove;
    item: T;
};
export declare type HistoryItemInsert<T> = {
    changeState: ChangeState.Insert;
    item: T;
};
export declare type HistoryItemKeep<T> = {
    changeState: ChangeState.Keep;
    item: T;
};
export declare type HistoryItem<TA, TB> = HistoryItemRemove<TA> | HistoryItemInsert<TB> | HistoryItemKeep<TA>;
export declare enum ChangeState {
    Remove = 1,
    Insert = 2,
    Keep = 3
}
//# sourceMappingURL=difference-search.d.ts.map
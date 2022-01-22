export class DifferenceSearch<TA, TB> {
    private readonly mCompareFunction: (itemA: TA, itemB: TB) => boolean;

    /**
     * Constructor.
     * @param pCompareFunction - Compare function to compare two items.
     */
    public constructor(pCompareFunction: (itemA: TA, itemB: TB) => boolean) {
        this.mCompareFunction = pCompareFunction;
    }

    /**
     * Get differences of the two item lists.
     * @param pItemListA - Item list A.
     * @param pItemListB - Item list B.
     */
    public differencesOf(pItemListA: Array<TA>, pItemListB: Array<TB>): Array<HistoryItem<TA, TB>> {
        // Save farthest-right points with it histories.
        const lFrontierList: { [index: number]: Frontier<TA, TB>; } = { 1: { x: 0, history: [] } };

        // "Convert" Zero index to One index.
        const lOneIndex: (pId: number) => number = (pId: number): number => pId - 1;

        const lLengthA: number = pItemListA.length;
        const lLengthB: number = pItemListB.length;

        let lHistoryList: Array<HistoryItem<TA, TB>>;
        let lX: number;

        for (let lD = 0; lD < lLengthA + lLengthB + 1; lD++) {
            for (let lK = -lD; lK < lD + 1; lK += 2) {
                // Check if next move goes down or right.
                const lGoesDown: boolean = (lK === -lD || (lK !== lD && lFrontierList[lK - 1].x < lFrontierList[lK + 1].x));

                // Get starting diagonal point.
                if (lGoesDown) {
                    const lNextFrontier: Frontier<TA, TB> = lFrontierList[lK + 1];
                    lX = lNextFrontier.x;
                    lHistoryList = lNextFrontier.history;
                } else {
                    const lNextFrontier: Frontier<TA, TB> = lFrontierList[lK - 1];
                    lX = lNextFrontier.x + 1;
                    lHistoryList = lNextFrontier.history;
                }

                // Copy history list.
                lHistoryList = lHistoryList.slice();
                let lY: number = lX - lK;

                // Only start tracking history on valid track. Staring point (0,0) should not be tracked.
                if (1 <= lY && lY <= lLengthB && lGoesDown) {
                    lHistoryList.push({ changeState: ChangeState.Insert, item: pItemListB[lOneIndex(lY)] });
                } else if (1 <= lX && lX <= lLengthA) {
                    lHistoryList.push({ changeState: ChangeState.Remove, item: pItemListA[lOneIndex(lX)] });
                }

                // Move diagonal as long as possible.
                while (lX < lLengthA && lY < lLengthB && this.mCompareFunction(pItemListA[lOneIndex(lX + 1)], pItemListB[lOneIndex(lY + 1)])) {
                    lX += 1;
                    lY += 1;
                    lHistoryList.push({ changeState: ChangeState.Keep, item: pItemListA[lOneIndex(lX)] });
                }

                // Check if in the bottom right. If not save frontier.
                if (lX >= lLengthA && lY >= lLengthB) {
                    // Return found history.
                    return lHistoryList;
                } else {
                    lFrontierList[lK] = { x: lX, history: lHistoryList };
                }
            }
        }
    }
}

export type HistoryItemRemove<T> = { changeState: ChangeState.Remove, item: T; };
export type HistoryItemInsert<T> = { changeState: ChangeState.Insert, item: T; };
export type HistoryItemKeep<T> = { changeState: ChangeState.Keep, item: T; };
export type HistoryItem<TA, TB> = HistoryItemRemove<TA> | HistoryItemInsert<TB> | HistoryItemKeep<TA>;

export enum ChangeState {
    Remove = 1,
    Insert = 2,
    Keep = 3
}

type Frontier<TA, TB> = { x: number, history: Array<HistoryItem<TA, TB>>; };

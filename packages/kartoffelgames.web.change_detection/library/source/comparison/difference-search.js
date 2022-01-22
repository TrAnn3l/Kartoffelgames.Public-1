"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeState = exports.DifferenceSearch = void 0;
class DifferenceSearch {
    /**
     * Constructor.
     * @param pCompareFunction - Compare function to compare two items.
     */
    constructor(pCompareFunction) {
        this.mCompareFunction = pCompareFunction;
    }
    /**
     * Get differences of the two item lists.
     * @param pItemListA - Item list A.
     * @param pItemListB - Item list B.
     */
    differencesOf(pItemListA, pItemListB) {
        // Save farthest-right points with it histories.
        const lFrontierList = { 1: { x: 0, history: [] } };
        // "Convert" Zero index to One index.
        const lOneIndex = (pId) => pId - 1;
        const lLengthA = pItemListA.length;
        const lLengthB = pItemListB.length;
        let lHistoryList;
        let lX;
        for (let lD = 0; lD < lLengthA + lLengthB + 1; lD++) {
            for (let lK = -lD; lK < lD + 1; lK += 2) {
                // Check if next move goes down or right.
                const lGoesDown = (lK === -lD || (lK !== lD && lFrontierList[lK - 1].x < lFrontierList[lK + 1].x));
                // Get starting diagonal point.
                if (lGoesDown) {
                    const lNextFrontier = lFrontierList[lK + 1];
                    lX = lNextFrontier.x;
                    lHistoryList = lNextFrontier.history;
                }
                else {
                    const lNextFrontier = lFrontierList[lK - 1];
                    lX = lNextFrontier.x + 1;
                    lHistoryList = lNextFrontier.history;
                }
                // Copy history list.
                lHistoryList = lHistoryList.slice();
                let lY = lX - lK;
                // Only start tracking history on valid track. Staring point (0,0) should not be tracked.
                if (1 <= lY && lY <= lLengthB && lGoesDown) {
                    lHistoryList.push({ changeState: ChangeState.Insert, item: pItemListB[lOneIndex(lY)] });
                }
                else if (1 <= lX && lX <= lLengthA) {
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
                }
                else {
                    lFrontierList[lK] = { x: lX, history: lHistoryList };
                }
            }
        }
    }
}
exports.DifferenceSearch = DifferenceSearch;
var ChangeState;
(function (ChangeState) {
    ChangeState[ChangeState["Remove"] = 1] = "Remove";
    ChangeState[ChangeState["Insert"] = 2] = "Insert";
    ChangeState[ChangeState["Keep"] = 3] = "Keep";
})(ChangeState = exports.ChangeState || (exports.ChangeState = {}));
//# sourceMappingURL=difference-search.js.map
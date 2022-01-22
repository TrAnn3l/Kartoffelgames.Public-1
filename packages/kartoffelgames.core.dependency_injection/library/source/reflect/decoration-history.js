"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecorationHistory = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
class DecorationHistory {
    /**
     * Add an decoration history.
     * @param pFromConstructor - Previous constructor.
     * @param pToConstructor - Changed / next construtor.
     */
    static addHistory(pFromConstructor, pToConstructor) {
        DecorationHistory.mBackwardHistory.add(pToConstructor, pFromConstructor);
    }
    /**
     * The a history starting from the specified constructor and ending on the original undecorated constructor.
     * @param pConstructor - Constructor where the search should begin.
     */
    static getBackwardHistoryOf(pConstructor) {
        // Create history and add starting constructor.
        const lHistory = new Array();
        lHistory.push(pConstructor);
        // Iterate over history as long as history can't go back.
        let lNextEntry = pConstructor;
        while (typeof (lNextEntry = DecorationHistory.mBackwardHistory.get(lNextEntry)) !== 'undefined') {
            lHistory.push(lNextEntry);
        }
        return lHistory;
    }
}
exports.DecorationHistory = DecorationHistory;
DecorationHistory.mBackwardHistory = new core_data_1.Dictionary();
//# sourceMappingURL=decoration-history.js.map
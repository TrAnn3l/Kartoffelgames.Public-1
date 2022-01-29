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
     * Get the root constructor of decoration history.
     * @param pConstructor - Constructor with decorations.
     */
    static getRootOf(pConstructor) {
        // Iterate over history as long as history can't go back.
        let lNextEntry = pConstructor;
        while (DecorationHistory.mBackwardHistory.has(lNextEntry)) {
            lNextEntry = DecorationHistory.mBackwardHistory.get(lNextEntry);
        }
        return lNextEntry;
    }
}
exports.DecorationHistory = DecorationHistory;
DecorationHistory.mBackwardHistory = new core_data_1.Dictionary();
//# sourceMappingURL=decoration-history.js.map
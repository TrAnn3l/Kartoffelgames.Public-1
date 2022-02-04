"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopError = exports.LoopDetectionHandler = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const web_change_detection_1 = require("@kartoffelgames/web.change-detection");
class LoopDetectionHandler {
    /**
     * Constructor.
     */
    constructor(pMaxStackSize) {
        this.mCurrentUpdateChain = new core_data_1.List();
        this.mMaxStackSize = pMaxStackSize;
    }
    /**
     * Calls function asynchron. Checks for loops and
     * Throws error if stack overflows.
     * @param pReason - Stack reason.
     */
    callAsynchron(pFunction, pReason) {
        if (!this.mInsideCall) {
            this.mInsideCall = true;
            // Create and expand call stack.
            this.mCurrentUpdateChain.push(pReason);
            const lUpdateFunction = () => {
                // Set component to not updating so new changes doesn't get ignnored.
                this.mInsideCall = false;
                const lLastLength = this.mCurrentUpdateChain.length;
                // Call function after saving last chain length.
                // If no update was made on this call, the length will be the same after. 
                pFunction();
                // Clear update chain list if no other update in this cycle was triggered.
                if (lLastLength === this.mCurrentUpdateChain.length) {
                    this.mCurrentUpdateChain.clear();
                }
                else if (this.mCurrentUpdateChain.length > this.mMaxStackSize) {
                    // Throw if too many updates were chained. 
                    throw new LoopError('Update loop detected', this.mCurrentUpdateChain);
                }
            };
            // Update on next frame. 
            // Do not call change detection on requestAnimationFrame.
            this.mNextUpdateCycle = web_change_detection_1.ChangeDetection.currentNoneSilent.silentExecution(window.requestAnimationFrame, () => {
                try {
                    // Call function. User can decide on none silent zone inside function.
                    lUpdateFunction();
                }
                catch (pException) {
                    // Cancel update next update cycle.
                    window.cancelAnimationFrame(this.mNextUpdateCycle);
                    throw pException;
                }
            });
        }
    }
}
exports.LoopDetectionHandler = LoopDetectionHandler;
class LoopError {
    /**
     * Constructor.
     * Create loop error.
     * @param pMessage - Error Message.
     * @param pChain - Current update chain.
     */
    constructor(pMessage, pChain) {
        this.message = pMessage;
        this.chain = pChain;
    }
}
exports.LoopError = LoopError;
//# sourceMappingURL=loop-detection-handler.js.map
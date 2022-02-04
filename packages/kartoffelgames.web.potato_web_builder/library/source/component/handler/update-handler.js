"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHandler = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const web_change_detection_1 = require("@kartoffelgames/web.change-detection");
const update_scope_1 = require("../../enum/update-scope");
const loop_detection_handler_1 = require("./loop-detection-handler");
class UpdateHandler {
    /**
     * Constructor.
     * @param pUpdateScope - Update scope.
     */
    constructor(pUserObjectHandler, pUpdateScope) {
        this.mUpdateScope = pUpdateScope;
        this.mUpdateListener = new core_data_1.List();
        this.mEnabled = false;
        this.mUpdateWaiter = new core_data_1.List();
        this.mLoopDetectionHandler = new loop_detection_handler_1.LoopDetectionHandler(10);
        this.mUserObjectHandler = pUserObjectHandler;
        // Create new change detection if component is not inside change detection or mode is capsuled.
        if (!web_change_detection_1.ChangeDetection.current || this.mUpdateScope === update_scope_1.UpdateScope.Capsuled) {
            this.mChangeDetection = new web_change_detection_1.ChangeDetection('DefaultComponentZone');
        }
        else if (this.mUpdateScope === update_scope_1.UpdateScope.Manual) {
            // Manual zone outside every other zone.
            this.mChangeDetection = new web_change_detection_1.ChangeDetection('Manual Zone', null, true);
        }
        else {
            this.mChangeDetection = web_change_detection_1.ChangeDetection.currentNoneSilent;
        }
        // Add listener for changes inside change detection.
        if (this.mUpdateScope !== update_scope_1.UpdateScope.Manual) {
            this.mChangeDetectionListener = (pReason) => { this.sheduleUpdate(pReason); };
            this.mChangeDetection.addChangeListener(this.mChangeDetectionListener);
        }
    }
    /**
     * Get enabled state of update handler.
     * Does not report any updates on disabled state.
     */
    get enabled() {
        return this.mEnabled;
    }
    /**
     * Get enabled state of update handler.
     * Does not report any updates on disabled state.
     */
    set enabled(pEnabled) {
        this.mEnabled = pEnabled;
    }
    /**
     * Listen for updates.
     * @param pListener - Listener.
     */
    addUpdateListener(pListener) {
        this.mUpdateListener.push(pListener);
    }
    /**
     * Deconstruct update handler.
     */
    deconstruct() {
        // Disconnect from change listener. Does nothing if listener is not defined.
        this.mChangeDetection.removeChangeListener(this.mChangeDetectionListener);
        // Remove all update listener.
        this.mUpdateListener.clear();
        // Disable handling.
        this.enabled = false;
    }
    /**
     * Execute function inside update detection scope.
     * @param pFunction - Function.
     */
    execute(pFunction) {
        this.mChangeDetection.execute(pFunction);
    }
    /**
     * Shedule forced manual update.
     * @param pReason - Update reason.
     */
    forceUpdate(pReason) {
        this.sheduleUpdate(pReason);
        // Request update to dispatch change events on other components.
        this.requestUpdate(pReason);
    }
    /**
     * Register object and pass on update events.
     * @param pObject - Object.
     */
    registerObject(pObject) {
        return this.mChangeDetection.registerObject(pObject);
    }
    /**
     * Request update.
     * @param pReason
     */
    requestUpdate(pReason) {
        this.mChangeDetection.dispatchChangeEvent(pReason);
    }
    /**
     * Wait for the component update.
     * Returns Promise<false> if there is currently no update cycle.
     */
    async waitForUpdate() {
        if (this.mUpdateSheduled) {
            // Add new callback to waiter line.
            return new Promise((pResolve) => {
                this.mUpdateWaiter.push(() => {
                    // Is resolved when all data were updated.
                    pResolve(true);
                });
            });
        }
        else {
            return false;
        }
    }
    /**
     * Call all update listener.
     */
    dispatchUpdateListener(pReason) {
        // Trigger all update listener and check if any updates happened.
        let lChanges = false;
        for (const lListener of this.mUpdateListener) {
            lChanges = lListener.bind(this, pReason) || lChanges;
        }
        return lChanges;
    }
    /**
     * Update component parts that used the property.
     */
    sheduleUpdate(pReason) {
        if (!this.enabled) {
            return;
        }
        // Set update handler into update sheduled mode.
        this.mUpdateSheduled = true;
        this.mLoopDetectionHandler.callAsynchron(() => {
            this.mChangeDetection.execute(() => {
                // Call user class on update function.
                this.mUserObjectHandler.callOnPwbUpdate();
                // Outside update before actual update happens.
                this.mUpdateSheduled = false;
                // Update component and get if any update was made.
                const lHasUpdated = this.dispatchUpdateListener(pReason);
                // Release all update waiter
                for (const lUpdateWaiter of this.mUpdateWaiter) {
                    lUpdateWaiter();
                }
                this.mUpdateWaiter.clear();
                // Call user class on update function if any update was made.
                if (lHasUpdated) {
                    this.mUserObjectHandler.callAfterPwbUpdate();
                }
            });
        }, pReason);
    }
}
exports.UpdateHandler = UpdateHandler;
//# sourceMappingURL=update-handler.js.map
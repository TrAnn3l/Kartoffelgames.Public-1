"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentEventEmitter = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
/**
 * Event emitter.
 * Use in combination with @HtmlComponentEvent.
 */
class ComponentEventEmitter {
    /**
     * Constructor.
     * Initialize lists.
     */
    constructor() {
        this.mListener = new core_data_1.List();
    }
    /**
     * Add event listener to event.
     * @param pCallback - Event callback.
     */
    addListener(pCallback) {
        // Add callback to listener if not already included.
        if (!this.mListener.includes(pCallback)) {
            this.mListener.push(pCallback);
        }
    }
    /**
     * Call all event listener with event arguments.
     * @param pEventArgs - Event arguments.
     */
    dispatchEvent(pEventArgs) {
        // Call all listener.
        for (const lListener of this.mListener) {
            lListener.call(null, pEventArgs);
        }
    }
    /**
     * Remove event listener from event.
     * @param pCallback - Event callback.
     */
    removeListener(pCallback) {
        this.mListener.remove(pCallback);
    }
}
exports.ComponentEventEmitter = ComponentEventEmitter;
//# sourceMappingURL=component-event-emitter.js.map
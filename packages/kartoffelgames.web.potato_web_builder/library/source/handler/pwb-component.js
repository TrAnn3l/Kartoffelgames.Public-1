"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PwbComponent = void 0;
class PwbComponent {
    /**
     * Constructor.
     * @param pComponentHandler - Component handler.
     */
    constructor(pComponentHandler, pElement) {
        this.mComponentHandler = pComponentHandler;
        this.mComponentElement = pElement;
    }
    /**
     * Get raw html element of component.
     */
    get componentElement() {
        return this.mComponentElement;
    }
    /**
     * Send an error to the global error handler.
     * @param pError - Error.
     */
    sendError(pError) {
        this.mComponentHandler.sendError(pError);
    }
    /**
     * Update component manually.
     */
    update() {
        // Dispatch change event for other components.
        this.mComponentHandler.changeDetection.dispatchChangeEvent({
            source: this.mComponentElement.component.userClassObject,
            property: Symbol('manual update'),
            stacktrace: Error().stack
        });
        // Call update component just in case of manual updating.
        this.mComponentHandler.updateComponent({
            source: this.mComponentElement.component.userClassObject,
            property: Symbol('manual update'),
            stacktrace: Error().stack
        });
    }
}
exports.PwbComponent = PwbComponent;
//# sourceMappingURL=pwb-component.js.map
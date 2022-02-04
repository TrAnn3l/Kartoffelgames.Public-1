"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PwbComponent = void 0;
class PwbComponent {
    /**
     * Constructor.
     * @param pComponentHandler - Component handler.
     */
    constructor(pComponentHandler) {
        this.mComponentManager = pComponentHandler;
    }
    /**
     * Get raw html element of component.
     */
    get componentElement() {
        return this.mComponentManager.elementHandler.htmlElement;
    }
    /**
     * Update component manually.
     */
    update() {
        // Call update component just in case of manual updating.
        this.mComponentManager.updateHandler.forceUpdate({
            source: this.mComponentManager.userObjectHandler.userObject,
            property: Symbol('manual update'),
            stacktrace: Error().stack
        });
    }
}
exports.PwbComponent = PwbComponent;
//# sourceMappingURL=pwb-component.js.map
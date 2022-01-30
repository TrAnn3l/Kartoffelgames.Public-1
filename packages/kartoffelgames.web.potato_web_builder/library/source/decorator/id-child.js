"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdChild = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
/**
 * AtScript. Id child
 * @param pIdChildName - Name of id child.
 */
function IdChild(pIdChildName) {
    return (pTarget, pPropertyKey) => {
        // Check if real decorator on static property.
        if (typeof pTarget === 'function') {
            throw new core_data_1.Exception('Event target is not for an instanced property.', IdChild);
        }
        // Define getter accessor that returns id child.
        Object.defineProperty(pTarget, pPropertyKey, {
            get() {
                const lIdChild = this.componentHandler.rootValues.getTemporaryValue(pIdChildName);
                if (lIdChild instanceof Element) {
                    return lIdChild;
                }
                else {
                    throw new core_data_1.Exception(`Can't find IdChild "${pIdChildName}".`, this);
                }
            }
        });
    };
}
exports.IdChild = IdChild;
//# sourceMappingURL=id-child.js.map
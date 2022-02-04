"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdChild = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const component_connection_1 = require("../component/component-connection");
/**
 * AtScript. Id child
 * @param pIdChildName - Name of id child.
 */
function IdChild(pIdChildName) {
    return (pTarget, pPropertyKey) => {
        // Check if real decorator on static property.
        if (typeof pTarget === 'function') {
            throw new core_data_1.Exception('Event target is not for a static property.', IdChild);
        }
        // Define getter accessor that returns id child.
        Object.defineProperty(pTarget, pPropertyKey, {
            get() {
                const lIdChild = component_connection_1.ComponentConnection.componentManagerOf(this).rootValues.getValue(pIdChildName);
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
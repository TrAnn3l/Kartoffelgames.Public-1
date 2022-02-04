"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleManipulatorResult = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
/**
 * Results for html manipulator attribute module.
 */
class ModuleManipulatorResult {
    /**
     * Constructor.
     * Initialize new html manipulator attribute module result.
     */
    constructor() {
        // Initialize list.
        this.mElementList = new Array();
    }
    /**
     * Get list of created elements.
     */
    get elementList() {
        return core_data_1.List.newListWith(...this.mElementList);
    }
    /**
     * Add new element to result.
     * @param pTemplateElement - New template element. Can't use same template for multiple elements.
     * @param pValues - New Value handler of element with current value handler as parent.
     */
    addElement(pTemplateElement, pValues) {
        // Check if value or temple is used in another element.
        const lDoubledIndex = this.mElementList.findIndex(pElement => {
            return pElement.template === pTemplateElement || pElement.componentValues === pValues;
        });
        // Do not allow double use of template or value handler.
        if (lDoubledIndex === -1) {
            this.mElementList.push({ template: pTemplateElement, componentValues: pValues });
        }
        else {
            throw new core_data_1.Exception("Can't add same template or value handler for multiple Elements.", this);
        }
    }
}
exports.ModuleManipulatorResult = ModuleManipulatorResult;
//# sourceMappingURL=module-manipulator-result.js.map
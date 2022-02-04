"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayerValues = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const component_manager_1 = require("../component-manager");
/**
 * Interface between persistent values directly from component and temporary values
 * that are not directly inside the component but attached to it.
 *
 * Simple access for all value types: TemporaryValue, IdChild and UserClassValue.
 * has-, get-, set-, remove-.
 */
class LayerValues {
    /**
     * Constructor.
     * New component value layer.
     * @param pParentLayer - Parent layer. ComponentManager on root layer.
     */
    constructor(pParentLayer) {
        this.mTemporaryValues = new core_data_1.Dictionary();
        if (pParentLayer instanceof component_manager_1.ComponentManager) {
            this.mParentLayer = null;
            this.mComponentManager = pParentLayer;
        }
        else {
            this.mParentLayer = pParentLayer;
            this.mComponentManager = pParentLayer.componentManager;
        }
    }
    /**
     * Component manager connected with layer value.
     */
    get componentManager() {
        return this.mComponentManager;
    }
    /**
     * Get all keys of temorary values.
     */
    get temporaryValuesList() {
        const lKeyList = this.mTemporaryValues.map((pKey) => pKey);
        // Get key list from parent.
        if (this.mParentLayer) {
            lKeyList.push(...this.mParentLayer.temporaryValuesList);
        }
        return lKeyList;
    }
    /**
     * Check for changes into two value handler.
     * @param pHandler - Handler two.
     */
    equal(pHandler) {
        const lTemporaryValuesOne = this.temporaryValuesList;
        const lTemporaryValuesTwo = pHandler.temporaryValuesList;
        // Compare if it has the same user class object.
        if (this.componentManager.userObjectHandler.userObject !== pHandler.componentManager.userObjectHandler.userObject) {
            return false;
        }
        // Compare length of temporary values.
        if (lTemporaryValuesOne.length !== lTemporaryValuesTwo.length) {
            return false;
        }
        // Check for temporary values differences from one to two.
        for (const lTemporaryValueOneKey of lTemporaryValuesOne) {
            // Check for difference.
            if (this.getValue(lTemporaryValueOneKey) !== pHandler.getValue(lTemporaryValueOneKey)) {
                return false;
            }
        }
        // Check for temporary values differences from two to one.
        for (const lTemporaryValueTwoKey of lTemporaryValuesTwo) {
            // Check for difference.
            if (pHandler.getValue(lTemporaryValueTwoKey) !== this.getValue(lTemporaryValueTwoKey)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Gets the html element specified temporary value.
     * @param pValueName - Name of value.
     */
    getValue(pValueName) {
        let lValue = this.mTemporaryValues.get(pValueName);
        // If value was not found and parent exists, search in parent values.
        if (!lValue && this.mParentLayer) {
            lValue = this.mParentLayer.getValue(pValueName);
        }
        return lValue;
    }
    /**
     * Remove temporary value from this layer.
     * @param pValueName - Name of value.
     */
    removeLayerValue(pValueName) {
        // Remove value from html element.
        this.mTemporaryValues.delete(pValueName);
    }
    /**
     * Add or replaces temporary value in this manipulator scope.
     * @param pKey - Key of value.
     * @param pValue - Value.
     */
    setLayerValue(pKey, pValue) {
        // Set value to current layer.
        this.mTemporaryValues.set(pKey, pValue);
    }
    /**
     * Set value to root. All child can access this value.
     * @param pKey - Value key.
     * @param pValue - Value.
     */
    setRootValue(pKey, pValue) {
        this.mComponentManager.rootValues.setLayerValue(pKey, pValue);
    }
}
exports.LayerValues = LayerValues;
//# sourceMappingURL=layer-values.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareHandler = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const interaction_detection_proxy_1 = require("../change_detection/synchron_tracker/interaction-detection-proxy");
/**
 * Handler for comparing different values.
 */
class CompareHandler {
    /**
     * Constructor.
     * Create Compare that deep compares values up to specified depth.
     * @param pValue - Current value.
     * @param pMaxComparisonDepth - [Default: 4]. Maximal depth for object and array comparison.
     */
    constructor(pValue, pMaxComparisonDepth = 4) {
        // Get original value to trigger no proxy change detection.
        const lOriginalValue = interaction_detection_proxy_1.InteractionDetectionProxy.getOriginal(pValue);
        this.mCompareMemory = new core_data_1.Dictionary();
        this.mCloneMemory = new core_data_1.Dictionary();
        this.mMaxDepth = pMaxComparisonDepth;
        this.mCurrentValue = this.cloneValue(lOriginalValue, 0);
    }
    /**
     * Compare value with internal value.
     * @param pValue - New value.
     */
    compare(pValue) {
        // Get original value to trigger no proxy change detection.
        const lOriginalNewValue = interaction_detection_proxy_1.InteractionDetectionProxy.getOriginal(pValue);
        // Compare value.
        const lCompareResult = this.compareValue(lOriginalNewValue, this.mCurrentValue, 0);
        // Clear compare memory.
        this.mCompareMemory.clear();
        return lCompareResult;
    }
    /**
     * Compares the last value and the new value.
     * If the new value has changed, the last value is overriden with the new one.
     * @param pNewValue - New value.
     * @returns is the last and the new value are the same.
     */
    compareAndUpdate(pNewValue) {
        // Compare
        const lIsSame = this.compare(pNewValue);
        // Update only if value is not the same.
        if (!lIsSame) {
            this.update(pNewValue);
        }
        return lIsSame;
    }
    /**
     * Update internal value.
     * Clones value.
     * @param pValue - New Value.
     */
    update(pValue) {
        // Get original value to trigger no proxy change detection.
        const lOriginalNewValue = interaction_detection_proxy_1.InteractionDetectionProxy.getOriginal(pValue);
        this.mCurrentValue = this.cloneValue(lOriginalNewValue, 0);
        // Clear clone memory.
        this.mCloneMemory.clear();
    }
    /**
     * Depp clone array. Till max depth is reached.
     * @param pValue - Array.
     * @param pCurrentDepth - Current depth of cloning.
     * @returns deep cloned array.
     */
    cloneArray(pValue, pCurrentDepth) {
        const lClonedArray = new Array();
        // Do not clone nested parent values again.
        // Fails for a fraction of cases.
        if (this.mCloneMemory.has(pValue)) {
            return this.mCloneMemory.get(pValue);
        }
        else {
            this.mCloneMemory.set(pValue, lClonedArray);
        }
        // Clone items only if max depth not reached.
        if (pCurrentDepth < this.mMaxDepth) {
            for (const lItem of pValue) {
                lClonedArray.push(this.cloneValue(lItem, pCurrentDepth + 1));
            }
        }
        return lClonedArray;
    }
    /**
     * Depp clone object. Till max depth is reached.
     * @param pValue - Object.
     * @param pCurrentDepth - Current depth of cloning.
     * @returns deep cloned object.
     */
    cloneObject(pValue, pCurrentDepth) {
        const lObjectClone = {};
        // Do not clone nested parent values again.
        // Fails for a fraction of cases.
        if (this.mCloneMemory.has(pValue)) {
            return this.mCloneMemory.get(pValue);
        }
        else {
            this.mCloneMemory.set(pValue, lObjectClone);
        }
        // Clone items only if max depth not reached.
        if (pCurrentDepth < this.mMaxDepth) {
            for (const lKey in pValue) {
                lObjectClone[lKey] = this.cloneValue(pValue[lKey], pCurrentDepth + 1);
            }
        }
        return lObjectClone;
    }
    /**
     * Deep clone value till max depth is reached.
     * @param pValue - Value to clone.
     * @param pCurrentDepth - Current depth of cloning.
     * @returns cloned value. Does not clone instances ot functions.
     */
    cloneValue(pValue, pCurrentDepth) {
        // Check if value is object.
        if (typeof pValue === 'object' && pValue !== null) {
            if (Array.isArray(pValue)) {
                return this.cloneArray(pValue, pCurrentDepth);
            }
            else { // Is object
                // Don't clone html elements.
                if (pValue instanceof Node) {
                    return pValue;
                }
                else {
                    return this.cloneObject(pValue, pCurrentDepth);
                }
            }
        }
        else if (typeof pValue === 'function') {
            return pValue;
        }
        else {
            // return simple value. Number, String, Function, Boolean, Undefined.
            return pValue;
        }
    }
    /**
     * Compare two arrays and their keys.
     * @param pNewValue - New value.
     * @param pLastValue - Old saved value.
     * @param pCurrentDepth - Current depth of comparison.
     * @returns if arrays are same.
     */
    compareArray(pNewValue, pLastValue, pCurrentDepth) {
        // Check same item count.
        if (pNewValue.length !== pLastValue.length) {
            return false;
        }
        // Do not compare nested parent values again.
        // Fails for a fraction of cases.
        if (this.mCompareMemory.has(pNewValue)) {
            return true;
        }
        else {
            this.mCompareMemory.set(pNewValue, true);
        }
        // Compare each key.
        for (let lIndex = 0; lIndex < pNewValue.length; lIndex++) {
            if (!this.compareValue(pNewValue[lIndex], pLastValue[lIndex], pCurrentDepth + 1)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Compare two objects and their keys.
     * @param pNewValue - New value.
     * @param pLastValue - Old saved value.
     * @param pCurrentDepth - Current depth of comparison.
     * @returns if object are same.
     */
    compareObject(pNewValue, pLastValue, pCurrentDepth) {
        // Check same property count.
        if (Object.keys(pNewValue).length !== Object.keys(pLastValue).length) {
            return false;
        }
        // Ignore HTMLElements.
        if (pNewValue instanceof Node || pLastValue instanceof Node) {
            return pNewValue === pLastValue;
        }
        // Do not compare nested parent values again.
        // Fails for a fraction of cases.
        if (this.mCompareMemory.has(pNewValue)) {
            return true;
        }
        else {
            this.mCompareMemory.set(pNewValue, true);
        }
        // Compare each key.
        for (const lKey in pNewValue) {
            if (!this.compareValue(pNewValue[lKey], pLastValue[lKey], pCurrentDepth + 1)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Compare two values and return if they are the same.
     * @param lOriginalNewValue - New value.
     * @param lOriginalCurrentValue - Old saved value.
     * @param pCurrentDepth - Current depth of comparison.
     * @returns if object are same.
     */
    compareValue(pNewValue, pLastValue, pCurrentDepth) {
        // Check type.
        if (typeof pNewValue !== typeof pLastValue || pNewValue === null && pLastValue !== null || pNewValue !== null && pLastValue === null) {
            return false;
        }
        // Check if both are simple or object values.
        if (typeof pNewValue === 'object' && pNewValue !== null) {
            if (Array.isArray(pNewValue)) {
                // Check if both are arrays.
                if (!Array.isArray(pLastValue)) {
                    return false;
                }
                // Only proceed if max depth not reached.
                if (pCurrentDepth < this.mMaxDepth) {
                    return this.compareArray(pNewValue, pLastValue, pCurrentDepth);
                }
                else {
                    return true;
                }
            }
            else { // Is object
                // Check if both are not arrays..
                if (Array.isArray(pLastValue)) {
                    return false;
                }
                // Only proceed if max depth not reached.
                if (pCurrentDepth < this.mMaxDepth) {
                    return this.compareObject(pNewValue, pLastValue, pCurrentDepth);
                }
                else {
                    return true;
                }
            }
        }
        else if (typeof pNewValue === 'function') {
            return pNewValue === pLastValue;
        }
        else {
            // Check simple value. Number, String, Function, Boolean, Undefined.
            return pNewValue === pLastValue;
        }
    }
}
exports.CompareHandler = CompareHandler;
//# sourceMappingURL=compare-handler.js.map
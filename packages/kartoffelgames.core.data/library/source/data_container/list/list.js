"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
/**
 * Extended array functionality.
 */
class List extends Array {
    /**
     * Create list and add items.
     * @param pItemList - Items.
     */
    static newListWith(...pItemList) {
        const lNewList = new List();
        lNewList.push(...pItemList);
        return lNewList;
    }
    /**
     * Clear list.
     */
    clear() {
        this.splice(0, this.length);
    }
    /**
     * Copy first layer of object.
     */
    clone() {
        return List.newListWith(...this);
    }
    /**
     * Distinct values inside list.
     */
    distinct() {
        const lSelf = this;
        // Get all values where index is same index as first index of first appearance.
        const lDistinctArray = this.filter((pValue, pIndex) => {
            return lSelf.indexOf(pValue) === pIndex;
        });
        return List.newListWith(...lDistinctArray);
    }
    /**
     * Check if arrays are the same.
     * @param pArray - Array.
     */
    equals(pArray) {
        // Check if array are same, dont null and have same length.
        if (this === pArray) {
            return true;
        }
        else if (!pArray || this.length !== pArray.length) {
            return false;
        }
        // Check each item.
        for (let lIndex = 0; lIndex < this.length; ++lIndex) {
            if (this[lIndex] !== pArray[lIndex]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Removes the first appearence of value.
     * @param pValue - value requested for removement.
     */
    remove(pValue) {
        const lFoundIndex = this.indexOf(pValue);
        // Only remove if found.
        if (lFoundIndex !== -1) {
            return this.splice(lFoundIndex, 1)[0];
        }
        return undefined;
    }
    /**
     * Replace first appearence of value.
     * @param pOldValue - Target value to replace.
     * @param pNewValue - Replacement value.
     */
    replace(pOldValue, pNewValue) {
        const lFoundIndex = this.indexOf(pOldValue);
        // Only replace if found.
        if (lFoundIndex !== -1) {
            // Save old value and replace it with new value.
            const lOldValue = this[lFoundIndex];
            this[lFoundIndex] = pNewValue;
            return lOldValue;
        }
        return undefined;
    }
    /**
     * List to string.
     */
    toString() {
        return `[${super.join(', ')}]`;
    }
}
exports.List = List;
//# sourceMappingURL=list.js.map
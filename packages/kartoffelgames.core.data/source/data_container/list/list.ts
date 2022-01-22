import { ICloneable } from '../../interface/i-cloneable';

/**
 * Extended array functionality.
 */
export class List<T> extends Array<T> implements ICloneable<List<T>> {
    /**
     * Create list and add items.
     * @param pItemList - Items.
     */
    public static newListWith<T>(...pItemList: Array<T>): List<T> {
        const lNewList: List<T> = new List<T>();
        lNewList.push(...pItemList);

        return lNewList;
    }

    /**
     * Clear list.
     */
    public clear(): void {
        this.splice(0, this.length);
    }

    /**
     * Copy first layer of object.
     */
    public clone(): List<T> {
        return List.newListWith(...this);
    }

    /**
     * Distinct values inside list.
     */
    public distinct(): List<T> {
        const lSelf: this = this;

        // Get all values where index is same index as first index of first appearance.
        const lDistinctArray: Array<T> = this.filter((pValue, pIndex) => {
            return lSelf.indexOf(pValue) === pIndex;
        });

        return List.newListWith(...lDistinctArray);
    }

    /**
     * Check if arrays are the same.
     * @param pArray - Array.
     */
    public equals(pArray: Array<unknown>): boolean {
        // Check if array are same, dont null and have same length.
        if (this === pArray) {
            return true;
        } else if (!pArray || this.length !== pArray.length) {
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
    public remove(pValue: T): T | undefined {
        const lFoundIndex: number = this.indexOf(pValue);

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
    public replace(pOldValue: T, pNewValue: T): T {
        const lFoundIndex: number = this.indexOf(pOldValue);

        // Only replace if found.
        if (lFoundIndex !== -1) {
            // Save old value and replace it with new value.
            const lOldValue: T = this[lFoundIndex];
            this[lFoundIndex] = pNewValue;

            return lOldValue;
        }

        return undefined;
    }

    /**
     * List to string.
     */
    public toString(): string {
        return `[${super.join(', ')}]`;
    }
}
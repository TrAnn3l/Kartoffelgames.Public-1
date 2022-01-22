import { ICloneable } from '../../interface/i-cloneable';
/**
 * Extended array functionality.
 */
export declare class List<T> extends Array<T> implements ICloneable<List<T>> {
    /**
     * Create list and add items.
     * @param pItemList - Items.
     */
    static newListWith<T>(...pItemList: Array<T>): List<T>;
    /**
     * Clear list.
     */
    clear(): void;
    /**
     * Copy first layer of object.
     */
    clone(): List<T>;
    /**
     * Distinct values inside list.
     */
    distinct(): List<T>;
    /**
     * Check if arrays are the same.
     * @param pArray - Array.
     */
    equals(pArray: Array<unknown>): boolean;
    /**
     * Removes the first appearence of value.
     * @param pValue - value requested for removement.
     */
    remove(pValue: T): T | undefined;
    /**
     * Replace first appearence of value.
     * @param pOldValue - Target value to replace.
     * @param pNewValue - Replacement value.
     */
    replace(pOldValue: T, pNewValue: T): T;
    /**
     * List to string.
     */
    toString(): string;
}
//# sourceMappingURL=list.d.ts.map
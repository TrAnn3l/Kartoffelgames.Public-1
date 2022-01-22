/**
 * Handler for comparing different values.
 */
export declare class CompareHandler<TValue> {
    private readonly mCloneMemory;
    private readonly mCompareMemory;
    private mCurrentValue;
    private readonly mMaxDepth;
    /**
     * Constructor.
     * Create Compare that deep compares values up to specified depth.
     * @param pValue - Current value.
     * @param pMaxComparisonDepth - [Default: 4]. Maximal depth for object and array comparison.
     */
    constructor(pValue: TValue, pMaxComparisonDepth?: number);
    /**
     * Compare value with internal value.
     * @param pValue - New value.
     */
    compare(pValue: TValue): boolean;
    /**
     * Compares the last value and the new value.
     * If the new value has changed, the last value is overriden with the new one.
     * @param pNewValue - New value.
     * @returns is the last and the new value are the same.
     */
    compareAndUpdate(pNewValue: TValue): boolean;
    /**
     * Update internal value.
     * Clones value.
     * @param pValue - New Value.
     */
    update(pValue: TValue): void;
    /**
     * Depp clone array. Till max depth is reached.
     * @param pValue - Array.
     * @param pCurrentDepth - Current depth of cloning.
     * @returns deep cloned array.
     */
    private cloneArray;
    /**
     * Depp clone object. Till max depth is reached.
     * @param pValue - Object.
     * @param pCurrentDepth - Current depth of cloning.
     * @returns deep cloned object.
     */
    private cloneObject;
    /**
     * Deep clone value till max depth is reached.
     * @param pValue - Value to clone.
     * @param pCurrentDepth - Current depth of cloning.
     * @returns cloned value. Does not clone instances ot functions.
     */
    private cloneValue;
    /**
     * Compare two arrays and their keys.
     * @param pNewValue - New value.
     * @param pLastValue - Old saved value.
     * @param pCurrentDepth - Current depth of comparison.
     * @returns if arrays are same.
     */
    private compareArray;
    /**
     * Compare two objects and their keys.
     * @param pNewValue - New value.
     * @param pLastValue - Old saved value.
     * @param pCurrentDepth - Current depth of comparison.
     * @returns if object are same.
     */
    private compareObject;
    /**
     * Compare two values and return if they are the same.
     * @param lOriginalNewValue - New value.
     * @param lOriginalCurrentValue - Old saved value.
     * @param pCurrentDepth - Current depth of comparison.
     * @returns if object are same.
     */
    private compareValue;
}
//# sourceMappingURL=compare-handler.d.ts.map
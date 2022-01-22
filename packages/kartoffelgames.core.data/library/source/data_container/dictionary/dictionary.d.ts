/**
 * Default dictionary.
 */
export declare class Dictionary<TKey, TValue> extends Map<TKey, TValue> {
    /**
     * Add value and key to dictionary.
     * @param pKey - Key of item.
     * @param pValue - value of item.
     */
    add(pKey: TKey, pValue: TValue): void;
    /**
     * Get all keys that have the set value.
     * @param pValue - Value.
     */
    getAllKeysOfValue(pValue: TValue): Array<TKey>;
    /**
     * Get item of dictionary. If key does not exists the default value gets returned.
     * @param pKey - key of item.
     * @param pDefault - Default value if key was not found.
     */
    getOrDefault(pKey: TKey, pDefault: TValue): TValue;
    /**
     * Maps information into new list.
     * @param pFunction - Mapping funktion.
     */
    map<T>(pFunction: (pKey: TKey, pValue: TValue) => T): Array<T>;
}
//# sourceMappingURL=dictionary.d.ts.map
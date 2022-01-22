"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
const list_1 = require("../list/list");
const exception_1 = require("../../exception/exception");
/**
 * Default dictionary.
 */
class Dictionary extends Map {
    /**
     * Add value and key to dictionary.
     * @param pKey - Key of item.
     * @param pValue - value of item.
     */
    add(pKey, pValue) {
        // Add value and key to containers.
        if (!this.has(pKey)) {
            this.set(pKey, pValue);
        }
        else {
            throw new exception_1.Exception("Can't add dublicate key to dictionary.", this);
        }
    }
    /**
     * Get all keys that have the set value.
     * @param pValue - Value.
     */
    getAllKeysOfValue(pValue) {
        // Add entires iterator to list and filter for pValue = Value
        const lKeyValuesWithValue = list_1.List.newListWith(...this.entries()).filter((pItem) => {
            return pItem[1] === pValue;
        });
        // Get only keys of key values.
        const lKeysOfKeyValue = lKeyValuesWithValue.map((pItem) => {
            return pItem[0];
        });
        return lKeysOfKeyValue;
    }
    /**
     * Get item of dictionary. If key does not exists the default value gets returned.
     * @param pKey - key of item.
     * @param pDefault - Default value if key was not found.
     */
    getOrDefault(pKey, pDefault) {
        if (this.has(pKey)) {
            return this.get(pKey);
        }
        else {
            return pDefault;
        }
    }
    /**
     * Maps information into new list.
     * @param pFunction - Mapping funktion.
     */
    map(pFunction) {
        const lResultList = new list_1.List();
        for (const lKeyValuePair of this) {
            // Execute callback and add result to list.
            const lMappingResult = pFunction(lKeyValuePair[0], lKeyValuePair[1]);
            lResultList.push(lMappingResult);
        }
        return lResultList;
    }
}
exports.Dictionary = Dictionary;
//# sourceMappingURL=dictionary.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumUtil = void 0;
/**
 * Enumaration helper.
 */
class EnumUtil {
    /**
     * Return all values of an enum as array.
     * @param pEnum - typeof Enum object.
     */
    static enumNamesToArray(pEnum) {
        // Convert enum to array.
        const lResultArray = Object.values(pEnum);
        return lResultArray.slice(0, lResultArray.length / 2);
    }
    /**
     * Return all values of an enum as array.
     * @param pEnum - typeof Enum object.
     */
    static enumValuesToArray(pEnum) {
        // Convert enum to array.
        const lResultArray = Object.values(pEnum);
        return lResultArray.slice(lResultArray.length / 2);
    }
}
exports.EnumUtil = EnumUtil;
//# sourceMappingURL=enum-util.js.map
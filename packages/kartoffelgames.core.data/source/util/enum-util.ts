/**
 * Enumaration helper.
 */
export class EnumUtil {
    /**
     * Return all values of an enum as array.
     * @param pEnum - typeof Enum object.
     */
    public static enumNamesToArray<T>(pEnum: object): Array<T> {
        // Convert enum to array.
        const lResultArray: Array<T> = Object.values(pEnum);
        return lResultArray.slice(0, lResultArray.length / 2);
    }

    /**
     * Return all values of an enum as array.
     * @param pEnum - typeof Enum object.
     */
    public static enumValuesToArray<T>(pEnum: object): Array<T> {
        // Convert enum to array.
        const lResultArray: Array<T> = Object.values(pEnum);
        return lResultArray.slice(lResultArray.length / 2);
    }
}
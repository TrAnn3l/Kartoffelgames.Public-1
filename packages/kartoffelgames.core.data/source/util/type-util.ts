/**
 * Type helper.
 */
export class TypeUtil {
    /**
     * Check existence of a member name and return that name.
     * @param pName - Property name.
     */
    public static nameOf<T>(pName: Extract<keyof T, string>): string {
        return pName;
    }
}
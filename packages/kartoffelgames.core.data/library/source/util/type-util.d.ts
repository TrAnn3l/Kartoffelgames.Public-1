/**
 * Type helper.
 */
export declare class TypeUtil {
    /**
     * Check existence of a member name and return that name.
     * @param pName - Property name.
     */
    static nameOf<T>(pName: Extract<keyof T, string>): string;
}
//# sourceMappingURL=type-util.d.ts.map
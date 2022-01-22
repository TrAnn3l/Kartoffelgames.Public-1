/**
 * Basic exception.
 */
export declare class Exception<T> extends Error {
    private readonly mTarget;
    /**
     * Target exception throws.
     */
    get target(): T;
    /**
     * Constructor. Create exception.
     * @param pMessage - Messsage of exception.
     * @param pTarget - Target exception throws.
     */
    constructor(pMessage: string, pTarget: T);
}
//# sourceMappingURL=exception.d.ts.map
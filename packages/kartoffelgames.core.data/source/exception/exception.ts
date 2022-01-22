/**
 * Basic exception.
 */
export class Exception<T> extends Error {
    private readonly mTarget: T;

    /**
     * Target exception throws.
     */
    public get target(): T {
        return this.mTarget;
    }

    /**
     * Constructor. Create exception.
     * @param pMessage - Messsage of exception.
     * @param pTarget - Target exception throws.
     */
    public constructor(pMessage: string, pTarget: T) {
        super(pMessage);
        this.mTarget = pTarget;
    }
}
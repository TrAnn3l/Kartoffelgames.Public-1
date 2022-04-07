export class BaseComponentReference<TValue> {
    private readonly mValue: TValue;

    /**
     * Value.
     */
    public get value(): TValue {
        return this.mValue;
    }

    /**
     * Constructor.
     * @param pValue - Value.
     */
    public constructor(pValue: TValue){
        this.mValue = pValue;
    }
}
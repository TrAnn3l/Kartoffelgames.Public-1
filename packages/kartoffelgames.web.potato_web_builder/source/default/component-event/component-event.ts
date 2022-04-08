export class ComponentEvent<T> extends Event {
    private readonly mValue: T;

    /**
     * Event value.
     */
    public get value(): T {
        return this.mValue;
    }

    /**
     * Pwb custom event constructor.
     * @param pEventName - Event name.
     * @param pValue - Event value.
     */
    constructor(pEventName: string, pValue: T){
        super(pEventName);
        this.mValue = pValue;
    }
}
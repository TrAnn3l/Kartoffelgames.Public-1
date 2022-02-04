/**
 * Event emitter.
 * Use in combination with @HtmlComponentEvent.
 */
export declare class ComponentEventEmitter<T> {
    private readonly mListener;
    /**
     * Constructor.
     * Initialize lists.
     */
    constructor();
    /**
     * Add event listener to event.
     * @param pCallback - Event callback.
     */
    addListener(pCallback: (this: null, pEvent: T) => void): void;
    /**
     * Call all event listener with event arguments.
     * @param pEventArgs - Event arguments.
     */
    dispatchEvent(pEventArgs: T): void;
    /**
     * Remove event listener from event.
     * @param pCallback - Event callback.
     */
    removeListener(pCallback: (this: null, pEvent: T) => void): void;
}
//# sourceMappingURL=component-event-emitter.d.ts.map
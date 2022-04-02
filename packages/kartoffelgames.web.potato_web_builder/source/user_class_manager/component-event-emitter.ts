import { List } from '@kartoffelgames/core.data';

/**
 * Event emitter.
 * Use in combination with @HtmlComponentEvent.
 */
export class ComponentEventEmitter<T> {
    private readonly mListener: List<(this: null, pEvent: T) => void>;

    /**
     * Constructor.
     * Initialize lists.
     */
    constructor() {
        this.mListener = new List<(this: null, pEvent: T) => void>();
    }

    /**
     * Add event listener to event.
     * @param pCallback - Event callback.
     */
    public addListener(pCallback: (this: null, pEvent: T) => void): void {
        this.mListener.push(pCallback);
    }

    /**
     * Call all event listener with event arguments.
     * @param pEventArgs - Event arguments.
     */
    public dispatchEvent(pEventArgs: T): void {
        // Call all listener.
        for (const lListener of this.mListener) {
            lListener.call(null, pEventArgs);
        }
    }

    /**
     * Remove event listener from event.
     * @param pCallback - Event callback.
     */
    public removeListener(pCallback: (this: null, pEvent: T) => void): void {
        this.mListener.remove(pCallback);
    }
}
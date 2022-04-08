import { ComponentEvent } from './component-event';

/**
 * Event emitter.
 * Use in combination with @HtmlComponentEvent.
 */
export class ComponentEventEmitter<T> {
    private readonly mElement: HTMLElement;
    private readonly mEventName: string;

    /**
     * Constructor.
     * Custom event emmiter for html elements.
     * @param pEventName - Event name.
     * @param pHtmlElement - Html element of emmiter.
     */
    constructor(pEventName: string, pHtmlElement: HTMLElement) {
        this.mEventName = pEventName;
        this.mElement = pHtmlElement;
    }

    /**
     * Add event listener to event.
     * @param pCallback - Event callback.
     */
    public addListener(pCallback: (this: HTMLElement, pEvent: ComponentEvent<T>) => void): void {
        this.mElement.addEventListener(this.mEventName, pCallback);
    }

    /**
     * Call all event listener with event arguments.
     * @param pEventArgs - Event arguments.
     */
    public dispatchEvent(pEventArgs: T): void {
        // Create and dispatch event.
        const lEvent: ComponentEvent<T> = new ComponentEvent<T>(this.mEventName, pEventArgs);
        this.mElement.dispatchEvent(lEvent);
    }

    /**
     * Remove event listener from event.
     * @param pCallback - Event callback.
     */
    public removeListener(pCallback: (this: null, pEvent: ComponentEvent<T>) => void): void {
        this.mElement.removeEventListener(this.mEventName, pCallback);
    }
}
import { ComponentHandler } from '../component_manager/component-handler';
import { PwbComponentElement } from '../interface/html-component';

export class PwbComponent {
    private readonly mComponentElement: HTMLElement;
    private readonly mComponentHandler: ComponentHandler;

    /**
     * Get raw html element of component.
     */
    public get componentElement(): HTMLElement {
        return this.mComponentElement;
    }

    /**
     * Constructor.
     * @param pComponentHandler - Component handler.
     */
    public constructor(pComponentHandler: ComponentHandler, pElement: HTMLElement) {
        this.mComponentHandler = pComponentHandler;
        this.mComponentElement = pElement;
    }

    /**
     * Send an error to the global error handler.
     * @param pError - Error.
     */
    public sendError(pError: any): void {
        this.mComponentHandler.sendError(pError);
    }

    /**
     * Update component manually.
     */
    public update(): void {
        // Dispatch change event for other components.
        this.mComponentHandler.changeDetection.dispatchChangeEvent({
            source: (<PwbComponentElement>this.mComponentElement).componentHandler.userClassObject,
            property: Symbol('manual update'),
            stacktrace: Error().stack
        });
        // Call update component just in case of manual updating.
        this.mComponentHandler.updateComponent({
            source: (<PwbComponentElement>this.mComponentElement).componentHandler.userClassObject,
            property: Symbol('manual update'),
            stacktrace: Error().stack
        });
    }
}
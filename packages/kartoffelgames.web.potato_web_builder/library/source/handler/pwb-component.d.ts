import { ComponentHandler } from '../component_manager/component-handler';
export declare class PwbComponent {
    private readonly mComponentElement;
    private readonly mComponentHandler;
    /**
     * Get raw html element of component.
     */
    get componentElement(): HTMLElement;
    /**
     * Constructor.
     * @param pComponentHandler - Component handler.
     */
    constructor(pComponentHandler: ComponentHandler, pElement: HTMLElement);
    /**
     * Send an error to the global error handler.
     * @param pError - Error.
     */
    sendError(pError: any): void;
    /**
     * Update component manually.
     */
    update(): void;
}
//# sourceMappingURL=pwb-component.d.ts.map
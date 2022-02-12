import { ComponentManager } from '../component-manager';

export class PwbElementReference {
    private readonly mComponentManager: ComponentManager;

    /**
     * Get raw html element of component.
     */
    public get componentElement(): HTMLElement {
        return this.mComponentManager.elementHandler.htmlElement;
    }

    /**
     * Constructor.
     * @param pComponentHandler - Component handler.
     */
    public constructor(pComponentHandler: ComponentManager) {
        this.mComponentManager = pComponentHandler;
    }
}
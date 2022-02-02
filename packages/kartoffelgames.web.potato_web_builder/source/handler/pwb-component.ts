import { ComponentManager } from '../component/component-manager';

export class PwbComponent {
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

    /**
     * Update component manually.
     */
    public update(): void {
        // Call update component just in case of manual updating.
        this.mComponentManager.updateHandler.forceUpdate({
            source: this.mComponentManager.userObjectHandler.userObject,
            property: Symbol('manual update'),
            stacktrace: Error().stack
        });
    }
}
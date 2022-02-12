import { ComponentManager } from '../component-manager';

export class PwbUpdateReference {
    private readonly mComponentManager: ComponentManager;

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
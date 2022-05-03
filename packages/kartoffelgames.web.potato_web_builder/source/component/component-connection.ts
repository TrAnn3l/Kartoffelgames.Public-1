import { ComponentManager } from './component-manager';

export class ComponentConnection {
    private static readonly mComponentManagerConnections: WeakMap<object, ComponentManager> = new WeakMap<object, ComponentManager>();

    /**
     * Get connected component manager of object.
     * Supported types are HTMLElements or UserObjects.
     * @param pObject - Instace that is connected to 
     * @returns 
     */
    public static componentManagerOf(pObject: object): ComponentManager | undefined {
        return ComponentConnection.mComponentManagerConnections.get(pObject);
    }

    /**
     * Connect instance with component manager.
     * @param pObject - Instance.
     * @param pComponentManager - Component manager of instance.
     */
    public static connectComponentManagerWith(pObject: object, pComponentManager: ComponentManager): void {
        ComponentConnection.mComponentManagerConnections.set(pObject, pComponentManager);
    }
}
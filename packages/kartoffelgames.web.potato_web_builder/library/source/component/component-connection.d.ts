import { ComponentManager } from './component-manager';
export declare class ComponentConnection {
    private static readonly mComponentManagerConnections;
    /**
     * Get connected component manager of object.
     * Supported types are HTMLElements or UserObjects.
     * @param pObject - Instace that is connected to
     * @returns
     */
    static componentManagerOf(pObject: object): ComponentManager | null;
    /**
     * Connect instance with component manager.
     * @param pObject - Instance.
     * @param pComponentManager - Component manager of instance.
     */
    static connectComponentManagerWith(pObject: object, pComponentManager: ComponentManager): void;
}
//# sourceMappingURL=component-connection.d.ts.map
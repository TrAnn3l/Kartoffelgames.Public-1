"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentConnection = void 0;
class ComponentConnection {
    /**
     * Get connected component manager of object.
     * Supported types are HTMLElements or UserObjects.
     * @param pObject - Instace that is connected to
     * @returns
     */
    static componentManagerOf(pObject) {
        return ComponentConnection.mComponentManagerConnections.get(pObject);
    }
    /**
     * Connect instance with component manager.
     * @param pObject - Instance.
     * @param pComponentManager - Component manager of instance.
     */
    static connectComponentManagerWith(pObject, pComponentManager) {
        ComponentConnection.mComponentManagerConnections.set(pObject, pComponentManager);
    }
}
exports.ComponentConnection = ComponentConnection;
ComponentConnection.mComponentManagerConnections = new WeakMap();
//# sourceMappingURL=component-connection.js.map
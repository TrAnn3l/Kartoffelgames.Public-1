import { ComponentManager } from '../component-manager';

export class PwbElementReference {
    private readonly mNode: Node;

    /**
     * Get raw html element of component.
     */
    public get element(): Node {
        return this.mNode;
    }

    /**
     * Constructor.
     * @param pNode - Referenced node.
     */
    public constructor(pNode: Node) {
        this.mNode = pNode;
    }
}
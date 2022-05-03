import { XmlDocument } from '../document/xml-document';

/**
 * Basic node.
 */
export abstract class BaseXmlNode {
    private mParent: BaseXmlNode | null;

    /**
     * Get nodes namespace.
     */
    public abstract readonly defaultNamespace: string | null;

    /**
     * Get xml nodes document.
     */
    public get document(): XmlDocument | null {
        return this.parent?.document ?? null;
    }

    /**
     * Get Parent of node.
     */
    public get parent(): BaseXmlNode | null {
        return this.mParent;
    }

    /**
     * Set parent of node.
     * @internal
     */
    public set parent(pParent: BaseXmlNode | null) {
        this.mParent = pParent;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mParent = null;
    }

    /**
     * Clone current node.
     */
    public abstract clone(): BaseXmlNode;

    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    public abstract equals(pBaseNode: BaseXmlNode): boolean;
}
import { XmlDocument } from '../document/xml-document';

/**
 * Basic node.
 */
export abstract class BaseXmlNode {
    private mParent: BaseXmlNode;

    /**
     * Get xml nodes document.
     */
    public get document(): XmlDocument {
        return this.parent?.document ?? null;
    }

    /**
     * Get nodes namespace.
     */
    public abstract readonly defaultNamespace: string 

    /**
     * Get Parent of node.
     */
    public get parent(): BaseXmlNode {
        return this.mParent ?? null;
    }

    /**
     * Set parent of node.
     */
    public set parent(pParent: BaseXmlNode) {
        this.mParent = pParent;
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
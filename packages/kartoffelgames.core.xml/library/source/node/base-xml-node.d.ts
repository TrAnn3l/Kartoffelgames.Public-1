import { XmlDocument } from '../document/xml-document';
/**
 * Basic node.
 */
export declare abstract class BaseXmlNode {
    private mParent;
    /**
     * Get xml nodes document.
     */
    get document(): XmlDocument;
    /**
     * Get nodes namespace.
     */
    abstract readonly defaultNamespace: string;
    /**
     * Get Parent of node.
     */
    get parent(): BaseXmlNode;
    /**
     * Set parent of node.
     */
    set parent(pParent: BaseXmlNode);
    /**
     * Clone current node.
     */
    abstract clone(): BaseXmlNode;
    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    abstract equals(pBaseNode: BaseXmlNode): boolean;
}
//# sourceMappingURL=base-xml-node.d.ts.map
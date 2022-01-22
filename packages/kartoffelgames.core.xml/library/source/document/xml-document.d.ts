import { BaseXmlNode } from '../node/base-xml-node';
/**
 * XMLDocument.
 */
export declare class XmlDocument extends BaseXmlNode {
    private readonly mBodyElementList;
    private readonly mDefaultNamespace;
    /**
     * Get nodes namespace.
     */
    get defaultNamespace(): string;
    /**
     * Get all document xml nodes.
     */
    get body(): Array<BaseXmlNode>;
    /**
     * Get xml nodes document.
     */
    get document(): XmlDocument;
    /**
     * Constructor.
     */
    constructor(pDefaultNamespace: string);
    /**
     * Append child to document body.
     * @param pXmlNode - Xml node.
     */
    appendChild(...pXmlNodeList: Array<BaseXmlNode>): void;
    /**
     * Clonse document with all nodes.
     */
    clone(): XmlDocument;
    /**
     * Compare two documents for equality.
     * @param pBaseNode - Node that should be compared.
     */
    equals(pBaseNode: BaseXmlNode): boolean;
}
//# sourceMappingURL=xml-document.d.ts.map
import { List } from '@kartoffelgames/core.data';
import { BaseXmlNode } from '../node/base-xml-node';

/**
 * XMLDocument.
 */
export class XmlDocument extends BaseXmlNode {
    private readonly mBodyElementList: List<BaseXmlNode>;
    private readonly mDefaultNamespace: string;

    /**
     * Get all document xml nodes.
     */
    public get body(): Array<BaseXmlNode> {
        return this.mBodyElementList.clone();
    }

    /**
     * Get nodes namespace.
     */
    public get defaultNamespace(): string {
        return this.mDefaultNamespace;
    }

    /**
     * Get xml nodes document.
     */
    public get document(): XmlDocument {
        return this;
    }

    /**
     * Constructor.
     */
    public constructor(pDefaultNamespace: string) {
        super();

        this.mDefaultNamespace = pDefaultNamespace;
        this.mBodyElementList = new List<BaseXmlNode>();
    }

    /**
     * Append child to document body.
     * @param pXmlNode - Xml node.
     */
    public appendChild(...pXmlNodeList: Array<BaseXmlNode>): void {
        this.mBodyElementList.push(...pXmlNodeList);

        for (const lChildNode of pXmlNodeList) {
            lChildNode.parent = this;
        }
    }

    /**
     * Clonse document with all nodes.
     */
    public clone(): XmlDocument {
        const lXmlDocument: XmlDocument = new XmlDocument(this.defaultNamespace);

        // Clone all child nodes.
        for (const lXmlNode of this.mBodyElementList) {
            lXmlDocument.appendChild(lXmlNode.clone());
        }

        return lXmlDocument;
    }

    /**
     * Compare two documents for equality.
     * @param pBaseNode - Node that should be compared.
     */
    public equals(pBaseNode: BaseXmlNode): boolean {
        // Check type, tagname, namespace and namespace prefix.
        if (!(pBaseNode instanceof XmlDocument)) {
            return false;
        }

        // Same namespace.
        if (pBaseNode.mDefaultNamespace !== this.mDefaultNamespace) {
            return false;
        }

        // Same length
        if (pBaseNode.body.length !== this.body.length) {
            return false;
        }

        // Compare each body element.
        for (let lIndex: number = 0; lIndex < this.body.length; lIndex++) {
            if (!this.body[lIndex].equals(pBaseNode.body[lIndex])) {
                return false;
            }
        }

        return true;
    }
}
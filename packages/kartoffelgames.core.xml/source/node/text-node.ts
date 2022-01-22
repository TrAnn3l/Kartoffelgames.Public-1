import { BaseXmlNode } from './base-xml-node';

/**
 * Node only contains text.
 */
export class TextNode extends BaseXmlNode {
    private mText: string;

    /**
     * Get nodes namespace.
     */
    public get defaultNamespace(): string {
        return this.parent?.defaultNamespace ?? null;
    }

    /**
     * Get text string of node.
     */
    public get text(): string {
        return this.mText;
    }

    /**
     * Set text string of node.
     * @param pText - Text of node.
     */
    public set text(pText: string) {
        this.mText = pText;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();
        this.text = '';
    }

    /**
     * Clone current node.
     */
    public clone(): TextNode {
        const lTextNodeClone: TextNode = new TextNode();
        lTextNodeClone.text = this.text;

        return lTextNodeClone;
    }

    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    public equals(pBaseNode: BaseXmlNode): boolean {
        return pBaseNode instanceof TextNode && pBaseNode.text === this.text;
    }
}
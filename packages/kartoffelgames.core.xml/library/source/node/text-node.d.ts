import { BaseXmlNode } from './base-xml-node';
/**
 * Node only contains text.
 */
export declare class TextNode extends BaseXmlNode {
    private mText;
    /**
     * Get nodes namespace.
     */
    get defaultNamespace(): string;
    /**
     * Get text string of node.
     */
    get text(): string;
    /**
     * Set text string of node.
     * @param pText - Text of node.
     */
    set text(pText: string);
    /**
     * Constructor.
     */
    constructor();
    /**
     * Clone current node.
     */
    clone(): TextNode;
    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    equals(pBaseNode: BaseXmlNode): boolean;
}
//# sourceMappingURL=text-node.d.ts.map
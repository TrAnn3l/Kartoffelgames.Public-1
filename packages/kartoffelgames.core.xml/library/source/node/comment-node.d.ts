import { BaseXmlNode } from './base-xml-node';
/**
 * Node only contains text.
 */
export declare class CommentNode extends BaseXmlNode {
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
     * Clone current node.
     */
    clone(): CommentNode;
    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    equals(pBaseNode: BaseXmlNode): boolean;
}
//# sourceMappingURL=comment-node.d.ts.map
import { BaseXmlNode } from './base-xml-node';

/**
 * Node only contains text.
 */
export class CommentNode extends BaseXmlNode {
    private mText: string;

    /**
     * Get nodes namespace.
     */
    public override get defaultNamespace(): string | null {
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
        this.mText = '';
    }

    /**
     * Clone current node.
     */
    public clone(): CommentNode {
        const lCommentNodeClone: CommentNode = new CommentNode();
        lCommentNodeClone.text = this.text;

        return lCommentNodeClone;
    }

    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    public equals(pBaseNode: BaseXmlNode): boolean {
        return pBaseNode instanceof CommentNode && pBaseNode.text === this.text;
    }
}
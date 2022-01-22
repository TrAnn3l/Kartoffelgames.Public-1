import { IVoidParameterConstructor } from '@kartoffelgames/core.data';
import { CommentNode } from '../node/comment-node';
import { TextNode } from '../node/text-node';
import { XmlElement } from '../node/xml-element';
import { BaseXmlParser } from './base-xml-parser';
export declare class XmlParser extends BaseXmlParser<XmlElement, TextNode, CommentNode> {
    /**
     * Get Comment node constructor.
     */
    protected geCommentNodeConstructor(): IVoidParameterConstructor<CommentNode>;
    /**
     * Get documents default namespace.
     */
    protected getDefaultNamespace(): string;
    /**
     * Get Text node constructor.
     */
    protected getTextNodeConstructor(): IVoidParameterConstructor<TextNode>;
    /**
     * Get XML Element constructor.
     */
    protected getXmlElementConstructor(): IVoidParameterConstructor<XmlElement>;
}
//# sourceMappingURL=xml-parser.d.ts.map
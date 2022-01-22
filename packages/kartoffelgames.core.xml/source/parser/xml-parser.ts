import { IVoidParameterConstructor } from '@kartoffelgames/core.data';
import { CommentNode } from '../node/comment-node';
import { TextNode } from '../node/text-node';
import { XmlElement } from '../node/xml-element';
import { BaseXmlParser } from './base-xml-parser';

export class XmlParser extends BaseXmlParser<XmlElement, TextNode, CommentNode> {
    /**
     * Get Comment node constructor.
     */
    protected geCommentNodeConstructor(): IVoidParameterConstructor<CommentNode> {
        return CommentNode;
    }

    /**
     * Get documents default namespace.
     */
    protected getDefaultNamespace(): string {
        return 'http://www.w3.org/1999/xhtml';
    }

    /**
     * Get Text node constructor.
     */
    protected getTextNodeConstructor(): IVoidParameterConstructor<TextNode> {
        return TextNode;
    }

    /**
     * Get XML Element constructor.
     */
    protected getXmlElementConstructor(): IVoidParameterConstructor<XmlElement> {
        return XmlElement;
    }
}
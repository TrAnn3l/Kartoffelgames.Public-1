import { XmlElement } from '../node/xml-element';
import { TextNode } from '../node/text-node';
import { IVoidParameterConstructor } from '@kartoffelgames/core.data';
import { CommentNode } from '../node/comment-node';
import { XmlDocument } from '../document/xml-document';
/**
 * XML parser. Can handle none XML conform styles with different parser modes.
 */
export declare abstract class BaseXmlParser<TXmlElement extends XmlElement, TText extends TextNode, TComment extends CommentNode> {
    private static readonly ROOT_NODE_NAME;
    private readonly mConfig;
    /**
     * Constructor. Creates parser with specified mode.
     * @param pParserMode - Mode how parser handles different characters.
     */
    constructor(pParserConfig?: XmlParserConfig);
    /**
     * Parse xml string to node list.
     * String can have divergent nameings for tagnames and attributes if adjusted in parser config.
     * @param pXmlString - Xml formated string.
     */
    parse(pXmlString: string): XmlDocument;
    /**
     * Convert simple node to xml nodes.
     * @param pSimpleNode - Complete simple node.
     */
    private convertSimpleNode;
    /**
     * Escape text to be inserted into an regex.
     * @param pText - String.
     */
    private escapeRegExp;
    /**
     * Get attribute string of node. Removes opening and closing lower/greater than and tagname.
     * @param pSimpleNode - Simple node. Only opening and empty nodes.
     */
    private getAttributeString;
    /**
     * Get attributes from attribute string. Override oldest attribute if dubicate.
     * @param pAttributeString - Attribute string. String that only contains attributes.
     */
    private getAttributesFromString;
    /**
     * Get tagname of node string. Throws error if name can not be found.
     * @param pXmlPart - Part of xml. Text, closing, opening or empty node as string.
     * @throws - When name can not be found, Node is only a text node.
     */
    private getNodeName;
    /**
     * Get type of node from node syntax.
     * Must start and end with lower or greater than or none of both.
     * @param pXmlPart - Part of xml. Text, closing, opening or empty node as string.
     */
    private getNodeType;
    /**
     * Get xml node information from tagnames.
     * @param pFullQualifiedTagName - Full qualified tagname with namespace prefix.
     */
    private getXmlElementInformation;
    /**
     * Moves Nodes inside NodeBody into correct child nodes and clears closing tags.
     * @param pRootNode - Root node containing unpacked {SimpeNode} in NodeBody.
     * @throws Exception - When no closing or opening tag was found.
     */
    private packXmlContent;
    /**
     * Get Comment node constructor.
     */
    protected abstract geCommentNodeConstructor(): IVoidParameterConstructor<TComment>;
    /**
     * Get documents default namespace.
     */
    protected abstract getDefaultNamespace(): string;
    /**
     * Get Text node constructor.
     */
    protected abstract getTextNodeConstructor(): IVoidParameterConstructor<TText>;
    /**
     * Get XML Element constructor.
     */
    protected abstract getXmlElementConstructor(): IVoidParameterConstructor<TXmlElement>;
}
/**
 * Xml parser config for xml names.
 */
declare type XmlParserConfig = {
    /**
     * Characters that are allowed for attribute names. Case insensitiv.
     */
    allowedAttributeCharacters?: string;
    /**
     * Characters that are allowed for tag names. Case insensitiv.
     */
    allowedTagNameCharacters?: string;
    /**
     * Remove comments from generated xml.
     */
    removeComments?: boolean;
};
export {};
//# sourceMappingURL=base-xml-parser.d.ts.map
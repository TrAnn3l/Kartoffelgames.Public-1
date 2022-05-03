import { NodeType } from '../enum/node-type';
import { XmlElement } from '../node/xml-element';
import { TextNode } from '../node/text-node';
import { BaseXmlNode } from '../node/base-xml-node';
import { Exception, IVoidParameterConstructor } from '@kartoffelgames/core.data';
import { CommentNode } from '../node/comment-node';
import { XmlDocument } from '../document/xml-document';

/**
 * XML parser. Can handle none XML conform styles with different parser modes.
 */
export abstract class BaseXmlParser<TXmlElement extends XmlElement, TText extends TextNode, TComment extends CommentNode> {
    private static readonly ROOT_NODE_NAME: string = 'ROOT-NODE';
    private readonly mConfig: XmlParserConfig;

    /**
     * Constructor. Creates parser with specified mode.
     * @param pParserMode - Mode how parser handles different characters.
     */
    public constructor(pParserConfig: XmlParserConfig = {}) {
        this.mConfig = {};

        // Set default config.
        this.mConfig.allowedAttributeCharacters = pParserConfig.allowedAttributeCharacters ?? 'abcdefghijklmnopqrstuvwxyz_:-.1234567890';
        this.mConfig.allowedTagNameCharacters = pParserConfig.allowedTagNameCharacters ?? 'abcdefghijklmnopqrstuvwxyz_:-.1234567890';
        this.mConfig.removeComments = !!pParserConfig.removeComments;

        // Extend allowed character for case insensitivity and escape.
        this.mConfig.allowedAttributeCharacters = this.escapeRegExp(this.mConfig.allowedAttributeCharacters.toLowerCase() + this.mConfig.allowedAttributeCharacters.toUpperCase());
        this.mConfig.allowedTagNameCharacters = this.escapeRegExp(this.mConfig.allowedTagNameCharacters.toLowerCase() + this.mConfig.allowedTagNameCharacters.toUpperCase());
    }

    /**
     * Parse xml string to node list.
     * String can have divergent nameings for tagnames and attributes if adjusted in parser config.
     * @param pXmlString - Xml formated string.
     */
    public parse(pXmlString: string): XmlDocument {

        const lRegexString: RegExp = new RegExp(/"[^"]*"/gs);
        const lRegexXmlParts: RegExp = new RegExp(/<[^>]*>|[^<>]*/gs);

        // Wrapp xml string inside root node.
        let lXmlString: string = `<${BaseXmlParser.ROOT_NODE_NAME}>${pXmlString}</${BaseXmlParser.ROOT_NODE_NAME}>`;

        // Escape greater than and lower than inside strings.
        lXmlString = lXmlString.replace(lRegexString, (pMatch: string): string => {
            return pMatch.replace('<', '&ltxp;').replace('>', '&gtxp;');
        });

        // Break Xml into parts and filter empty lines. Does allways match.
        const lXmlPartsMatch: RegExpMatchArray = <RegExpMatchArray>lXmlString.match(lRegexXmlParts);
        const lXmlPartList: Array<string> = lXmlPartsMatch.filter((pValue) => {
            return pValue && !pValue.match(/^\s*$/);
        });

        // Convert xml parts to more specified simple nodes.
        const lXmlElementList: Array<SimpleNode> = lXmlPartList.map((pValue: string): SimpleNode => {
            const lNode: SimpleNode = new SimpleNode(this.getNodeType(pValue));
            lNode.nodeHead = pValue;

            // If node is not a text node and not comment, add NodeName.
            if (lNode.nodeType !== NodeType.Text && lNode.nodeType !== NodeType.Comment) {
                lNode.nodeName = this.getNodeName(lNode.nodeHead);
            }

            return lNode;
        });

        // Remove closing tag.
        lXmlElementList.splice(lXmlElementList.length - 1, 1);

        // Pack all content into previously added root node.
        let lRootNode: SimpleNode = lXmlElementList.splice(0, 1)[0];
        lRootNode.nodeBody.push(...lXmlElementList);

        // Pack node into correct child nodes.
        lRootNode = this.packXmlContent(lRootNode);

        // Convert root SimpleNode to xml node. Root node can only be xml node.
        const lConvertedRootNode: XmlElement = <XmlElement>this.convertSimpleNode(lRootNode);

        // Add all ROOT-NODE childs to document.
        const lDocument: XmlDocument = new XmlDocument(this.getDefaultNamespace());
        lDocument.appendChild(...lConvertedRootNode.childList);

        return lDocument;
    }

    /**
     * Convert simple node to xml nodes.
     * @param pSimpleNode - Complete simple node.
     */
    private convertSimpleNode(pSimpleNode: SimpleNode): BaseXmlNode | null {
        if (pSimpleNode.nodeType === NodeType.OpeningTag || pSimpleNode.nodeType === NodeType.EmptyTag) {
            // Find attributes and namespaces.
            const lAttributes: Array<AttributeInformation> = this.getAttributesFromString(this.getAttributeString(pSimpleNode));

            // Get namespace information for xml node.
            const lNodeNamespaceInfo: XmlElementTagNameInformation = this.getXmlElementInformation(pSimpleNode.nodeName);

            // Create new node.
            const lResultNode: XmlElement = new (this.getXmlElementConstructor())();
            lResultNode.tagName = lNodeNamespaceInfo.name;
            lResultNode.namespacePrefix = lNodeNamespaceInfo.namespacePrefix;

            // Add attributes to new node.
            for (const lAttribute of lAttributes) {
                lResultNode.setAttribute(lAttribute.name, lAttribute.value, lAttribute.namespacePrefix);
            }

            // Add all child element.
            for (const lChild of pSimpleNode.nodeBody) {
                const lXmlNode: BaseXmlNode | null = this.convertSimpleNode(lChild);

                // Do not add wrong or empty nodes.
                if (lXmlNode) {
                    lResultNode.appendChild(lXmlNode);
                }
            }

            return lResultNode;
        } else if (pSimpleNode.nodeType === NodeType.Text) {
            // Text. Create text node. Remove quotation.
            const lTextNode = new (this.getTextNodeConstructor())();
            lTextNode.text = pSimpleNode.nodeHead.replace(/^"/, '').replace(/"$/, '').replace('&ltxp;', '<').replace('&gtxp;', '>');

            return lTextNode;
        } else if (pSimpleNode.nodeType === NodeType.Comment && !this.mConfig.removeComments) {
            // Comment. Create comment node.
            const lCommentNode = new (this.geCommentNodeConstructor())();
            lCommentNode.text = pSimpleNode.nodeHead.substr(4, pSimpleNode.nodeHead.length - 7).trim();

            return lCommentNode;
        }

        return null;
    }

    /**
     * Escape text to be inserted into an regex.
     * @param pText - String.
     */
    private escapeRegExp(pText: string): string {
        return pText.replace(/[.*+?^${}()\-|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    /**
     * Get attribute string of node. Removes opening and closing lower/greater than and tagname.
     * @param pSimpleNode - Simple node. Only opening and empty nodes.
     */
    private getAttributeString(pSimpleNode: SimpleNode): string {
        let lNodeString: string = pSimpleNode.nodeHead;

        // Remove opening lower than and tagname.
        // ^\<\s*[TAGNAME]
        const lRegexOpeningLowerThanTagName: RegExp = new RegExp(`^<\\s*[${this.mConfig.allowedTagNameCharacters}]+`);

        // Remove from node string.
        lNodeString = lNodeString.replace(lRegexOpeningLowerThanTagName, '');

        // Remove closing greater than from node string.
        if (pSimpleNode.nodeType === NodeType.OpeningTag) {
            lNodeString = lNodeString.replace(/\s*>$/, '');
        } else {
            // Is Empty Tag
            lNodeString = lNodeString.replace(/\s*\/\s*>$/, '');
        }

        return lNodeString;
    }

    /**
     * Get attributes from attribute string. Override oldest attribute if dubicate.
     * @param pAttributeString - Attribute string. String that only contains attributes.
     */
    private getAttributesFromString(pAttributeString: string): Array<AttributeInformation> {
        const lAttributes: Array<AttributeInformation> = new Array<AttributeInformation>();
        const lRegexAttributeParts: RegExp = new RegExp(/([^\s=]+)(="([^"]*)")?|([^\s]+)/gs);
        const lRegexNameCheck: RegExp = new RegExp(`^[${this.mConfig.allowedAttributeCharacters}]+$`);

        // Iterate over each attribute.
        let lAttributeParts: RegExpExecArray | null;
        while ((lAttributeParts = lRegexAttributeParts.exec(pAttributeString))) {
            // Check noneparseable regex group.
            if (lAttributeParts[4]) {
                throw new Exception(`Can't parse attribute part: "${lAttributeParts[4]}"`, this);
            }

            let lNamespacePrefix: string | null = null;
            let lName: string = lAttributeParts[1];
            const lValue: string = lAttributeParts[3] ?? '';

            // Check if name is correct.
            if (!lRegexNameCheck.test(lName)) {
                throw new Exception(`Can't parse attribute name: "${lName}"`, this);
            }

            // Split name with namespace prefix. Does allways match.
            const lAttributeNameParts: RegExpExecArray = <RegExpExecArray>/(([^\s]+):)?([^\s]+)/.exec(lAttributeParts[1]);

            // Check if namespace exists and add namespace prefix.
            if (lAttributeNameParts[2]) {
                lName = lAttributeNameParts[3];
                lNamespacePrefix = lAttributeNameParts[2];
            }

            // Add attribute.
            lAttributes.push({
                name: lName,
                namespacePrefix: lNamespacePrefix,
                // Replace escaped characters with original and normalize newlines.
                value: lValue.replace('&ltxp;', '<').replace('&gtxp;', '>').replace('\n', ' ')
            });
        }

        return lAttributes;
    }

    /**
     * Get tagname of node string. Throws error if name can not be found.
     * @param pXmlPart - Part of xml. Text, closing, opening or empty node as string.
     * @throws - When name can not be found, Node is only a text node.
     */
    private getNodeName(pXmlPart: string): string {
        const lRegexPossibleTagName: RegExp = new RegExp(/<[\s/]*([^\s></]+)/);
        const lRegexNameCheck: RegExp = new RegExp(`^[${this.mConfig.allowedTagNameCharacters}]+$`);

        // Test if node starts and ends with lower/greater than.
        const lTagName: RegExpExecArray | null = lRegexPossibleTagName.exec(pXmlPart);

        // Only return tagname if found and correct name syntax.
        if (lTagName && lRegexNameCheck.test(lTagName[1])) {
            return lTagName[1];
        }

        // Throw exception if no name was found.
        throw new Exception(`Error resolving XML-Tagname from "${pXmlPart}"`, this);
    }

    /**
     * Get type of node from node syntax.
     * Must start and end with lower or greater than or none of both.
     * @param pXmlPart - Part of xml. Text, closing, opening or empty node as string.
     */
    private getNodeType(pXmlPart: string): NodeType {
        // Check if node starts with lower than.
        if (pXmlPart.startsWith('</')) {
            return NodeType.ClosingTag;
        } else if (pXmlPart.startsWith('<!--')) {
            return NodeType.Comment;
        } else if (pXmlPart.startsWith('<')) {
            // Check if Tag gets closed by greater than.
            if (pXmlPart.endsWith('/>')) {
                return NodeType.EmptyTag;
            } else {
                // Single lower than.
                return NodeType.OpeningTag;
            }
        }

        // Default: Text.
        return NodeType.Text;
    }

    /**
     * Get xml node information from tagnames.
     * @param pFullQualifiedTagName - Full qualified tagname with namespace prefix.
     */
    private getXmlElementInformation(pFullQualifiedTagName: string): XmlElementTagNameInformation {
        let lTagname: string;
        let lNamespacePrefix: string | null = null;

        // Find namespace prefix and tagname of qualified tagname. Does allways match something.
        const lTagnameGroups: RegExpExecArray = <RegExpExecArray>/(([^\s]+):)?([^\s]+)/.exec(pFullQualifiedTagName);

        // If namespace before tagname exists.
        if (lTagnameGroups[2]) {
            lTagname = lTagnameGroups[3];
            lNamespacePrefix = lTagnameGroups[2];
        } else {
            lTagname = pFullQualifiedTagName;
        }

        return {
            name: lTagname,
            namespacePrefix: lNamespacePrefix
        };
    }

    /**
     * Moves Nodes inside NodeBody into correct child nodes and clears closing tags.
     * @param pRootNode - Root node containing unpacked {SimpeNode} in NodeBody.
     * @throws Exception - When no closing or opening tag was found.
     */
    private packXmlContent(pRootNode: SimpleNode): SimpleNode {
        // For each content inside simple node.
        for (let lIndex = 0; lIndex < pRootNode.nodeBody.length; lIndex++) {
            const lChildNode: SimpleNode = pRootNode.nodeBody[lIndex];

            // If closing tags should be processed, no opening tag was before closing tag.
            if (lChildNode.nodeType === NodeType.ClosingTag) {
                throw new Exception(`Error unexpected closing XML-Tag ${lChildNode.nodeName}`, this);
            } else if (lChildNode.nodeType === NodeType.OpeningTag) {
                let lTagLevel: number = 0;
                let lFoundClosingIndex: number = -1;

                // Find closing tag.
                for (let lChildIndex = lIndex + 1; lChildIndex < pRootNode.nodeBody.length; lChildIndex++) {
                    const lSearchNode: SimpleNode = pRootNode.nodeBody[lChildIndex];

                    // Found tag with same name.
                    if (lSearchNode.nodeName === lChildNode.nodeName) {
                        // Check if closing tag. If not closing, add new level.
                        if (lSearchNode.nodeType === NodeType.OpeningTag) {
                            lTagLevel++;
                        } else if (lSearchNode.nodeType !== NodeType.EmptyTag) {
                            // node type can only be closing. nodeName can not be undefined on opening tags.
                            lTagLevel--;

                            // If level is on lowest, on current child level.
                            if (lTagLevel < 0) {
                                lFoundClosingIndex = lChildIndex;
                                break;
                            }
                        }
                    }
                }

                // Check if no closing tag was found.
                if (lFoundClosingIndex < 0) {
                    throw new Exception(`Error closing XML-Tag ${lChildNode.nodeName}`, this);
                }

                // Remove content for child node from root node and add to child node.
                const lChildBodyContent: Array<SimpleNode> = pRootNode.nodeBody.splice(lIndex + 1, lFoundClosingIndex - (lIndex + 1));
                lChildNode.nodeBody.push(...lChildBodyContent);

                // Remove closing node.
                pRootNode.nodeBody.splice(lIndex + 1, 1);
            }
        }

        // Rekursion process all tags with possible content.
        for (const lNode of pRootNode.nodeBody) {
            if (lNode.nodeType === NodeType.OpeningTag) {
                this.packXmlContent(lNode);
            }
        }

        return pRootNode;
    }

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
type XmlParserConfig = {
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

/**
 * Simple node for better organising.
 */
class SimpleNode {
    public readonly mNodeBody: Array<SimpleNode>;
    public mNodeHead: string;
    public mNodeName: string;
    public readonly mNodeType: NodeType;

    /**
     * Node body. Sorted.
     */
    public get nodeBody(): Array<SimpleNode> {
        return this.mNodeBody;
    }

    /**
     * Get node head.
     */
    public get nodeHead(): string {
        return this.mNodeHead;
    }

    /**
     * Set node head.
     */
    public set nodeHead(pHead: string) {
        this.mNodeHead = pHead;
    }

    /**
     * Get node name. Cant have any name if node is a text node.
     */
    public get nodeName(): string {
        return this.mNodeName;
    }

    /**
     * Set node name.
     */
    public set nodeName(pName: string) {
        this.mNodeName = pName;
    }

    /**
     * Get type of node.
     */
    public get nodeType(): NodeType {
        return this.mNodeType;
    }

    /**
     * Constructor.
     * Create new simple node.
     */
    public constructor(pNodeType: NodeType) {
        this.mNodeBody = new Array<SimpleNode>();
        this.mNodeHead = '';
        this.mNodeName = '';
        this.mNodeType = pNodeType;
    }
}

/**
 * Information that can be get from attribute strings.
 */
type AttributeInformation = {
    name: string,
    namespacePrefix: string | null,
    value: string,
};

/**
 * Xml node information from tagname.
 */
type XmlElementTagNameInformation = {
    name: string,
    namespacePrefix: string | null,
};

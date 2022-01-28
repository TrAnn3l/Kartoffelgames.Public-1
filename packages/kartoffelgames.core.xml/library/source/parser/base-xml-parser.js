"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseXmlParser = void 0;
const node_type_1 = require("../enum/node-type");
const core_data_1 = require("@kartoffelgames/core.data");
const xml_document_1 = require("../document/xml-document");
/**
 * XML parser. Can handle none XML conform styles with different parser modes.
 */
class BaseXmlParser {
    /**
     * Constructor. Creates parser with specified mode.
     * @param pParserMode - Mode how parser handles different characters.
     */
    constructor(pParserConfig = {}) {
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
    parse(pXmlString) {
        const lRegexString = new RegExp(/"[^"]*"/gs);
        const lRegexXmlParts = new RegExp(/<[^>]*>|[^<>]*/gs);
        // Wrapp xml string inside root node.
        let lXmlString = `<${BaseXmlParser.ROOT_NODE_NAME}>${pXmlString}</${BaseXmlParser.ROOT_NODE_NAME}>`;
        // Escape greater than and lower than inside strings.
        lXmlString = lXmlString.replace(lRegexString, (pMatch) => {
            return pMatch.replace('<', '&ltxp;').replace('>', '&gtxp;');
        });
        // Break Xml into parts and filter empty lines.
        const lXmlPartList = lXmlString.match(lRegexXmlParts).filter((pValue) => {
            return pValue && !pValue.match(/^\s*$/);
        });
        // Convert xml parts to more specified simple nodes.
        const lXmlElementList = lXmlPartList.map((pValue) => {
            const lNode = new SimpleNode();
            lNode.nodeHead = pValue;
            lNode.nodeType = this.getNodeType(pValue);
            // If node is not a text node and not comment, add NodeName.
            if (lNode.nodeType !== node_type_1.NodeType.Text && lNode.nodeType !== node_type_1.NodeType.Comment) {
                lNode.nodeName = this.getNodeName(lNode.nodeHead);
            }
            return lNode;
        });
        // Remove closing tag.
        lXmlElementList.splice(lXmlElementList.length - 1, 1);
        // Pack all content into previously added root node.
        let lRootNode = lXmlElementList.splice(0, 1)[0];
        lRootNode.nodeBody.push(...lXmlElementList);
        // Pack node into correct child nodes.
        lRootNode = this.packXmlContent(lRootNode);
        // Convert root SimpleNode to xml node. Root node can only be xml node.
        const lConvertedRootNode = this.convertSimpleNode(lRootNode);
        // Add all ROOT-NODE childs to document.
        const lDocument = new xml_document_1.XmlDocument(this.getDefaultNamespace());
        lDocument.appendChild(...lConvertedRootNode.childList);
        return lDocument;
    }
    /**
     * Convert simple node to xml nodes.
     * @param pSimpleNode - Complete simple node.
     */
    convertSimpleNode(pSimpleNode) {
        if (pSimpleNode.nodeType === node_type_1.NodeType.OpeningTag || pSimpleNode.nodeType === node_type_1.NodeType.EmptyTag) {
            // Find attributes and namespaces.
            const lAttributes = this.getAttributesFromString(this.getAttributeString(pSimpleNode));
            // Get namespace information for xml node.
            const lNodeNamespaceInfo = this.getXmlElementInformation(pSimpleNode.nodeName);
            // Create new node.
            const lResultNode = new (this.getXmlElementConstructor())();
            lResultNode.tagName = lNodeNamespaceInfo.name;
            lResultNode.namespacePrefix = lNodeNamespaceInfo.namespacePrefix;
            // Add attributes to new node.
            for (const lAttribute of lAttributes) {
                lResultNode.setAttribute(lAttribute.name, lAttribute.value, lAttribute.namespacePrefix);
            }
            // Add all child element.
            for (const lChild of pSimpleNode.nodeBody) {
                const lXmlNode = this.convertSimpleNode(lChild);
                // Do not add wrong or empty nodes.
                if (lXmlNode) {
                    lResultNode.appendChild(lXmlNode);
                }
            }
            return lResultNode;
        }
        else if (pSimpleNode.nodeType === node_type_1.NodeType.Text) {
            // Text. Create text node. Remove quotation.
            const lTextNode = new (this.getTextNodeConstructor())();
            lTextNode.text = pSimpleNode.nodeHead.replace(/^"/, '').replace(/"$/, '').replace('&ltxp;', '<').replace('&gtxp;', '>');
            return lTextNode;
        }
        else if (pSimpleNode.nodeType === node_type_1.NodeType.Comment && !this.mConfig.removeComments) {
            // Comment. Create comment node.
            const lCommentNode = new (this.geCommentNodeConstructor())();
            lCommentNode.text = pSimpleNode.nodeHead.substr(4, pSimpleNode.nodeHead.length - 7).trim();
            return lCommentNode;
        }
        return undefined;
    }
    /**
     * Escape text to be inserted into an regex.
     * @param pText - String.
     */
    escapeRegExp(pText) {
        return pText.replace(/[.*+?^${}()\-|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    /**
     * Get attribute string of node. Removes opening and closing lower/greater than and tagname.
     * @param pSimpleNode - Simple node. Only opening and empty nodes.
     */
    getAttributeString(pSimpleNode) {
        let lNodeString = pSimpleNode.nodeHead;
        // Remove opening lower than and tagname.
        // ^\<\s*[TAGNAME]
        const lRegexOpeningLowerThanTagName = new RegExp(`^<\\s*[${this.mConfig.allowedTagNameCharacters}]+`);
        // Remove from node string.
        lNodeString = lNodeString.replace(lRegexOpeningLowerThanTagName, '');
        // Remove closing greater than from node string.
        if (pSimpleNode.nodeType === node_type_1.NodeType.OpeningTag) {
            lNodeString = lNodeString.replace(/\s*>$/, '');
        }
        else {
            // Is Empty Tag
            lNodeString = lNodeString.replace(/\s*\/\s*>$/, '');
        }
        return lNodeString;
    }
    /**
     * Get attributes from attribute string. Override oldest attribute if dubicate.
     * @param pAttributeString - Attribute string. String that only contains attributes.
     */
    getAttributesFromString(pAttributeString) {
        const lAttributes = new Array();
        const lRegexAttributeParts = new RegExp(/([^\s=]+)(="([^"]*)")?|([^\s]+)/gs);
        const lRegexNameCheck = new RegExp(`^[${this.mConfig.allowedAttributeCharacters}]+$`);
        // Iterate over each attribute.
        let lAttributeParts;
        while ((lAttributeParts = lRegexAttributeParts.exec(pAttributeString))) {
            // Check noneparseable regex group.
            if (lAttributeParts[4]) {
                throw new core_data_1.Exception(`Can't parse attribute part: "${lAttributeParts[4]}"`, this);
            }
            let lNamespacePrefix = null;
            let lName = lAttributeParts[1];
            const lValue = lAttributeParts[3] ?? '';
            // Check if name is correct.
            if (!lRegexNameCheck.test(lName)) {
                throw new core_data_1.Exception(`Can't parse attribute name: "${lName}"`, this);
            }
            // Split name with namespace prefix.
            const lAttributeNameParts = /(([^\s]+):)?([^\s]+)/.exec(lAttributeParts[1]);
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
    getNodeName(pXmlPart) {
        const lRegexPossibleTagName = new RegExp(/<[\s/]*([^\s></]+)/);
        const lRegexNameCheck = new RegExp(`^[${this.mConfig.allowedTagNameCharacters}]+$`);
        // Test if node starts and ends with lower/greater than.
        const lTagName = lRegexPossibleTagName.exec(pXmlPart);
        // Only return tagname if found and correct name syntax.
        if (lTagName && lRegexNameCheck.test(lTagName[1])) {
            return lTagName[1];
        }
        // Throw exception if no name was found.
        throw new core_data_1.Exception(`Error resolving XML-Tagname from "${pXmlPart}"`, this);
    }
    /**
     * Get type of node from node syntax.
     * Must start and end with lower or greater than or none of both.
     * @param pXmlPart - Part of xml. Text, closing, opening or empty node as string.
     */
    getNodeType(pXmlPart) {
        // Check if node starts with lower than.
        if (pXmlPart.startsWith('</')) {
            return node_type_1.NodeType.ClosingTag;
        }
        else if (pXmlPart.startsWith('<!--')) {
            return node_type_1.NodeType.Comment;
        }
        else if (pXmlPart.startsWith('<')) {
            // Check if Tag gets closed by greater than.
            if (pXmlPart.endsWith('/>')) {
                return node_type_1.NodeType.EmptyTag;
            }
            else {
                // Single lower than.
                return node_type_1.NodeType.OpeningTag;
            }
        }
        // Default: Text.
        return node_type_1.NodeType.Text;
    }
    /**
     * Get xml node information from tagnames.
     * @param pFullQualifiedTagName - Full qualified tagname with namespace prefix.
     */
    getXmlElementInformation(pFullQualifiedTagName) {
        let lTagname;
        let lNamespacePrefix;
        // Find namespace prefix and tagname of qualified tagname.
        const lTagnameGroups = /(([^\s]+):)?([^\s]+)/.exec(pFullQualifiedTagName);
        // If namespace before tagname exists.
        if (lTagnameGroups[2]) {
            lTagname = lTagnameGroups[3];
            lNamespacePrefix = lTagnameGroups[2];
        }
        else {
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
    packXmlContent(pRootNode) {
        // For each content inside simple node.
        for (let lIndex = 0; lIndex < pRootNode.nodeBody.length; lIndex++) {
            const lChildNode = pRootNode.nodeBody[lIndex];
            // If closing tags should be processed, no opening tag was before closing tag.
            if (lChildNode.nodeType === node_type_1.NodeType.ClosingTag) {
                throw new core_data_1.Exception(`Error unexpected closing XML-Tag ${lChildNode.nodeName}`, this);
            }
            else if (lChildNode.nodeType === node_type_1.NodeType.OpeningTag) {
                let lTagLevel = 0;
                let lFoundClosingIndex = -1;
                // Find closing tag.
                for (let lChildIndex = lIndex + 1; lChildIndex < pRootNode.nodeBody.length; lChildIndex++) {
                    const lSearchNode = pRootNode.nodeBody[lChildIndex];
                    // Found tag with same name.
                    if (lSearchNode.nodeName === lChildNode.nodeName) {
                        // Check if closing tag. If not closing, add new level.
                        if (lSearchNode.nodeType === node_type_1.NodeType.OpeningTag) {
                            lTagLevel++;
                        }
                        else if (lSearchNode.nodeType !== node_type_1.NodeType.EmptyTag) {
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
                    throw new core_data_1.Exception(`Error closing XML-Tag ${lChildNode.nodeName}`, this);
                }
                // Remove content for child node from root node and add to child node.
                const lChildBodyContent = pRootNode.nodeBody.splice(lIndex + 1, lFoundClosingIndex - (lIndex + 1));
                lChildNode.nodeBody.push(...lChildBodyContent);
                // Remove closing node.
                pRootNode.nodeBody.splice(lIndex + 1, 1);
            }
        }
        // Rekursion process all tags with possible content.
        for (const lNode of pRootNode.nodeBody) {
            if (lNode.nodeType === node_type_1.NodeType.OpeningTag) {
                this.packXmlContent(lNode);
            }
        }
        return pRootNode;
    }
}
exports.BaseXmlParser = BaseXmlParser;
BaseXmlParser.ROOT_NODE_NAME = 'ROOT-NODE';
/**
 * Simple node for better organising.
 */
class SimpleNode {
    /**
     * Constructor.
     * Create new simple node.
     */
    constructor() {
        this.nodeBody = new Array();
    }
}
//# sourceMappingURL=base-xml-parser.js.map
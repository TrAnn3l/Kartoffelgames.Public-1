"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextNode = void 0;
const base_xml_node_1 = require("./base-xml-node");
/**
 * Node only contains text.
 */
class TextNode extends base_xml_node_1.BaseXmlNode {
    /**
     * Constructor.
     */
    constructor() {
        super();
        this.text = '';
    }
    /**
     * Get nodes namespace.
     */
    get defaultNamespace() {
        return this.parent?.defaultNamespace ?? null;
    }
    /**
     * Get text string of node.
     */
    get text() {
        return this.mText;
    }
    /**
     * Set text string of node.
     * @param pText - Text of node.
     */
    set text(pText) {
        this.mText = pText;
    }
    /**
     * Clone current node.
     */
    clone() {
        const lTextNodeClone = new TextNode();
        lTextNodeClone.text = this.text;
        return lTextNodeClone;
    }
    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    equals(pBaseNode) {
        return pBaseNode instanceof TextNode && pBaseNode.text === this.text;
    }
}
exports.TextNode = TextNode;
//# sourceMappingURL=text-node.js.map
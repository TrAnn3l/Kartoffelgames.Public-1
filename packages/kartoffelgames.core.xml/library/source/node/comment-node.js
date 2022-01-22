"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentNode = void 0;
const base_xml_node_1 = require("./base-xml-node");
/**
 * Node only contains text.
 */
class CommentNode extends base_xml_node_1.BaseXmlNode {
    /**
     * Get nodes namespace.
     */
    get defaultNamespace() {
        var _a, _b;
        return (_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.defaultNamespace) !== null && _b !== void 0 ? _b : null;
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
        const lCommentNodeClone = new CommentNode();
        lCommentNodeClone.text = this.text;
        return lCommentNodeClone;
    }
    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    equals(pBaseNode) {
        return pBaseNode instanceof CommentNode && pBaseNode.text === this.text;
    }
}
exports.CommentNode = CommentNode;
//# sourceMappingURL=comment-node.js.map
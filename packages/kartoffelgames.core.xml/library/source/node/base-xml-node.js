"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseXmlNode = void 0;
/**
 * Basic node.
 */
class BaseXmlNode {
    /**
     * Get xml nodes document.
     */
    get document() {
        return this.parent?.document ?? null;
    }
    /**
     * Get Parent of node.
     */
    get parent() {
        return this.mParent ?? null;
    }
    /**
     * Set parent of node.
     */
    set parent(pParent) {
        this.mParent = pParent;
    }
}
exports.BaseXmlNode = BaseXmlNode;
//# sourceMappingURL=base-xml-node.js.map
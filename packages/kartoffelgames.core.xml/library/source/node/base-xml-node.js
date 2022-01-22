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
        var _a, _b;
        return (_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.document) !== null && _b !== void 0 ? _b : null;
    }
    /**
     * Get Parent of node.
     */
    get parent() {
        var _a;
        return (_a = this.mParent) !== null && _a !== void 0 ? _a : null;
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
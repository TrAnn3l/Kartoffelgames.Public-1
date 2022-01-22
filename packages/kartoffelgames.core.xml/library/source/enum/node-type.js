"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeType = void 0;
/**
 * Type of xml node.
 */
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Text"] = 1] = "Text";
    NodeType[NodeType["EmptyTag"] = 2] = "EmptyTag";
    NodeType[NodeType["OpeningTag"] = 3] = "OpeningTag";
    NodeType[NodeType["ClosingTag"] = 4] = "ClosingTag";
    NodeType[NodeType["Comment"] = 5] = "Comment";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
//# sourceMappingURL=node-type.js.map
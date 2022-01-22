"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlParser = exports.CommentNode = exports.XmlDocument = exports.XmlAttribute = exports.NodeType = exports.XmlElement = exports.TextNode = exports.BaseXmlNode = exports.BaseXmlParser = void 0;
// Exports for package.
var base_xml_parser_1 = require("./parser/base-xml-parser");
Object.defineProperty(exports, "BaseXmlParser", { enumerable: true, get: function () { return base_xml_parser_1.BaseXmlParser; } });
var base_xml_node_1 = require("./node/base-xml-node");
Object.defineProperty(exports, "BaseXmlNode", { enumerable: true, get: function () { return base_xml_node_1.BaseXmlNode; } });
var text_node_1 = require("./node/text-node");
Object.defineProperty(exports, "TextNode", { enumerable: true, get: function () { return text_node_1.TextNode; } });
var xml_element_1 = require("./node/xml-element");
Object.defineProperty(exports, "XmlElement", { enumerable: true, get: function () { return xml_element_1.XmlElement; } });
var node_type_1 = require("./enum/node-type");
Object.defineProperty(exports, "NodeType", { enumerable: true, get: function () { return node_type_1.NodeType; } });
var xml_attribute_1 = require("./attribute/xml-attribute");
Object.defineProperty(exports, "XmlAttribute", { enumerable: true, get: function () { return xml_attribute_1.XmlAttribute; } });
var xml_document_1 = require("./document/xml-document");
Object.defineProperty(exports, "XmlDocument", { enumerable: true, get: function () { return xml_document_1.XmlDocument; } });
var comment_node_1 = require("./node/comment-node");
Object.defineProperty(exports, "CommentNode", { enumerable: true, get: function () { return comment_node_1.CommentNode; } });
var xml_parser_1 = require("./parser/xml-parser");
Object.defineProperty(exports, "XmlParser", { enumerable: true, get: function () { return xml_parser_1.XmlParser; } });
//# sourceMappingURL=index.js.map
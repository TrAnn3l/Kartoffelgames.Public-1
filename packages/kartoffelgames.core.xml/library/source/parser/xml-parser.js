"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlParser = void 0;
const comment_node_1 = require("../node/comment-node");
const text_node_1 = require("../node/text-node");
const xml_element_1 = require("../node/xml-element");
const base_xml_parser_1 = require("./base-xml-parser");
class XmlParser extends base_xml_parser_1.BaseXmlParser {
    /**
     * Get Comment node constructor.
     */
    geCommentNodeConstructor() {
        return comment_node_1.CommentNode;
    }
    /**
     * Get documents default namespace.
     */
    getDefaultNamespace() {
        return 'http://www.w3.org/1999/xhtml';
    }
    /**
     * Get Text node constructor.
     */
    getTextNodeConstructor() {
        return text_node_1.TextNode;
    }
    /**
     * Get XML Element constructor.
     */
    getXmlElementConstructor() {
        return xml_element_1.XmlElement;
    }
}
exports.XmlParser = XmlParser;
//# sourceMappingURL=xml-parser.js.map
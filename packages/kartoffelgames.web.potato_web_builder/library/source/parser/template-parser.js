"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateParser = void 0;
const core_xml_1 = require("@kartoffelgames/core.xml");
/**
 * XML parser for parsing template strings.
 */
class TemplateParser extends core_xml_1.XmlParser {
    /**
     * Constructor.
     * Set new setting for parsing attributes with special characters and remove comments.
     */
    constructor() {
        super({
            // Attribute name with everything.
            allowedAttributeCharacters: 'abcdefghijklmnopqrstuvwxyz_:-.1234567890*[]()$§%&?#',
            // Remove user comments.
            removeComments: true
        });
    }
}
exports.TemplateParser = TemplateParser;
//# sourceMappingURL=template-parser.js.map
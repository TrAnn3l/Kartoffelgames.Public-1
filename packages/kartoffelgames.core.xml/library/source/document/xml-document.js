"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlDocument = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const base_xml_node_1 = require("../node/base-xml-node");
/**
 * XMLDocument.
 */
class XmlDocument extends base_xml_node_1.BaseXmlNode {
    /**
     * Constructor.
     */
    constructor(pDefaultNamespace) {
        super();
        this.mDefaultNamespace = pDefaultNamespace;
        this.mBodyElementList = new core_data_1.List();
    }
    /**
     * Get nodes namespace.
     */
    get defaultNamespace() {
        return this.mDefaultNamespace;
    }
    /**
     * Get all document xml nodes.
     */
    get body() {
        return this.mBodyElementList.clone();
    }
    /**
     * Get xml nodes document.
     */
    get document() {
        return this;
    }
    /**
     * Append child to document body.
     * @param pXmlNode - Xml node.
     */
    appendChild(...pXmlNodeList) {
        this.mBodyElementList.push(...pXmlNodeList);
        for (const lChildNode of pXmlNodeList) {
            lChildNode.parent = this;
        }
    }
    /**
     * Clonse document with all nodes.
     */
    clone() {
        const lXmlDocument = new XmlDocument(this.defaultNamespace);
        // Clone all child nodes.
        for (const lXmlNode of this.mBodyElementList) {
            lXmlDocument.appendChild(lXmlNode.clone());
        }
        return lXmlDocument;
    }
    /**
     * Compare two documents for equality.
     * @param pBaseNode - Node that should be compared.
     */
    equals(pBaseNode) {
        // Check type, tagname, namespace and namespace prefix.
        if (!(pBaseNode instanceof XmlDocument)) {
            return false;
        }
        // Same namespace.
        if (pBaseNode.mDefaultNamespace !== this.mDefaultNamespace) {
            return false;
        }
        // Same length
        if (pBaseNode.body.length !== this.body.length) {
            return false;
        }
        // Compare each body element.
        for (let lIndex = 0; lIndex < this.body.length; lIndex++) {
            if (!this.body[lIndex].equals(pBaseNode.body[lIndex])) {
                return false;
            }
        }
        return true;
    }
}
exports.XmlDocument = XmlDocument;
//# sourceMappingURL=xml-document.js.map
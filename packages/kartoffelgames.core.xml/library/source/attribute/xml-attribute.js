"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlAttribute = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
/**
 * Xml attribute. Can handle values with lists or string.
 */
class XmlAttribute {
    constructor(pName, pNamespacePrefix = null, pSeperator = ' ') {
        this.mValues = new core_data_1.List();
        this.mName = pName;
        this.mSeperator = pSeperator;
        this.mNamespacePrefix = pNamespacePrefix;
    }
    /**
     * Get attribute name without namespace prefix.
     */
    get name() {
        return this.mName;
    }
    /**
     * Namespace.
     */
    get namespace() {
        // Check if attribute is append and has an prefix.
        if (this.xmlElement && this.namespacePrefix) {
            return this.xmlElement.getNamespace(this.namespacePrefix);
        }
        // Default namespace is allways null.
        return null;
    }
    /**
     * Namespace key of attribute.
     */
    get namespacePrefix() {
        return this.mNamespacePrefix;
    }
    /**
     * Xml element of attribute.
     */
    get xmlElement() {
        return this.mXmlElement;
    }
    /**
     * Xml element of attribute.
     */
    set xmlElement(pXmlElement) {
        this.mXmlElement = pXmlElement;
    }
    /**
     * Get attribute name with namespace prefix.
     */
    get qualifiedName() {
        if (this.mNamespacePrefix) {
            return `${this.mNamespacePrefix}:${this.mName}`;
        }
        else {
            return this.mName;
        }
    }
    /**
     * Seperator values get joined.
     */
    get seperator() {
        return this.mSeperator;
    }
    /**
     * Get value list as string.
     */
    get value() {
        return this.mValues.join(this.mSeperator);
    }
    /**
     * Set value list as string.
     */
    set value(pValue) {
        // Clear list.
        this.mValues.splice(0, this.mValues.length);
        // Split with seperator and add to value list.
        this.mValues.push(...pValue.split(this.mSeperator));
    }
    /**
     * Get value list.
     */
    get valueList() {
        return this.mValues.clone();
    }
}
exports.XmlAttribute = XmlAttribute;
//# sourceMappingURL=xml-attribute.js.map
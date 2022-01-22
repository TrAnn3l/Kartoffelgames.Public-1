"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlElement = void 0;
const xml_attribute_1 = require("../attribute/xml-attribute");
const base_xml_node_1 = require("./base-xml-node");
const core_data_1 = require("@kartoffelgames/core.data");
const core_data_2 = require("@kartoffelgames/core.data");
/**
 * Xml node.
 */
class XmlElement extends base_xml_node_1.BaseXmlNode {
    /**
     * Constructor.
     */
    constructor() {
        super();
        this.mAttributeDictionary = new core_data_1.Dictionary();
        this.mChildList = Array();
    }
    /**
     * Get all attributes from xml node.
     */
    get attributeList() {
        return core_data_2.List.newListWith(...this.mAttributeDictionary.values());
    }
    /**
     * Get childs of xml node list.
     */
    get childList() {
        return core_data_2.List.newListWith(...this.mChildList);
    }
    /**
     * Namespace of xml node.
     */
    get namespace() {
        // Prefix has high priority.
        if (this.namespacePrefix) {
            return this.getNamespace(this.namespacePrefix);
        }
        // Default namespace.
        return this.defaultNamespace;
    }
    /**
     * Get default namespace.
     */
    get defaultNamespace() {
        var _a;
        // Get default namespace.
        return (_a = this.getNamespace()) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Get namespace prefix of xml node.
     */
    get namespacePrefix() {
        var _a;
        return (_a = this.mNamespacePrefix) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Set namespace prefix of xml node.
     */
    set namespacePrefix(pNamespacePrefix) {
        this.mNamespacePrefix = pNamespacePrefix;
    }
    /**
     * Qualified tagname with namespace prefix.
     */
    get qualifiedTagName() {
        if (this.mNamespacePrefix) {
            return `${this.mNamespacePrefix}:${this.mTagName}`;
        }
        else {
            return this.mTagName;
        }
    }
    /**
     * Get tagname without namespace prefix.
     */
    get tagName() {
        var _a;
        return (_a = this.mTagName) !== null && _a !== void 0 ? _a : '';
    }
    /**
     * Set tagname without namespace prefix.
     */
    set tagName(pTagName) {
        this.mTagName = pTagName;
    }
    /**
     * Add child node to node list.
     * @param pNode - Base node.
     */
    appendChild(...pNode) {
        // Set parent for each child and remove child from previous parent.
        for (const lChild of pNode) {
            // If child has already parent.
            if (lChild.parent instanceof XmlElement) {
                lChild.parent.removeChild(lChild);
            }
            lChild.parent = this;
        }
        this.mChildList.push(...pNode);
    }
    /**
     * Clone current node.
     */
    clone() {
        const lClonedNode = new XmlElement();
        lClonedNode.tagName = this.tagName;
        lClonedNode.namespacePrefix = this.namespacePrefix;
        // Add attributes.
        for (const lAttribute of this.attributeList) {
            lClonedNode.setAttribute(lAttribute.name, lAttribute.value, lAttribute.namespacePrefix);
        }
        // Deep clone every node.
        for (const lNode of this.mChildList) {
            lClonedNode.appendChild(lNode.clone());
        }
        return lClonedNode;
    }
    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    equals(pBaseNode) {
        // Check type, tagname, namespace and namespace prefix.
        if (!(pBaseNode instanceof XmlElement) || pBaseNode.qualifiedTagName !== this.qualifiedTagName) {
            return false;
        }
        // Check same count of attributes.
        if (pBaseNode.attributeList.length !== this.attributeList.length) {
            return false;
        }
        // Check all attributes.
        for (const lAttribute of pBaseNode.mAttributeDictionary.values()) {
            // This checks also for wrong namespace prefix by checking for qualified attribute name.
            const lAttributeTwo = this.mAttributeDictionary.get(lAttribute.qualifiedName);
            if (!lAttributeTwo || lAttributeTwo.value !== lAttribute.value) {
                return false;
            }
        }
        // Check same count of childs.
        if (pBaseNode.childList.length !== this.childList.length) {
            return false;
        }
        // Deep check all childnodes
        for (let lIndex = 0; lIndex < pBaseNode.childList.length; lIndex++) {
            if (!pBaseNode.childList[lIndex].equals(this.childList[lIndex])) {
                return false;
            }
        }
        return true;
    }
    /**
     * Get attribute of xml node.
     * Returns null if attribute does not exist.
     * @param pKey - Full qualified name of attribute.
     */
    getAttribute(pKey) {
        if (this.mAttributeDictionary.has(pKey)) {
            return this.mAttributeDictionary.get(pKey);
        }
        else {
            return undefined;
        }
    }
    /**
     * Get namespace of prefix or if no prefix is set, get the default namespace.
     */
    getNamespace(pPrefix = null) {
        // Get namespace from prefix or default namespace.
        if (pPrefix) {
            const lPrefixLowerCase = pPrefix.toLowerCase();
            // Check for local prefix namespace.
            const lPrefixNamespaceAttribute = this.attributeList.find((pAttribute) => {
                var _a;
                return ((_a = pAttribute.namespacePrefix) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'xmlns' && pAttribute.name.toLowerCase() === lPrefixLowerCase;
            });
            // Return default namespace if it is defined.
            if (lPrefixNamespaceAttribute) {
                return lPrefixNamespaceAttribute.value;
            }
        }
        else {
            // Check for local default namespace.
            const lDefaultNamespaceAttribute = this.attributeList.find((pAttribute) => {
                return pAttribute.qualifiedName === 'xmlns';
            });
            // Return default namespace if it is defined.
            if (lDefaultNamespaceAttribute) {
                return lDefaultNamespaceAttribute.value;
            }
        }
        // Get parent mapping.
        if (this.parent instanceof XmlElement) {
            return this.parent.getNamespace(pPrefix);
        }
        else {
            return undefined;
        }
    }
    /**
     * Removes attribute and return if attribute was removed/existed.
     * @param pKey - Key of attribute.
     */
    removeAttribute(pKey) {
        if (this.mAttributeDictionary.has(pKey)) {
            this.mAttributeDictionary.delete(pKey);
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Remove child from XmlNode.
     * Return removed child.
     * @param pNode - Child to remove.
     */
    removeChild(pNode) {
        const lIndex = this.mChildList.indexOf(pNode);
        let lRemovedChild = undefined;
        // If list contains node.
        if (lIndex !== -1) {
            lRemovedChild = this.mChildList.splice(lIndex, 1)[0];
            // If xml node remove parent connection.
            lRemovedChild.parent = undefined;
        }
        return lRemovedChild;
    }
    /**
     * Set and get Attribute of xml node. Creates new one if attribute does not exist.
     * @param pKey - Key of attribute.
     * @param pValue - Name of attribute.
     * @param pNamespacePrefix - Namespace prefix of attribute.
     */
    setAttribute(pKey, pValue, pNamespacePrefix = null) {
        let lAttribute;
        // Create qualifed attribute name.
        let lQualifiedTagName;
        if (pNamespacePrefix) {
            lQualifiedTagName = `${pNamespacePrefix}:${pKey}`;
        }
        else {
            lQualifiedTagName = pKey;
        }
        if (this.mAttributeDictionary.has(lQualifiedTagName)) {
            lAttribute = this.mAttributeDictionary.get(lQualifiedTagName);
        }
        else {
            lAttribute = new xml_attribute_1.XmlAttribute(pKey, pNamespacePrefix);
            this.mAttributeDictionary.add(lQualifiedTagName, lAttribute);
        }
        // Set this as attributes parent xml element.
        lAttribute.xmlElement = this;
        // Set value.
        lAttribute.value = pValue;
        return lAttribute;
    }
}
exports.XmlElement = XmlElement;
//# sourceMappingURL=xml-element.js.map
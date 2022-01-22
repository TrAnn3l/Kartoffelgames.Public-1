import { XmlAttribute } from '../attribute/xml-attribute';
import { BaseXmlNode } from './base-xml-node';
/**
 * Xml node.
 */
export declare class XmlElement extends BaseXmlNode {
    private readonly mAttributeDictionary;
    private readonly mChildList;
    private mNamespacePrefix;
    private mTagName;
    /**
     * Get all attributes from xml node.
     */
    get attributeList(): Array<XmlAttribute>;
    /**
     * Get childs of xml node list.
     */
    get childList(): Array<BaseXmlNode>;
    /**
     * Namespace of xml node.
     */
    get namespace(): string;
    /**
     * Get default namespace.
     */
    get defaultNamespace(): string;
    /**
     * Get namespace prefix of xml node.
     */
    get namespacePrefix(): string;
    /**
     * Set namespace prefix of xml node.
     */
    set namespacePrefix(pNamespacePrefix: string);
    /**
     * Qualified tagname with namespace prefix.
     */
    get qualifiedTagName(): string;
    /**
     * Get tagname without namespace prefix.
     */
    get tagName(): string;
    /**
     * Set tagname without namespace prefix.
     */
    set tagName(pTagName: string);
    /**
     * Constructor.
     */
    constructor();
    /**
     * Add child node to node list.
     * @param pNode - Base node.
     */
    appendChild(...pNode: Array<BaseXmlNode>): void;
    /**
     * Clone current node.
     */
    clone(): XmlElement;
    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    equals(pBaseNode: BaseXmlNode): boolean;
    /**
     * Get attribute of xml node.
     * Returns null if attribute does not exist.
     * @param pKey - Full qualified name of attribute.
     */
    getAttribute(pKey: string): XmlAttribute;
    /**
     * Get namespace of prefix or if no prefix is set, get the default namespace.
     */
    getNamespace(pPrefix?: string): string;
    /**
     * Removes attribute and return if attribute was removed/existed.
     * @param pKey - Key of attribute.
     */
    removeAttribute(pKey: string): boolean;
    /**
     * Remove child from XmlNode.
     * Return removed child.
     * @param pNode - Child to remove.
     */
    removeChild(pNode: BaseXmlNode): BaseXmlNode;
    /**
     * Set and get Attribute of xml node. Creates new one if attribute does not exist.
     * @param pKey - Key of attribute.
     * @param pValue - Name of attribute.
     */
    setAttribute(pKey: string, pValue: string): XmlAttribute;
    /**
     * Set and get Attribute of xml node. Creates new one if attribute does not exist.
     * @param pKey - Key of attribute.
     * @param pValue - Name of attribute.
     * @param pNamespacePrefix - Namespace prefix of attribute.
     */
    setAttribute(pKey: string, pValue: string, pNamespacePrefix: string): XmlAttribute;
}
//# sourceMappingURL=xml-element.d.ts.map
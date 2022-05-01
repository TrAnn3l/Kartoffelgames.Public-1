import { XmlAttribute } from '../attribute/xml-attribute';
import { BaseXmlNode } from './base-xml-node';
import { Dictionary } from '@kartoffelgames/core.data';
import { List } from '@kartoffelgames/core.data';

/**
 * Xml node.
 */
export class XmlElement extends BaseXmlNode {
    private readonly mAttributeDictionary: Dictionary<string, XmlAttribute>;
    private readonly mChildList: Array<BaseXmlNode>;
    private mNamespacePrefix: string;
    private mTagName: string;

    /**
     * Get all attributes from xml node.
     */
    public get attributeList(): Array<XmlAttribute> {
        return List.newListWith(...this.mAttributeDictionary.values());
    }

    /**
     * Get childs of xml node list.
     */
    public get childList(): Array<BaseXmlNode> {
        return List.newListWith(...this.mChildList);
    }

    /**
     * Get default namespace.
     */
    public get defaultNamespace(): string {
        // Get default namespace.
        return this.getNamespace() ?? null;
    }

    /**
     * Namespace of xml node.
     */
    public get namespace(): string {
        // Prefix has high priority.
        if (this.namespacePrefix) {
            return this.getNamespace(this.namespacePrefix);
        }

        // Default namespace.
        return this.defaultNamespace;
    }

    /**
     * Get namespace prefix of xml node.
     */
    public get namespacePrefix(): string {
        return this.mNamespacePrefix ?? null;
    }

    /**
     * Set namespace prefix of xml node.
     */
    public set namespacePrefix(pNamespacePrefix: string) {
        this.mNamespacePrefix = pNamespacePrefix;
    }

    /**
     * Qualified tagname with namespace prefix.
     */
    public get qualifiedTagName(): string {
        if (this.mNamespacePrefix) {
            return `${this.mNamespacePrefix}:${this.mTagName}`;
        } else {
            return this.mTagName;
        }
    }

    /**
     * Get tagname without namespace prefix.
     */
    public get tagName(): string {
        return this.mTagName ?? '';
    }

    /**
     * Set tagname without namespace prefix.
     */
    public set tagName(pTagName: string) {
        this.mTagName = pTagName;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();
        this.mAttributeDictionary = new Dictionary<string, XmlAttribute>();
        this.mChildList = Array<BaseXmlNode>();
    }

    /**
     * Add child node to node list.
     * @param pNode - Base node.
     */
    public appendChild(...pNode: Array<BaseXmlNode>): void {
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
    public clone(): XmlElement {
        const lClonedNode: XmlElement = new XmlElement();
        lClonedNode.tagName = this.tagName;
        lClonedNode.namespacePrefix = this.namespacePrefix;

        // Add attributes.
        for (const lAttribute of this.attributeList) {
            lClonedNode.setAttribute(
                lAttribute.name,
                lAttribute.value,
                lAttribute.namespacePrefix
            );
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
    public equals(pBaseNode: BaseXmlNode): boolean {
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
            const lAttributeTwo: XmlAttribute = this.mAttributeDictionary.get(lAttribute.qualifiedName);

            if (!lAttributeTwo || lAttributeTwo.value !== lAttribute.value) {
                return false;
            }
        }

        // Check same count of childs.
        if (pBaseNode.childList.length !== this.childList.length) {
            return false;
        }

        // Deep check all childnodes
        for (let lIndex: number = 0; lIndex < pBaseNode.childList.length; lIndex++) {
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
    public getAttribute(pKey: string): XmlAttribute {
        if (this.mAttributeDictionary.has(pKey)) {
            return this.mAttributeDictionary.get(pKey);
        } else {
            return undefined;
        }
    }

    /**
     * Get namespace of prefix or if no prefix is set, get the default namespace.
     */
    public getNamespace(pPrefix: string = null): string {
        // Get namespace from prefix or default namespace.
        if (pPrefix) {
            const lPrefixLowerCase: string = pPrefix.toLowerCase();

            // Check for local prefix namespace.
            const lPrefixNamespaceAttribute: XmlAttribute = this.attributeList.find((pAttribute: XmlAttribute) => {
                return pAttribute.namespacePrefix?.toLowerCase() === 'xmlns' && pAttribute.name.toLowerCase() === lPrefixLowerCase;
            });

            // Return default namespace if it is defined.
            if (lPrefixNamespaceAttribute) {
                return lPrefixNamespaceAttribute.value;
            }

            // Get prefix namespace from parent, if parent is a xml element.
            if (this.parent instanceof XmlElement) {
                return this.parent.getNamespace(pPrefix);
            }
        } else {
            // Check for local default namespace.
            const lDefaultNamespaceAttribute: XmlAttribute = this.attributeList.find((pAttribute: XmlAttribute) => {
                return pAttribute.qualifiedName === 'xmlns';
            });

            // Return default namespace if it is defined.
            if (lDefaultNamespaceAttribute) {
                return lDefaultNamespaceAttribute.value;
            }

            // Get parent mapping.
            return this.parent?.defaultNamespace ?? null;
        }

        return null;
    }

    /**
     * Removes attribute and return if attribute was removed/existed.
     * @param pKey - Key of attribute.
     */
    public removeAttribute(pKey: string): boolean {
        if (this.mAttributeDictionary.has(pKey)) {
            this.mAttributeDictionary.delete(pKey);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Remove child from XmlNode.
     * Return removed child.
     * @param pNode - Child to remove.
     */
    public removeChild(pNode: BaseXmlNode): BaseXmlNode {
        const lIndex: number = this.mChildList.indexOf(pNode);
        let lRemovedChild: BaseXmlNode = undefined;

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
     */
    public setAttribute(pKey: string, pValue: string): XmlAttribute;

    /**
     * Set and get Attribute of xml node. Creates new one if attribute does not exist.
     * @param pKey - Key of attribute.
     * @param pValue - Name of attribute.
     * @param pNamespacePrefix - Namespace prefix of attribute.
     */
    public setAttribute(pKey: string, pValue: string, pNamespacePrefix: string): XmlAttribute;

    /**
     * Set and get Attribute of xml node. Creates new one if attribute does not exist.
     * @param pKey - Key of attribute.
     * @param pValue - Name of attribute.
     * @param pNamespacePrefix - Namespace prefix of attribute.
     */
    public setAttribute(pKey: string, pValue: string, pNamespacePrefix: string = null): XmlAttribute {
        let lAttribute: XmlAttribute;

        // Create qualifed attribute name.
        let lQualifiedTagName: string;
        if (pNamespacePrefix) {
            lQualifiedTagName = `${pNamespacePrefix}:${pKey}`;
        } else {
            lQualifiedTagName = pKey;
        }

        if (this.mAttributeDictionary.has(lQualifiedTagName)) {
            lAttribute = this.mAttributeDictionary.get(lQualifiedTagName);
        } else {
            lAttribute = new XmlAttribute(pKey, pNamespacePrefix);
            this.mAttributeDictionary.add(lQualifiedTagName, lAttribute);
        }

        // Set this as attributes parent xml element.
        lAttribute.xmlElement = this;

        // Set value.
        lAttribute.value = pValue;

        return lAttribute;
    }
}
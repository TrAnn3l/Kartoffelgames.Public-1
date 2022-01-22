import { XmlElement } from '../node/xml-element';
/**
 * Xml attribute. Can handle values with lists or string.
 */
export declare class XmlAttribute {
    private readonly mName;
    private readonly mNamespacePrefix;
    private readonly mSeperator;
    private readonly mValues;
    private mXmlElement;
    /**
     * Get attribute name without namespace prefix.
     */
    get name(): string;
    /**
     * Namespace.
     */
    get namespace(): string;
    /**
     * Namespace key of attribute.
     */
    get namespacePrefix(): string;
    /**
     * Xml element of attribute.
     */
    get xmlElement(): XmlElement;
    /**
     * Xml element of attribute.
     */
    set xmlElement(pXmlElement: XmlElement);
    /**
     * Get attribute name with namespace prefix.
     */
    get qualifiedName(): string;
    /**
     * Seperator values get joined.
     */
    get seperator(): string;
    /**
     * Get value list as string.
     */
    get value(): string;
    /**
     * Set value list as string.
     */
    set value(pValue: string);
    /**
     * Get value list.
     */
    get valueList(): Array<string>;
    /**
     * Constructor.
     * Create list attribute with name and optional custom value seperator.
     * @param pName - Name of attribute.
     * @param pNamespacePrefix - Namespace prefix of attribute name.
     * @param pSeperator - Seperator values get joined.
     */
    constructor(pName: string);
    constructor(pName: string, pNamespacePrefix: string);
    constructor(pName: string, pNamespacePrefix: string, pSeperator: string);
}
//# sourceMappingURL=xml-attribute.d.ts.map
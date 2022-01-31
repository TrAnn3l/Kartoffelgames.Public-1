import { XmlElement } from '@kartoffelgames/core.xml';
export declare class ElementCreator {
    private static readonly mElementRestriction;
    /**
     * Create comment node.
     * @param pText - Comment text.
     * @returns comment with text as content.
     */
    static createComment(pText: string): Comment;
    /**
     * Create element with right namespace.
     * @param pXmlElement - Xml content node.
     * @param pParentElement - Created parent element.
     * @returns
     */
    static createElement(pXmlElement: XmlElement | string, pParentElement?: Element): Element;
    /**
     * Create text node.
     * @param pText - Text.
     * @returns text node with specified text.
     */
    static createText(pText: string): Text;
}
//# sourceMappingURL=element-creator.d.ts.map
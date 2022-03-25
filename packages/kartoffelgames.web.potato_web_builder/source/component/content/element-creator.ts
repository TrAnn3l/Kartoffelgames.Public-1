import { XmlElement } from '@kartoffelgames/core.xml';

export class ElementCreator {
    /**
     * Create comment node.
     * @param pText - Comment text.
     * @returns comment with text as content.
     */
    public static createComment(pText: string): Comment {
        return document.createComment(pText);
    }

    /**
     * Create element with correct namespace.
     * Ignores namespace information for custom elements.
     * @param pXmlElement - Xml content node.
     */
    public static createElement(pXmlElement: XmlElement): Element {
        const lNamespace: string = pXmlElement.namespace;
        const lTagname: string = pXmlElement.qualifiedTagName;

        // On custom element
        if (lTagname.includes('-')) {
            // Get custom element.
            const lCustomElement: any = window.customElements.get(lTagname);

            // Create custom element.
            if (typeof lCustomElement !== 'undefined') {
                return new lCustomElement();
            }
        }

        return document.createElementNS(lNamespace, lTagname);
    }

    /**
     * Create text node.
     * @param pText - Text.
     * @returns text node with specified text.
     */
    public static createText(pText: string): Text {
        return document.createTextNode(pText);
    }
}
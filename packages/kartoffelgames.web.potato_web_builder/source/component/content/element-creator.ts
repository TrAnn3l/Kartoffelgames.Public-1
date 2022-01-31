import { Dictionary } from '@kartoffelgames/core.data';
import { XmlElement } from '@kartoffelgames/core.xml';

export class ElementCreator {
    private static readonly mElementRestriction: Dictionary<string, ElementRestriction> = (() => {
        const lElementRestriction: Dictionary<string, ElementRestriction> = new Dictionary<string, ElementRestriction>();

        // SVG-Elements // http://www.w3.org/2000/svg
        lElementRestriction.add('svg', { namespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('a', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('altGlyph', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('altGlyphDef', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('altGlyphItem', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('animate', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('animateColor', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('animateMotion', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('animateTransform', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('circle', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('clipPath', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('color-profile', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('cursor', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('defs', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('desc', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('ellipse', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feBlend', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feColorMatrix', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feComponentTransfer', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feComposite', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feConvolveMatrix', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feDiffuseLighting', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feDisplacementMap', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feDistantLight', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feFlood', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feFuncA', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feFuncB', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feFuncG', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feFuncR', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feGaussianBlur', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feImage', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feMerge', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feMergeNode', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feMorphology', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feOffset', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('fePointLight', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feSpecularLighting', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feSpotLight', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feTile', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('feTurbulence', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('filter', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('font', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('font-face', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('font-face-format', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('font-face-name', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('font-face-src', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('font-face-uri', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('foreignObject', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('g', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('glyph', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('glyphRef', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('hkern', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('image', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('line', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('linearGradient', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('marker', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('mask', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('metadata', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('missing-glyph', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('mpath', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('path', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('pattern', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('polygon', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('polyline', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('radialGradient', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('rect', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('script', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('set', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('stop', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('style', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('switch', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('symbol', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('text', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('textPath', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('title', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('tref', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('tspan', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('use', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('view', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });
        lElementRestriction.add('vkern', { namespace: 'http://www.w3.org/2000/svg', parentNamespace: 'http://www.w3.org/2000/svg' });

        return lElementRestriction;
    })();

    /**
     * Create comment node.
     * @param pText - Comment text.
     * @returns comment with text as content.
     */
    public static createComment(pText: string): Comment {
        return document.createComment(pText);
    }

    /**
     * Create element with right namespace.
     * @param pXmlElement - Xml content node.
     * @param pParentElement - Created parent element.
     * @returns 
     */
    public static createElement(pXmlElement: XmlElement | string, pParentElement?: Element): Element {
        const lTagname: string = typeof pXmlElement === 'string' ? pXmlElement : pXmlElement.tagName;
        let lNamespace: string = typeof pXmlElement === 'string' ? null : pXmlElement.namespace;

        // On custom element
        if (lTagname.includes('-')) {
            // Get custom element.
            const lCustomElement: any = window.customElements.get(lTagname);

            // Create custom element.
            if (typeof lCustomElement !== 'undefined') {
                return new lCustomElement();
            }
        }

        const lElementRestriction: ElementRestriction = ElementCreator.mElementRestriction.get(lTagname.toLowerCase());

        // If element has restrictions.
        if (lElementRestriction && !lNamespace) {
            // If element has no parent namespace restiction or meets restriction.
            if (!lElementRestriction.parentNamespace || lElementRestriction.parentNamespace === pParentElement?.namespaceURI) {
                lNamespace = lElementRestriction.namespace;
            }
        }

        let lCreatedElement: Element;

        // Create namespace element if namespace is defined.
        if (!lNamespace) {
            lCreatedElement = document.createElement(lTagname);
        } else {
            lCreatedElement = document.createElementNS(lNamespace, lTagname);
        }

        return lCreatedElement;
    }

    /**
     * Create text node.
     * @param pText - Text.
     * @returns text node with specified text.
     */
    public static createText(pText: string): Text {
        // Decode html encoded text.
        const lDecodedText: string = pText.replace(/&#(\d+);/g, (_pFullMatch, pCharAsDecimal) => {
            return String.fromCharCode(pCharAsDecimal);
        });

        return document.createTextNode(lDecodedText);
    }
}

/**
 * Specifes element restrinction.
 */
type ElementRestriction = {
    namespace: string,
    parentNamespace?: string;
};

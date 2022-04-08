export class ElementHandler {
    private readonly mHtmlElement: HTMLElement;
    private readonly mShadowRoot: ShadowRoot;

    /**
     * Get html element.
     */
    public get htmlElement(): HTMLElement {
        return this.mHtmlElement;
    }

    /**
     * Elements shadow root.
     */
    public get shadowRoot(): ShadowRoot {
        return this.mShadowRoot;
    }

    /**
     * Constructor.
     * @param pHtmlElement - HTMLElement.
     * @param pUserObjectHandler - User object handler.
     */
    public constructor(pHtmlElement: HTMLElement) {
        this.mHtmlElement = pHtmlElement;
        this.mShadowRoot = this.mHtmlElement.attachShadow({ mode: 'open' });
    }
}
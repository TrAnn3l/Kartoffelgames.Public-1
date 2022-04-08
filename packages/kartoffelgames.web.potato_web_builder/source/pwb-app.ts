import { Exception } from '@kartoffelgames/core.data';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';
import { XmlElement } from '@kartoffelgames/core.xml';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { ComponentManager } from './component/component-manager';
import { ElementCreator } from './component/content/element-creator';

export class PwbApp {
    public static readonly PUBLIC_APP_KEY: string = '_PWB_APP';

    private readonly mAppComponent: Element;
    private readonly mChangeDetection: ChangeDetection;
    private readonly mShadowRoot: ShadowRoot;

    /**
     * Get app underlying content.
     */
    public get content(): Element {
        return this.mAppComponent;
    }

    /**
     * Constructor.
     * @param pAppName - name of app zone.
     */
    public constructor(pAppName: string) {
        this.mChangeDetection = new ChangeDetection(pAppName);

        // Create app wrapper template.
        const lAppComponentTemplate: XmlElement = new XmlElement();
        lAppComponentTemplate.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        lAppComponentTemplate.tagName = 'div';

        // Create app wrapper add name as data attribute.
        this.mAppComponent = ElementCreator.createElement(lAppComponentTemplate);
        this.mAppComponent.setAttribute('data-app', pAppName);

        // Create app shadow root.
        this.mShadowRoot = this.mAppComponent.attachShadow({ mode: 'open' });
    }

    /**
     * Append content to app.
     * @param pContentClass - Content constructor.
     */
    public addContent(pContentClass: InjectionConstructor): Element {
        // Get content selector.
        const lSelector: string = Metadata.get(pContentClass).getMetadata(ComponentManager.METADATA_SELECTOR);
        if (!lSelector) {
            throw new Exception('Content is not a component.', this);
        }

        // Create content template content is always inside xhtml namespace.
        const lContentTemplate: XmlElement = new XmlElement();
        lContentTemplate.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        lContentTemplate.tagName = lSelector;

        // Create content from template inside change detection.
        let lContent: Element;
        this.mChangeDetection.execute(() => {
            lContent = ElementCreator.createElement(lContentTemplate);

            // Append content to shadow root
            this.mShadowRoot.appendChild(lContent);
        });

        return lContent;
    }

    /**
     * Add error listener that listens for any uncatched error.
     * @param pListener - Error listener.
     */
    public addErrorListener(pListener: (pError: any) => void): void {
        this.mChangeDetection.addErrorListener(pListener);
    }

    /**
     * Create style element and prepend it to this component.
     * @param pStyle - Css style as string.
     */
    public addStyle(pStyle: string): void {
        const lStyleTemplate: XmlElement = new XmlElement();
        lStyleTemplate.tagName = 'style';
        lStyleTemplate.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

        const lStyleElement: Element = ElementCreator.createElement(lStyleTemplate);
        lStyleElement.innerHTML = pStyle;
        this.mShadowRoot.prepend(lStyleElement);
    }

    /**
     * Append app to element.
     * @param pElement - Element.
     */
    public appendTo(pElement: Element): void {
        pElement.appendChild(this.mAppComponent);
    }
}
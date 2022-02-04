import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { Exception } from '@kartoffelgames/core.data';
import { UserClass } from './interface/user-class';
import { ElementCreator } from './component/content/element-creator';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';
import { MetadataKey } from './global-key';

export class PwbApp {
    public static readonly PUBLIC_APP_KEY: string = '_PWB_APP';

    private readonly mChangeDetection: ChangeDetection;
    private readonly mContent: Array<HTMLElement>;
    private mCurrentAppRoot: HTMLDivElement;
    private mCurrentAppRootShadowRoot: ShadowRoot;
    private readonly mStyles: Array<HTMLStyleElement>;

    /**
     * Get change detection of this app.
     */
    public get changeDetection(): ChangeDetection {
        return this.mChangeDetection;
    }

    /**
     * Get App name.
     */
    private get appName(): string {
        return this.changeDetection.name;
    }

    /**
     * Constructor.
     * Create app with content, name and target element where the content will be inserted.
     * @param pAppName - Name of this app. Only for debug.
     * @param pConfig - App config.
     */
    public constructor(pAppName: string, pConfig?: PwbAppConfig) {
        this.mContent = new Array<HTMLElement>();
        this.mStyles = new Array<HTMLStyleElement>();
        this.mCurrentAppRootShadowRoot = null;
        this.mCurrentAppRoot = null;

        // Create new change detection.
        this.mChangeDetection = new ChangeDetection(pAppName);

        // Set app as zones data.
        this.mChangeDetection.setZoneData(PwbApp.PUBLIC_APP_KEY, this);

        // Create body content.
        this.initializeAppContent(pConfig ?? {});
    }

    /**
     * Add content to app.
     * Appends content if any target was specified.
     * @param pComponentConstructor - Html component constructor.
     */
    public addContent(pComponentConstructor: any): HTMLElement {
        // Create component and add to this app content.
        const lComponent: HTMLElement = this.createComponent(pComponentConstructor);
        this.mContent.push(lComponent);

        // Append component if app has a current target.
        if (this.mCurrentAppRootShadowRoot) {
            this.mCurrentAppRootShadowRoot.appendChild(lComponent);
        }

        return lComponent;
    }

    /**
     * Add error listener that listens for any uncatched error.
     * @param pListener - Error listener.
     */
    public addErrorListener(pListener: (pError: any) => void): void {
        this.changeDetection.addErrorListener(pListener);
    }

    /**
     * Add styles to this app.
     * @param pStyle - Css styles as string.
     */
    public addGlobalStyle(pStyle: string): HTMLStyleElement {
        // Create style element with style string as content and add to this app styles.
        const lStyleElement: HTMLStyleElement = this.createStyleElement(pStyle);

        // Prepend style to document head.
        document.head.prepend(lStyleElement);

        return lStyleElement;
    }

    /**
     * Add styles to this app.
     * @param pStyle - Css styles as string.
     */
    public addStyle(pStyle: string): HTMLStyleElement {
        // Create style element with style string as content and add to this app styles.
        const lStyleElement: HTMLStyleElement = this.createStyleElement(pStyle);
        this.mStyles.push(lStyleElement);

        // Prepend style if app has a current target.
        if (this.mCurrentAppRootShadowRoot) {
            this.mCurrentAppRootShadowRoot.prepend(lStyleElement);
        }

        return lStyleElement;
    }

    /**
     * Move content to new location.
     * Removes all elements from target.
     * @param pSelector - Selector of target element.
     */
    public moveTo(pSelector: string): void {
        // Search target and throw exception if target was not found.
        const lTarget: HTMLElement = document.querySelector(pSelector);
        if (!lTarget) {
            throw new Exception('Target not found.', this);
        }

        // Clear previous target.
        if (this.mCurrentAppRoot) {
            this.mCurrentAppRoot.remove();
        }

        // Construct new target app root with max size.
        const lAppRootDiv: HTMLDivElement = <HTMLDivElement>ElementCreator.createElement('div');
        lAppRootDiv.classList.add('PwbAppRoot', this.appName);
        this.mCurrentAppRoot = lAppRootDiv;

        // Apply new target. Create a shadow root if it has none.
        this.mCurrentAppRootShadowRoot = this.mCurrentAppRoot.attachShadow({ mode: 'open' });

        // Add all styles and content
        this.mCurrentAppRootShadowRoot.append(...this.mStyles);
        this.mCurrentAppRootShadowRoot.append(...this.mContent);

        // Append app root to target.
        lTarget.appendChild(lAppRootDiv);
    }

    /**
     * Remove error listener that listens for any uncatched error.
     * @param pListener - Error listener.
     */
    public removeErrorListener(pListener: (pError: any) => void): void {
        this.changeDetection.removeErrorListener(pListener);
    }

    /**
     * Create component element inside change detection.
     * @returns created component element.
     */
    private createComponent(pComponentConstructor: UserClass): HTMLElement {
        // Call creation inside change detection zone.
        return this.changeDetection.execute(() => {
            // Get selector of user
            const lSelector: string = Metadata.get(pComponentConstructor).getMetadata(MetadataKey.METADATA_SELECTOR);

            // Check if constructor is a component constructor.
            let lContent: HTMLElement;
            if (lSelector) {
                // Get custom element and create.
                const lCustomElement: any = window.customElements.get(lSelector);
                lContent = new lCustomElement();
            } else {
                throw new Exception('Content is not a HTMLComponent.', this);
            }

            return lContent;
        });
    }

    /**
     * Create style component.
     * @param pStyleString - Css styles as string.
     * @returns HTMLStyleElement with set styles as content..
     */
    private createStyleElement(pStyleString: string): HTMLStyleElement {
        // Append style.
        const lStyleElement: HTMLStyleElement = <HTMLStyleElement>ElementCreator.createElement('style');
        lStyleElement.innerHTML = pStyleString;

        return lStyleElement;
    }

    /**
     * Initialize app with app config.
     * @param pConfig - App config.
     */
    private initializeAppContent(pConfig: PwbAppConfig): void {
        // Create styles if styles are specified.
        if (typeof pConfig.style === 'string') {
            this.addStyle(pConfig.style);
        }

        // Create global styles if styles are specified.
        if (typeof pConfig.globalStyle === 'string') {
            this.addGlobalStyle(pConfig.globalStyle);
        }

        // Convert content config to content array.
        const lContentList: Array<InjectionConstructor> = new Array<InjectionConstructor>();
        if (pConfig.content) {
            if (Array.isArray(pConfig.content)) {
                lContentList.push(...pConfig.content);
            } else {
                lContentList.push(pConfig.content);
            }
        }

        // Create body content.
        for (const lContent of lContentList) {
            this.addContent(lContent);
        }

        // Move content to target if target is specified.
        if (typeof pConfig.targetSelector === 'string') {
            this.moveTo(pConfig.targetSelector);
        }
    }
}

type PwbAppConfig = {
    /**
     * Constructor or constructor array of components.
     * Default: null.
     */
    content?: any | Array<any>;
    /**
     * Target selector for inserting or appending content.
     * Default: null.
     */
    targetSelector?: string;
    /**
     * Styles only valid inside app root. 
     */
    style?: string;
    /**
     * Styles get append to head.
     */
    globalStyle?: string;
};
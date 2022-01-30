import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { PwbComponentElement } from './interface/html-component';
export declare class PwbApp {
    static readonly PUBLIC_APP_KEY: string;
    private readonly mChangeDetection;
    private readonly mContent;
    private mCurrentAppRoot;
    private mCurrentAppRootShadowRoot;
    private readonly mStyles;
    /**
     * Get change detection of this app.
     */
    get changeDetection(): ChangeDetection;
    /**
     * Get App name.
     */
    private get appName();
    /**
     * Constructor.
     * Create app with content, name and target element where the content will be inserted.
     * @param pAppName - Name of this app. Only for debug.
     * @param pConfig - App config.
     */
    constructor(pAppName: string, pConfig?: PwbAppConfig);
    /**
     * Add content to app.
     * Appends content if any target was specified.
     * @param pComponentConstructor - Html component constructor.
     */
    addContent(pComponentConstructor: any): PwbComponentElement;
    /**
     * Add error listener that listens for any uncatched error.
     * @param pListener - Error listener.
     */
    addErrorListener(pListener: (pError: any) => void): void;
    /**
     * Add styles to this app.
     * @param pStyle - Css styles as string.
     */
    addGlobalStyle(pStyle: string): HTMLStyleElement;
    /**
     * Add styles to this app.
     * @param pStyle - Css styles as string.
     */
    addStyle(pStyle: string): HTMLStyleElement;
    /**
     * Move content to new location.
     * Removes all elements from target.
     * @param pSelector - Selector of target element.
     */
    moveTo(pSelector: string): void;
    /**
     * Remove error listener that listens for any uncatched error.
     * @param pListener - Error listener.
     */
    removeErrorListener(pListener: (pError: any) => void): void;
    /**
     * Create component element inside change detection.
     * @returns created component element.
     */
    private createComponent;
    /**
     * Create style component.
     * @param pStyleString - Css styles as string.
     * @returns HTMLStyleElement with set styles as content..
     */
    private createStyleElement;
    /**
     * Initialize app with app config.
     * @param pConfig - App config.
     */
    private initializeAppContent;
}
declare type PwbAppConfig = {
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
export {};
//# sourceMappingURL=pwb-app.d.ts.map
import { Exception } from '@kartoffelgames/core.data';
import { InjectionConstructor, Metadata } from '@kartoffelgames/core.dependency-injection';
import { XmlElement } from '@kartoffelgames/core.xml';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { ErrorListener } from '@kartoffelgames/web.change-detection/library/source/change_detection/change-detection';
import { ComponentConnection } from './component/component-connection';
import { ComponentManager } from './component/component-manager';
import { ElementCreator } from './component/content/element-creator';

export class PwbApp {
    public static readonly PUBLIC_APP_KEY: string = '_PWB_APP';
    private static readonly mChangeDetectionToApp: WeakMap<ChangeDetection, PwbApp> = new WeakMap<ChangeDetection, PwbApp>();

    /**
     * Get app of change detection.
     * @param pChangeDetection - Change detection.
     */
    public static getChangeDetectionApp(pChangeDetection: ChangeDetection): PwbApp | null {
        let lCurrent: ChangeDetection = pChangeDetection;

        while (lCurrent) {
            if (PwbApp.mChangeDetectionToApp.has(lCurrent)) {
                return PwbApp.mChangeDetectionToApp.get(lCurrent);
            }

            lCurrent = lCurrent.looseParent;
        }

        return null;
    }

    private readonly mAppComponent: HTMLElement;
    private mAppSealed: boolean;
    private readonly mChangeDetection: ChangeDetection;
    private readonly mComponentList: Array<InjectionConstructor>;
    private mManualSplashScreen: boolean;
    private readonly mShadowRoot: ShadowRoot;
    private readonly mSplashScreen: HTMLElement;

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
        this.mAppSealed = false;
        this.mComponentList = new Array<InjectionConstructor>();
        this.mChangeDetection = new ChangeDetection(pAppName);
        PwbApp.mChangeDetectionToApp.set(this.mChangeDetection, this);

        // Create app wrapper template.
        const lGenericDivTemplate: XmlElement = new XmlElement();
        lGenericDivTemplate.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        lGenericDivTemplate.tagName = 'div';

        // Create app wrapper add name as data attribute.
        this.mAppComponent = <HTMLElement>ElementCreator.createElement(lGenericDivTemplate);
        this.mAppComponent.setAttribute('data-app', pAppName);
        this.mAppComponent.style.setProperty('width', '100%');
        this.mAppComponent.style.setProperty('height', '100%');

        // Create app shadow root.
        this.mShadowRoot = this.mAppComponent.attachShadow({ mode: 'open' });

        // Add splashscreen container. Fullscreen, full opacity with transistion.
        this.mSplashScreen = <HTMLElement>ElementCreator.createElement(lGenericDivTemplate);
        this.mSplashScreen.style.setProperty('position', 'absolute');
        this.mSplashScreen.style.setProperty('width', '100%');
        this.mSplashScreen.style.setProperty('height', '100%');
        this.mSplashScreen.style.setProperty('opacity', '1');
        this.mShadowRoot.appendChild(this.mSplashScreen);

        // Set default splash screen.
        this.setSplashScreen({
            background: 'linear-gradient(0deg, rgba(47,67,254,1) 8%, rgba(0,23,255,1) 70%);',
            content: '<span style="color: #fff;">PWB</span>'
        });
    }

    /**
     * Append content to app.
     * @param pContentClass - Content constructor.
     */
    public addContent(pContentClass: InjectionConstructor): void {
        // Sealed error.
        if (this.mAppSealed) {
            throw new Exception('App content is sealed after it got append to the DOM', this);
        }

        // Get content selector.
        const lSelector: string = Metadata.get(pContentClass).getMetadata(ComponentManager.METADATA_SELECTOR);
        if (!lSelector) {
            throw new Exception('Content is not a component.', this);
        }

        // Add content to content list.
        this.mComponentList.push(pContentClass);
    }

    /**
     * Add error listener that listens for any uncatched error.
     * @param pListener - Error listener.
     */
    public addErrorListener(pListener: ErrorListener): void {
        this.mChangeDetection.addErrorListener(pListener);
    }

    /**
     * Create style element and prepend it to this component.
     * @param pStyle - Css style as string.
     */
    public addStyle(pStyle: string): void {
        // Sealed error.
        if (this.mAppSealed) {
            throw new Exception('App content is sealed after it got append to the DOM', this);
        }

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
    public async appendTo(pElement: Element): Promise<void> {
        // Append app element to specified element.
        pElement.appendChild(this.mAppComponent);

        // Exit if app was already initialized.
        if (this.mAppSealed) {
            return;
        }

        // Seal content.
        this.mAppSealed = true;

        return new Promise<void>((pResolve, pReject) => {
            // Wait for update and remove splash screen after.
            globalThis.requestAnimationFrame(() => {
                const lUpdateWaiter: Array<Promise<boolean>> = new Array<Promise<boolean>>();

                // Create new update waiter for each component.
                for (const lComponentConstructor of this.mComponentList) {
                    // Create component and forward error.
                    let lComponent: HTMLElement;
                    try {
                        lComponent = this.createComponent(lComponentConstructor);
                    } catch (pError) {
                        pReject(pError);
                        return;
                    }

                    // Get ComponentManager of component and add update waiter to the waiter list. 
                    const lComponentManager: ComponentManager = ComponentConnection.componentManagerOf(lComponent);
                    lUpdateWaiter.push(lComponentManager.updateHandler.waitForUpdate());
                }

                // Promise that waits for all component to finish updating.
                let lUpdatePromise: Promise<any> = Promise.all(lUpdateWaiter);

                // Remove splash screen if not in manual mode.
                if (!this.mManualSplashScreen) {
                    lUpdatePromise = lUpdatePromise.then(async () => {
                        return this.removeSplashScreen();
                    });
                }

                // Forward resolve and rejection.
                lUpdatePromise.then(() => { pResolve(); }).catch((pError) => { pReject(pError); });
            });
        });
    }

    /**
     * Remove splash screen.
     */
    public async removeSplashScreen(): Promise<void> {
        const lTransistionTimerMilliseconds: number = 500;

        this.mSplashScreen.style.setProperty('transition', `opacity ${(lTransistionTimerMilliseconds / 1000).toString()}s linear`);
        this.mSplashScreen.style.setProperty('opacity', '0');

        // Remove splashscreen after transition.
        return new Promise<void>((pResolve) => {
            // Wait for transition to end.
            globalThis.setTimeout(() => {
                this.mSplashScreen.remove();

                // Resolve promise after remove.
                pResolve();
            }, lTransistionTimerMilliseconds);
        });
    }

    /**
     * Set new splash screen.
     * @param pSplashScreen - Splashscreen settings.
     */
    public setSplashScreen(pSplashScreen: SplashScreen): void {
        // Sealed error.
        if (this.mAppSealed) {
            throw new Exception('App content is sealed after it got append to the DOM', this);
        }

        // Set manual state.
        this.mManualSplashScreen = pSplashScreen.manual === true;

        // Create app wrapper template.
        const lGenericDivTemplate: XmlElement = new XmlElement();
        lGenericDivTemplate.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        lGenericDivTemplate.tagName = 'div';

        // Create content wrapper.
        const lContentWrapper: HTMLElement = <HTMLElement>ElementCreator.createElement(lGenericDivTemplate);
        lContentWrapper.style.setProperty('display', 'grid');
        lContentWrapper.style.setProperty('align-content', 'center');
        lContentWrapper.style.setProperty('width', '100%');
        lContentWrapper.style.setProperty('height', '100%');
        lContentWrapper.style.setProperty('background', pSplashScreen.background);

        // Create spplash screen content and append to content wrapper.
        const lContent: HTMLElement = <HTMLElement>ElementCreator.createElement(lGenericDivTemplate);
        lContent.style.setProperty('width', 'fit-content');
        lContent.style.setProperty('height', 'fit-content');
        lContent.style.setProperty('margin', '0 auto');
        lContent.innerHTML = pSplashScreen.content;
        lContentWrapper.appendChild(lContent);

        this.mSplashScreen.replaceChildren(lContentWrapper);
    }

    /**
     * Create component.
     * @param pContentClass - Component class.
     */
    private createComponent(pContentClass: InjectionConstructor): HTMLElement {
        // Get content selector.
        const lSelector: string = Metadata.get(pContentClass).getMetadata(ComponentManager.METADATA_SELECTOR);

        // Create content template content is always inside xhtml namespace.
        const lContentTemplate: XmlElement = new XmlElement();
        lContentTemplate.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        lContentTemplate.tagName = lSelector;

        // Create content from template inside change detection.
        let lContent: HTMLElement;
        this.mChangeDetection.execute(() => {
            lContent = <HTMLElement>ElementCreator.createElement(lContentTemplate);

            // Append content to shadow root
            this.mShadowRoot.appendChild(lContent);
        });

        return lContent;
    }
}

export type SplashScreen = {
    background: string,
    content: string;
    manual?: boolean;
};
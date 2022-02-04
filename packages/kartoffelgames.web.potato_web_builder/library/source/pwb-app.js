"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PwbApp = void 0;
const web_change_detection_1 = require("@kartoffelgames/web.change-detection");
const core_data_1 = require("@kartoffelgames/core.data");
const element_creator_1 = require("./component/content/element-creator");
const core_dependency_injection_1 = require("@kartoffelgames/core.dependency-injection");
const global_key_1 = require("./global-key");
class PwbApp {
    /**
     * Constructor.
     * Create app with content, name and target element where the content will be inserted.
     * @param pAppName - Name of this app. Only for debug.
     * @param pConfig - App config.
     */
    constructor(pAppName, pConfig) {
        this.mContent = new Array();
        this.mStyles = new Array();
        this.mCurrentAppRootShadowRoot = null;
        this.mCurrentAppRoot = null;
        // Create new change detection.
        this.mChangeDetection = new web_change_detection_1.ChangeDetection(pAppName);
        // Set app as zones data.
        this.mChangeDetection.setZoneData(PwbApp.PUBLIC_APP_KEY, this);
        // Create body content.
        this.initializeAppContent(pConfig ?? {});
    }
    /**
     * Get change detection of this app.
     */
    get changeDetection() {
        return this.mChangeDetection;
    }
    /**
     * Get App name.
     */
    get appName() {
        return this.changeDetection.name;
    }
    /**
     * Add content to app.
     * Appends content if any target was specified.
     * @param pComponentConstructor - Html component constructor.
     */
    addContent(pComponentConstructor) {
        // Create component and add to this app content.
        const lComponent = this.createComponent(pComponentConstructor);
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
    addErrorListener(pListener) {
        this.changeDetection.addErrorListener(pListener);
    }
    /**
     * Add styles to this app.
     * @param pStyle - Css styles as string.
     */
    addGlobalStyle(pStyle) {
        // Create style element with style string as content and add to this app styles.
        const lStyleElement = this.createStyleElement(pStyle);
        // Prepend style to document head.
        document.head.prepend(lStyleElement);
        return lStyleElement;
    }
    /**
     * Add styles to this app.
     * @param pStyle - Css styles as string.
     */
    addStyle(pStyle) {
        // Create style element with style string as content and add to this app styles.
        const lStyleElement = this.createStyleElement(pStyle);
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
    moveTo(pSelector) {
        // Search target and throw exception if target was not found.
        const lTarget = document.querySelector(pSelector);
        if (!lTarget) {
            throw new core_data_1.Exception('Target not found.', this);
        }
        // Clear previous target.
        if (this.mCurrentAppRoot) {
            this.mCurrentAppRoot.remove();
        }
        // Construct new target app root with max size.
        const lAppRootDiv = element_creator_1.ElementCreator.createElement('div');
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
    removeErrorListener(pListener) {
        this.changeDetection.removeErrorListener(pListener);
    }
    /**
     * Create component element inside change detection.
     * @returns created component element.
     */
    createComponent(pComponentConstructor) {
        // Call creation inside change detection zone.
        return this.changeDetection.execute(() => {
            // Get selector of user
            const lSelector = core_dependency_injection_1.Metadata.get(pComponentConstructor).getMetadata(global_key_1.MetadataKey.METADATA_SELECTOR);
            // Check if constructor is a component constructor.
            let lContent;
            if (lSelector) {
                // Get custom element and create.
                const lCustomElement = window.customElements.get(lSelector);
                lContent = new lCustomElement();
            }
            else {
                throw new core_data_1.Exception('Content is not a HTMLComponent.', this);
            }
            return lContent;
        });
    }
    /**
     * Create style component.
     * @param pStyleString - Css styles as string.
     * @returns HTMLStyleElement with set styles as content..
     */
    createStyleElement(pStyleString) {
        // Append style.
        const lStyleElement = element_creator_1.ElementCreator.createElement('style');
        lStyleElement.innerHTML = pStyleString;
        return lStyleElement;
    }
    /**
     * Initialize app with app config.
     * @param pConfig - App config.
     */
    initializeAppContent(pConfig) {
        // Create styles if styles are specified.
        if (typeof pConfig.style === 'string') {
            this.addStyle(pConfig.style);
        }
        // Create global styles if styles are specified.
        if (typeof pConfig.globalStyle === 'string') {
            this.addGlobalStyle(pConfig.globalStyle);
        }
        // Convert content config to content array.
        const lContentList = new Array();
        if (pConfig.content) {
            if (Array.isArray(pConfig.content)) {
                lContentList.push(...pConfig.content);
            }
            else {
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
exports.PwbApp = PwbApp;
PwbApp.PUBLIC_APP_KEY = '_PWB_APP';
//# sourceMappingURL=pwb-app.js.map
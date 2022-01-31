"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopError = exports.ComponentManager = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const static_builder_1 = require("./builder/static-builder");
const component_modules_1 = require("./component-modules");
const component_values_1 = require("./component-values");
const static_user_class_data_1 = require("../user_class_manager/static-user-class-data");
const web_change_detection_1 = require("@kartoffelgames/web.change-detection");
const core_dependency_injection_1 = require("@kartoffelgames/core.dependency-injection");
const pwb_app_1 = require("../pwb-app");
const element_creator_1 = require("./content/element-creator");
const pwb_component_1 = require("../handler/pwb-component");
const update_scope_1 = require("../enum/update-scope");
const template_parser_1 = require("../parser/template-parser");
const update_handler_1 = require("./handler/update-handler");
/**
 * Base component handler. Handles initialisation and update of components.
 */
class ComponentManager {
    /**
     * Constructor.
     * Initialized build parameter.
     * @param pUserClassObject - User class object.
     * @param pTemplate - Template content of component.
     * @param pAttributeModules - Attribute modules of component.
     */
    constructor(pUserClassConstructor, pTemplate, pExpressionModule, pHtmlComponent, pUpdateScope) {
        this.mUserClassConstructor = pUserClassConstructor;
        // Load or create ComponentModules. Cache created.
        let lComponentModules = ComponentManager.mModuleStore.get(this.mUserClassConstructor);
        if (!lComponentModules) {
            lComponentModules = new component_modules_1.ComponentModules(pExpressionModule);
            ComponentManager.mModuleStore.set(this.mUserClassConstructor, lComponentModules);
        }
        this.mModules = lComponentModules;
        // Load or create template. Cache created.
        let lTemplateDocument = ComponentManager.mTemplateStore.get(this.mUserClassConstructor);
        if (!lTemplateDocument) {
            lTemplateDocument = ComponentManager.mXmlParser.parse(pTemplate);
            ComponentManager.mTemplateStore.set(this.mUserClassConstructor, lTemplateDocument);
        }
        this.mTemplate = lTemplateDocument;
        // Create update handler.
        const lUpdateScope = pUpdateScope ?? update_scope_1.UpdateScope.Global;
        this.mUpdateHandler = new update_handler_1.UpdateHandler(lUpdateScope);
        // Create new change detection if component is not inside change detection or mode is capsuled.
        if (!web_change_detection_1.ChangeDetection.current || pUpdateScope === update_scope_1.UpdateScope.Capsuled) {
            this.mChangeDetection = new web_change_detection_1.ChangeDetection('DefaultComponentZone');
        }
        else if (pUpdateScope === update_scope_1.UpdateScope.Manual) {
            this.mChangeDetection = new web_change_detection_1.ChangeDetection('Manual Zone', null, true);
        }
        else {
            this.mChangeDetection = web_change_detection_1.ChangeDetection.currentNoneSilent;
        }
        // Create update listener as arrow function.
        // Add empty update function if update mode is manual.
        if (pUpdateScope === update_scope_1.UpdateScope.Manual) {
            this.mUpdateListener = (_pReason) => { return; };
        }
        else {
            this.mUpdateListener = (pReason) => { this.updateComponent(pReason); };
        }
        // Create local injections for the user class object.
        const lLocalInjections = new core_data_1.Dictionary();
        lLocalInjections.add(pwb_component_1.PwbComponent, new pwb_component_1.PwbComponent(this, pHtmlComponent));
        // Add app as injectable value. Only if component is initialised within an app.
        const lApp = web_change_detection_1.ChangeDetection.current?.getZoneData(pwb_app_1.PwbApp.PUBLIC_APP_KEY);
        if (lApp) {
            lLocalInjections.add(pwb_app_1.PwbApp, lApp);
        }
        // Create user class and register user class object to change detection. Execute in change detection.
        let lUserClassObject;
        if (pUpdateScope === update_scope_1.UpdateScope.Manual) {
            // User class outside zone and not change registered.
            lUserClassObject = core_dependency_injection_1.Injection.createObject(pUserClassConstructor, lLocalInjections);
        }
        else {
            this.changeDetection.execute(() => {
                lUserClassObject = core_dependency_injection_1.Injection.createObject(pUserClassConstructor, lLocalInjections);
                lUserClassObject.componentHandler = this;
                lUserClassObject = this.changeDetection.registerObject(lUserClassObject);
            });
        }
        this.mUserClassObject = lUserClassObject;
        // Create component values handler with watched user class object.
        const lComponentValues = new component_values_1.ComponentValues(this.mUserClassObject);
        // Save html component.
        this.mComponent = pHtmlComponent;
        // Create component builder.
        this.mRootBuilder = new static_builder_1.StaticBuilder(this.mTemplate.body, this.mModules, lComponentValues, this, false);
        // Initialize lists and default values.
        this.mUpdateWaiter = new core_data_1.List();
        this.mFirstAttachment = true;
        // Create content shadow root.
        this.mShadowRoot = this.mComponent.attachShadow({ mode: 'open' });
    }
    /**
     * Get change detection of component.
     */
    get changeDetection() {
        return this.mChangeDetection;
    }
    /**
     * Content anchor for later appending build and initilised elements on this place.
     */
    get anchor() {
        return this.mRootBuilder.anchor;
    }
    /**
     * Component content.
     */
    get content() {
        return this.mShadowRoot;
    }
    /**
     * Get user class object.
     */
    get userClassObject() {
        return this.mUserClassObject;
    }
    /**
     * Get component values of the root builder.
     */
    get rootValues() {
        return this.mRootBuilder.values;
    }
    /**
     * If component is attached to an document.
     */
    get isAttached() {
        return this.mIsAttached;
    }
    /**
     * Get if component is initialized.
     */
    get initialized() {
        return this.mRootBuilder.initialized;
    }
    /**
     * Create style element and prepend it to this component.
     * @param pStyle - Css style as string.
     */
    addStyle(pStyle) {
        const lStyleElement = element_creator_1.ElementCreator.createElement('style');
        lStyleElement.innerHTML = pStyle;
        this.content.prepend(lStyleElement);
    }
    /**
     * Deconstruct element.
     */
    deconstruct() {
        this.callOnPwbDeconstruct();
        // Remove change listener from app.
        this.changeDetection.removeChangeListener(this.mUpdateListener);
        // Remove mutation observer.s
        this.mMutationObserver.disconnect();
        this.mRootBuilder.deleteBuild();
    }
    /**
     * Get Slotname for this element.
     * User can decide where the component gets append when any slot name was set.
     * If no slot was set an exception is thrown.
     * @param pTemplate - Template of node.
     */
    getElementsSlotname(pTemplate) {
        const lSlotNameList = this.rootValues.validSlotNameList;
        let lSlotName;
        if (lSlotNameList.length === 0) {
            throw new core_data_1.Exception(`${this.mComponent.tagName} does not support child elements.`, this);
        }
        else if (lSlotNameList.length === 1) {
            // Append content on single slot.
            lSlotName = lSlotNameList[0];
        }
        else {
            // Check if user class implements correct interface.
            if (typeof this.userClassObject.assignSlotContent !== 'function') {
                throw new core_data_1.Exception('UserClass must implement PwbSlotAssign to use more than one content root.', this);
            }
            // Let the user decide in which content root the new content gets append.
            lSlotName = this.userClassObject.assignSlotContent(pTemplate);
            // Check user selected slot name.
            if (!lSlotNameList.includes(lSlotName)) {
                throw new core_data_1.Exception(`No slot with slotname "${lSlotName}" found.`, this);
            }
        }
        return lSlotName;
    }
    /**
     * Build html elements from templates and map any nessesary data.
     * Appends build element into the place that was marked by the content anchor.
     */
    initialize() {
        // Create mutation observer outside zone.
        this.changeDetection.silentExecution(() => {
            // Check if element is attached to a document.
            const lElementInDocument = (pCurrentElement) => {
                const lRootNode = pCurrentElement.getRootNode();
                if (lRootNode === document) {
                    return true;
                }
                else if (!lRootNode || lRootNode === pCurrentElement) {
                    return false;
                }
                else if (lRootNode instanceof Element) {
                    return lElementInDocument(lRootNode);
                }
                else if (lRootNode instanceof window.ShadowRoot) {
                    return lElementInDocument(lRootNode.host);
                }
            };
            this.mMutationObserver = new window.MutationObserver(() => {
                const lLastAttachedState = this.mIsAttached;
                this.mIsAttached = lElementInDocument(this.mComponent);
                // Call user class object after pwb initialize.
                if (this.mIsAttached || this.mFirstAttachment) {
                    this.mFirstAttachment = false;
                    // Call callback method inside none silent zone.
                    this.changeDetection.execute(() => {
                        this.callAfterPwbInitialize();
                    });
                }
                // Update component when element is attached to dom.
                if (!lLastAttachedState && this.mIsAttached) {
                    this.changeDetection.execute(() => {
                        this.mUpdateListener({
                            source: this.userClassObject,
                            property: Symbol('any'),
                            stacktrace: Error().stack
                        });
                    });
                }
            });
            // Start observation on document.
            this.mMutationObserver.observe(document, {
                childList: true,
                subtree: true
            });
        });
        // Call everything inside component zone.
        this.changeDetection.execute(() => {
            // Do not initialize twice.
            if (this.initialized) {
                throw new core_data_1.Exception('Component handler is already initialized.', this);
            }
            // Add contentAnchor to element.
            this.content.appendChild(this.anchor);
            // Export properties.
            this.exportPropertiesToHtmlElement();
            // Patch attributes to set property when attribute is set.
            this.patchHtmlAttributes();
            // Add change detection listener
            this.changeDetection.addChangeListener(this.mUpdateListener);
            // Before initialisation.
            this.callOnPwbInitialize();
            try {
                // Start initialize build.
                this.mRootBuilder.initializeBuild();
            }
            catch (pError) {
                this.sendError(pError);
                throw pError;
            }
        });
    }
    /**
     * Send error to all error listener and to the execution zone.
     * @param pError - Error.
     */
    sendError(pError) {
        // Send error to zone.
        this.changeDetection.dispatchErrorEvent(pError);
    }
    /**
     * Update component parts that used the property.
     */
    updateComponent(pReason) {
        // Dont update if component is not initialized or attached to document.
        if (!this.initialized && !this.isAttached) {
            return;
        }
        if (!this.mInsideUpdateCycle) {
            // Set component into update circle.
            this.mInsideUpdateCycle = true;
            // Create and expand update reason list
            if (!this.mCurrentUpdateChain) {
                this.mCurrentUpdateChain = new Array();
            }
            this.mCurrentUpdateChain.push(pReason);
            const lUpdateFunction = () => {
                // Call user class on update function.
                this.callOnPwbUpdate();
                // Set component to not updating so new changes doesn't get ignnored.
                this.mInsideUpdateCycle = false;
                const lLastLength = this.mCurrentUpdateChain.length;
                // Update component and get if any update was made.
                const lHasUpdated = this.mRootBuilder.updateBuild();
                // Clear update chain list if no other update in this cycle was triggered.
                if (lLastLength === this.mCurrentUpdateChain.length) {
                    this.mCurrentUpdateChain = null;
                }
                else if (this.mCurrentUpdateChain.length > 10) {
                    // Throw if too many updates are chained. 
                    throw new LoopError('Update loop detected', this.mCurrentUpdateChain);
                }
                // Release all update waiter
                for (const lUpdateWaiter of this.mUpdateWaiter) {
                    lUpdateWaiter();
                }
                this.mUpdateWaiter.clear();
                // Call user class on update function if any update was made.
                if (lHasUpdated) {
                    this.callAfterPwbUpdate();
                }
            };
            // Update on next frame. 
            // Do not call change detection on requestAnimationFrame.
            this.changeDetection.silentExecution(() => {
                this.mNextUpdateCycle = window.requestAnimationFrame(() => {
                    try {
                        // Call update not in silent zone.
                        this.changeDetection.execute(lUpdateFunction);
                    }
                    catch (pException) {
                        // Cancel update next update cycle.
                        window.cancelAnimationFrame(this.mNextUpdateCycle);
                        throw pException;
                    }
                });
            });
        }
    }
    /**
     * Wait for the component update.
     * Returns Promise<false> if there is currently no update cycle.
     */
    async waitForUpdate() {
        if (this.mInsideUpdateCycle) {
            // Add new callback to waiter line.
            return new Promise((pResolve) => {
                this.mUpdateWaiter.push(() => {
                    // Is resolved when all data were updated.
                    pResolve(true);
                });
            });
        }
        else {
            return false;
        }
    }
    /**
     * Call onPwbInitialize of user class object.
     */
    callAfterPwbInitialize() {
        // Call user class object onPwbInitialize.
        const lUserClassObject = this.rootValues.userClassObject;
        if (typeof lUserClassObject.afterPwbInitialize === 'function') {
            try {
                lUserClassObject.afterPwbInitialize();
            }
            catch (pError) {
                this.sendError(pError);
                throw pError;
            }
        }
        this.callAfterPwbUpdate();
    }
    /**
     * Call onPwbInitialize of user class object.
     */
    callAfterPwbUpdate() {
        // Call user class object onPwbInitialize.
        const lUserClassObject = this.rootValues.userClassObject;
        if (typeof lUserClassObject.afterPwbUpdate === 'function') {
            try {
                lUserClassObject.afterPwbUpdate();
            }
            catch (pError) {
                this.sendError(pError);
                throw pError;
            }
        }
    }
    /**
     * Call onPwbInitialize of user class object.
     * @param pAttributeName - Name of updated attribute.
     */
    callOnPwbAttributeChange(pAttributeName) {
        // Call user class object onPwbAttributeChange.
        const lUserClassObject = this.rootValues.userClassObject;
        if (typeof lUserClassObject.onPwbAttributeChange === 'function') {
            try {
                lUserClassObject.onPwbAttributeChange(pAttributeName);
            }
            catch (pError) {
                this.sendError(pError);
                throw pError;
            }
        }
    }
    /**
     * Call onPwbDeconstruct of user class object.
     */
    callOnPwbDeconstruct() {
        // Call user class object onPwbDeconstruct.
        const lUserClassObject = this.rootValues.userClassObject;
        if (typeof lUserClassObject.onPwbDeconstruct === 'function') {
            try {
                lUserClassObject.onPwbDeconstruct();
            }
            catch (pError) {
                this.sendError(pError);
                throw pError;
            }
        }
    }
    /**
     * Call onPwbInitialize of user class object.
     */
    callOnPwbInitialize() {
        // Call user class object onPwbInitialize.
        const lUserClassObject = this.rootValues.userClassObject;
        if (typeof lUserClassObject.onPwbInitialize === 'function') {
            try {
                lUserClassObject.onPwbInitialize();
            }
            catch (pError) {
                this.sendError(pError);
                throw pError;
            }
        }
        this.callOnPwbUpdate();
    }
    /**
     * Call onPwbInitialize of user class object.
     */
    callOnPwbUpdate() {
        // Call user class object onPwbInitialize.
        const lUserClassObject = this.rootValues.userClassObject;
        if (typeof lUserClassObject.onPwbUpdate === 'function') {
            try {
                // Call in silent mode.
                lUserClassObject.onPwbUpdate();
            }
            catch (pError) {
                this.sendError(pError);
                throw pError;
            }
        }
    }
    /**
     * Export exported properties so that exported user class properties can be accessed from html element.
     */
    exportPropertiesToHtmlElement() {
        let lUserClassConstructor = this.mUserClassObject.constructor;
        lUserClassConstructor = this.changeDetection.getUntrackedObject(lUserClassConstructor);
        // Get input and output.
        const lExportPropertyList = new Array();
        lExportPropertyList.push(...static_user_class_data_1.StaticUserClassData.get(lUserClassConstructor).exportProperty.keys());
        for (const lExportProperty of lExportPropertyList) {
            // Get property descriptor.
            let lDescriptor = Object.getOwnPropertyDescriptor(this.mComponent, lExportProperty);
            if (!lDescriptor) {
                lDescriptor = {};
            }
            lDescriptor.enumerable = true;
            lDescriptor.configurable = true;
            delete lDescriptor.value;
            delete lDescriptor.writable;
            const lSelf = this;
            // Setter and getter of this property. Execute changes inside component handlers change detection.
            lDescriptor.set = function (pValue) {
                lSelf.userClassObject[lExportProperty] = pValue;
                // Call OnAttributeChange.
                lSelf.callOnPwbAttributeChange(lExportProperty);
            };
            lDescriptor.get = function () {
                let lValue = lSelf.userClassObject[lExportProperty];
                // Bind this context to the exported function.
                if (typeof lValue === 'function') {
                    lValue = lValue.bind(lSelf.userClassObject);
                }
                return lValue;
            };
            Object.defineProperty(this.mComponent, lExportProperty, lDescriptor);
        }
    }
    /**
     * Patch setAttribute and getAttribute to set and get exported values.
     */
    patchHtmlAttributes() {
        const lSelf = this;
        // Get original functions.
        const lOriginalSetAttribute = this.mComponent.setAttribute;
        const lOriginalGetAttribute = this.mComponent.getAttribute;
        // Get constructor of the user class object.
        let lUserClassConstructor = this.mUserClassObject.constructor;
        lUserClassConstructor = this.changeDetection.getUntrackedObject(lUserClassConstructor);
        // Get input and output.
        const lExportPropertyList = static_user_class_data_1.StaticUserClassData.get(lUserClassConstructor).exportProperty;
        // Patch set attribute
        this.mComponent.setAttribute = function (pQualifiedName, pValue) {
            // Check if attribute is an exported value and set value to user class object.
            if (lExportPropertyList.has(pQualifiedName)) {
                lSelf.mComponent[pQualifiedName] = pValue;
            }
            lOriginalSetAttribute.call(lSelf.mComponent, pQualifiedName, pValue);
        };
        // Patch get attribute
        this.mComponent.getAttribute = function (pQualifiedName) {
            // Check if attribute is an exported value and return value of user class object.
            if (lExportPropertyList.has(pQualifiedName)) {
                return lSelf.mComponent[pQualifiedName];
            }
            return lOriginalGetAttribute.call(lSelf.mComponent, pQualifiedName);
        };
    }
}
exports.ComponentManager = ComponentManager;
ComponentManager.mTemplateStore = new core_data_1.Dictionary();
ComponentManager.mModuleStore = new core_data_1.Dictionary();
ComponentManager.mXmlParser = new template_parser_1.TemplateParser();
class LoopError {
    /**
     * Constructor.
     * Create loop error.
     * @param pMessage - Error Message.
     * @param pChain - Current update chain.
     */
    constructor(pMessage, pChain) {
        this.message = pMessage;
        this.chain = pChain;
    }
}
exports.LoopError = LoopError;
//# sourceMappingURL=component-manager.js.map
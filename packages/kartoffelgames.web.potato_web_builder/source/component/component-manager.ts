import { Dictionary, Exception, List, Writeable } from '@kartoffelgames/core.data';
import { UserClassConstructor, UserClassObject } from '../interface/user-class';
import { StaticBuilder } from './builder/static-builder';
import { ComponentModules } from './component-modules';
import { ComponentValues } from './component-values';
import { StaticUserClassData } from '../user_class_manager/static-user-class-data';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { BaseXmlNode, XmlDocument } from '@kartoffelgames/core.xml';
import { Injection, InjectionConstructor } from '@kartoffelgames/core.dependency-injection';
import { PwbApp } from '../pwb-app';
import { ElementCreator } from './content/element-creator';
import { PwbComponent } from '../handler/pwb-component';
import { UpdateScope } from '../enum/update-scope';
import { TemplateParser } from '../parser/template-parser';
import { PwbExpressionModuleConstructor } from '..';
import { UpdateHandler } from './handler/update-handler';
import { UserObjectHandler } from './handler/user-object-handler';

/**
 * Base component handler. Handles initialisation and update of components.
 */
export class ComponentManager {
    private static readonly mModuleStore: Dictionary<UserClassConstructor, ComponentModules> = new Dictionary<UserClassConstructor, ComponentModules>();
    private static readonly mTemplateStore: Dictionary<UserClassConstructor, XmlDocument> = new Dictionary<UserClassConstructor, XmlDocument>(); 
    private static readonly mXmlParser: TemplateParser = new TemplateParser();

    private readonly mComponent: Element;
    private readonly mShadowRoot: ShadowRoot;
    private mFirstAttachment: boolean;
    private mIsAttached: boolean;
    private mMutationObserver: MutationObserver;
    private readonly mRootBuilder: StaticBuilder;
    private readonly mUserClassObject: UserClassObject;
    private mUpdateHandler: UpdateHandler;
    private mUserObjectHandler: UserObjectHandler;

    /**
     * Component content.
     */
    public get shadowRoot(): ShadowRoot {
        return this.mShadowRoot;
    }

    /**
     * Get user class object.
     */
    public get userClassObject(): UserClassObject {
        return this.mUserClassObject;
    }

    /**
     * Get component values of the root builder. 
     */
    public get rootValues(): ComponentValues {
        return this.mRootBuilder.values;
    }

    /**
     * Update handler.
     */
    public get updateHandler(): UpdateHandler{
        return this.mUpdateHandler;
    }

    /**
     * Constructor.
     * Initialized build parameter.
     * @param pUserClassObject - User class object.
     * @param pTemplate - Template content of component.
     * @param pAttributeModules - Attribute modules of component.
     */
    public constructor(pUserClassConstructor: UserClassConstructor, pTemplate: string, pExpressionModule: PwbExpressionModuleConstructor, pHtmlComponent: HTMLElement, pUpdateScope: UpdateScope) {
        // Load or create ComponentModules. Cache created.
        let lComponentModules = ComponentManager.mModuleStore.get(pUserClassConstructor);
        if (!lComponentModules) {
            lComponentModules = new ComponentModules(pExpressionModule);
            ComponentManager.mModuleStore.set(pUserClassConstructor, lComponentModules);
        }
        const lModules: ComponentModules = lComponentModules;

        // Load or create template. Cache created.
        let lTemplateDocument: XmlDocument = ComponentManager.mTemplateStore.get(pUserClassConstructor);
        if (!lTemplateDocument) {
            lTemplateDocument = ComponentManager.mXmlParser.parse(pTemplate);
            ComponentManager.mTemplateStore.set(pUserClassConstructor, lTemplateDocument);
        }
        const lTemplate: XmlDocument = lTemplateDocument;

        // Create local injections for the user class object.
        const lLocalInjections: Dictionary<InjectionConstructor, any> = new Dictionary<InjectionConstructor, any>();
        lLocalInjections.add(PwbComponent, new PwbComponent(this, pHtmlComponent));

        // Add app as injectable value. Only if component is initialised within an app.
        const lApp: PwbApp = ChangeDetection.current?.getZoneData(PwbApp.PUBLIC_APP_KEY);
        if (lApp) {
            lLocalInjections.add(PwbApp, lApp);
        }

        // Create user class and register user class object to change detection. Execute in change detection.
        let lUserClassObject: UserClassObject;
        this.mUpdateHandler.execute(() => {
            lUserClassObject = Injection.createObject(pUserClassConstructor, lLocalInjections);
            lUserClassObject = this.mUpdateHandler.registerObject(lUserClassObject);
        });
        this.mUserClassObject = lUserClassObject;

        // Create user object handler.
        this.mUserObjectHandler = new UserObjectHandler(this.mUserClassObject);

        // Create update handler.
        const lUpdateScope: UpdateScope = pUpdateScope ?? UpdateScope.Global;
        this.mUpdateHandler = new UpdateHandler(this.mUserObjectHandler, lUpdateScope);
        this.mUpdateHandler.addUpdateListener(() => { return this.mRootBuilder.updateBuild(); });

        // Create component values handler with watched user class object.
        const lComponentValues: ComponentValues = new ComponentValues(this.mUserClassObject);

        // Save html component.
        this.mComponent = pHtmlComponent;

        // Create component builder.
        this.mRootBuilder = new StaticBuilder(lTemplate.body, lModules, lComponentValues, this, false);
        this.shadowRoot.appendChild(this.mRootBuilder.anchor);

        // Initialize lists and default values.
        this.mFirstAttachment = true;

        // Create content shadow root.
        this.mShadowRoot = this.mComponent.attachShadow({ mode: 'open' });
    }

    /**
     * Create style element and prepend it to this component.
     * @param pStyle - Css style as string.
     */
    public addStyle(pStyle: string): void {
        const lStyleElement: Element = ElementCreator.createElement('style');
        lStyleElement.innerHTML = pStyle;
        this.shadowRoot.prepend(lStyleElement);
    }

    /**
     * Deconstruct element.
     */
    public deconstruct(): void {
        this.mUserObjectHandler.callOnPwbDeconstruct();

        // Remove change listener from app.
        this.mUpdateHandler.deconstruct();

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
    public getElementsSlotname(pTemplate: BaseXmlNode): string {
        const lSlotNameList: Array<string> = this.rootValues.validSlotNameList;

        let lSlotName: string;
        if (lSlotNameList.length === 0) {
            throw new Exception(`${this.mComponent.tagName} does not support child elements.`, this);
        } else if (lSlotNameList.length === 1) {
            // Append content on single slot.
            lSlotName = lSlotNameList[0];
        } else {
            // Check if user class implements correct interface.
            if (typeof this.userClassObject.assignSlotContent !== 'function') {
                throw new Exception('UserClass must implement PwbSlotAssign to use more than one content root.', this);
            }

            // Let the user decide in which content root the new content gets append.
            lSlotName = this.userClassObject.assignSlotContent(pTemplate);

            // Check user selected slot name.
            if (!lSlotNameList.includes(lSlotName)) {
                throw new Exception(`No slot with slotname "${lSlotName}" found.`, this);
            }
        }

        return lSlotName;
    }

    /**
     * Build html elements from templates and map any nessesary data.
     * Appends build element into the place that was marked by the content anchor.
     */
    public initialize(): void {
        // Create mutation observer outside zone.
        this.changeDetection.silentExecution(() => {
            // Check if element is attached to a document.
            const lElementInDocument = (pCurrentElement: Node): boolean => {
                const lRootNode: Node | ShadowRoot = pCurrentElement.getRootNode();

                if (lRootNode === document) {
                    return true;
                } else if (!lRootNode || lRootNode === pCurrentElement) {
                    return false;
                } else if (lRootNode instanceof Element) {
                    return lElementInDocument(lRootNode);
                } else if (lRootNode instanceof window.ShadowRoot) {
                    return lElementInDocument(lRootNode.host);
                }
            };

            this.mMutationObserver = new window.MutationObserver(() => {
                const lLastAttachedState: boolean = this.mIsAttached;
                this.mIsAttached = lElementInDocument(this.mComponent);

                // Call user class object after pwb initialize.
                if (this.mIsAttached || this.mFirstAttachment) {
                    this.mFirstAttachment = false;

                    // Call callback method inside none silent zone.
                    this.changeDetection.execute(() => {
                        this.mUserObjectHandler.callAfterPwbInitialize();
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

            // Export properties.
            this.exportPropertiesToHtmlElement();

            // Patch attributes to set property when attribute is set.
            this.patchHtmlAttributes();

            // Add change detection listener
            this.mUpdateHandler.enabled = true;

            // Before initialisation.
            this.mUserObjectHandler.callOnPwbInitialize();

            try {
                // Start initialize build.
                this.mRootBuilder.initializeBuild();
            } catch (pError) {
                this.sendError(pError);
                throw pError;
            }
        });
    }

    /**
     * Send error to all error listener and to the execution zone.
     * @param pError - Error.
     */
    public sendError(pError: any): void {
        // Send error to zone.
        this.changeDetection.dispatchErrorEvent(pError);
    }

    /**
     * Export exported properties so that exported user class properties can be accessed from html element.
     */
    private exportPropertiesToHtmlElement() {
        let lUserClassConstructor: UserClassConstructor = <UserClassConstructor>this.mUserClassObject.constructor;
        lUserClassConstructor = this.changeDetection.getUntrackedObject(lUserClassConstructor);

        // Get input and output.
        const lExportPropertyList: Array<string> = new Array<string>();
        lExportPropertyList.push(...StaticUserClassData.get(lUserClassConstructor).exportProperty.keys());

        for (const lExportProperty of lExportPropertyList) {
            // Get property descriptor.
            let lDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(this.mComponent, lExportProperty);
            if (!lDescriptor) {
                lDescriptor = {};
            }

            lDescriptor.enumerable = true;
            lDescriptor.configurable = true;
            delete lDescriptor.value;
            delete lDescriptor.writable;

            const lSelf: this = this;

            // Setter and getter of this property. Execute changes inside component handlers change detection.
            lDescriptor.set = function (pValue: any) {
                (<any>lSelf.userClassObject)[lExportProperty] = pValue;
                // Call OnAttributeChange.
                lSelf.mUserObjectHandler.callOnPwbAttributeChange(lExportProperty);
            };
            lDescriptor.get = function () {
                let lValue: any = (<any>lSelf.userClassObject)[lExportProperty];

                // Bind this context to the exported function.
                if (typeof lValue === 'function') {
                    lValue = (<(...pArgs: Array<any>) => any>lValue).bind(lSelf.userClassObject);
                }

                return lValue;
            };

            Object.defineProperty(this.mComponent, lExportProperty, lDescriptor);
        }
    }

    /**
     * Patch setAttribute and getAttribute to set and get exported values.
     */
    private patchHtmlAttributes(): void {
        const lSelf: this = this;

        // Get original functions.
        const lOriginalSetAttribute: (pQualifiedName: string, pValue: string) => void = this.mComponent.setAttribute;
        const lOriginalGetAttribute: (pQualifiedName: string) => string = this.mComponent.getAttribute;

        // Get constructor of the user class object.
        let lUserClassConstructor: UserClassConstructor = <UserClassConstructor>this.mUserClassObject.constructor;
        lUserClassConstructor = this.changeDetection.getUntrackedObject(lUserClassConstructor);

        // Get input and output.
        const lExportPropertyList: Dictionary<string, any> = StaticUserClassData.get(lUserClassConstructor).exportProperty;

        // Patch set attribute
        this.mComponent.setAttribute = function (pQualifiedName: string, pValue: string) {
            // Check if attribute is an exported value and set value to user class object.
            if (lExportPropertyList.has(pQualifiedName)) {
                (<any>lSelf.mComponent)[pQualifiedName] = pValue;
            }

            lOriginalSetAttribute.call(lSelf.mComponent, pQualifiedName, pValue);
        };

        // Patch get attribute
        this.mComponent.getAttribute = function (pQualifiedName: string): string {
            // Check if attribute is an exported value and return value of user class object.
            if (lExportPropertyList.has(pQualifiedName)) {
                return (<any>lSelf.mComponent)[pQualifiedName];
            }

            return lOriginalGetAttribute.call(lSelf.mComponent, pQualifiedName);
        };
    }
}
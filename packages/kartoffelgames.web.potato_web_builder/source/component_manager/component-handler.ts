import { Dictionary, Exception, List, Writeable } from '@kartoffelgames/core.data';
import { UserClassConstructor, UserClassObject } from '../interface/user-class';
import { StaticBuilder } from './builder/static-builder';
import { ComponentModules } from './component-modules';
import { ComponentValues } from './component-values';
import { StaticUserClassData } from '../user_class_manager/static-user-class-data';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { BaseXmlNode } from '@kartoffelgames/core.xml';
import { Injection, InjectionConstructor, Injector } from '@kartoffelgames/core.dependency-injection';
import { PwbApp } from '../pwb-app';
import { ElementCreator } from './content/element-creator';
import { PwbComponent } from '../handler/pwb-component';
import { ChangeDetectionReason } from '@kartoffelgames/web.change-detection';
import { UpdateMode } from '../enum/update-mode';

/**
 * Base component handler. Handles initialisation and update of components.
 */
export class ComponentHandler {
    private readonly mChangeDetection: ChangeDetection;
    private readonly mComponent: Element;
    private readonly mContent: ShadowRoot;
    private mCurrentUpdateChain: Array<ChangeDetectionReason>;
    private mFirstAttachment: boolean;
    private mInsideUpdateCycle: boolean;
    private mIsAttached: boolean;
    private mMutationObserver: MutationObserver;
    private mNextUpdateCycle: number;
    private readonly mRootBuilder: StaticBuilder;
    private readonly mUpdateListener: (pReason: ChangeDetectionReason) => void;
    private readonly mUpdateWaiter: List<() => void>;
    private readonly mUserClassObject: UserClassObject;

    /**
     * Get change detection of component.
     */
    public get changeDetection(): ChangeDetection {
        return this.mChangeDetection;
    }

    /**
     * Content anchor for later appending build and initilised elements on this place.
     */
    public get anchor(): Comment {
        return this.mRootBuilder.anchor;
    }

    /**
     * Component content.
     */
    public get content(): ShadowRoot {
        return this.mContent;
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
     * If component is attached to an document.
     */
    public get isAttached(): boolean {
        return this.mIsAttached;
    }

    /**
     * Get if component is initialized.
     */
    private get initialized(): boolean {
        return this.mRootBuilder.initialized;
    }

    /**
     * Constructor.
     * Initialized build parameter.
     * @param pUserClassObject - User class object.
     * @param pTemplate - Template content of component.
     * @param pAttributeModules - Attribute modules of component.
     */
    public constructor(pUserClass: UserClassConstructor, pTemplate: Array<BaseXmlNode>, pAttributeModules: ComponentModules, pHtmlComponent: HTMLElement, pUpdateMode: UpdateMode) {
        // Create new change detection if component is not inside change detection or mode is capsuled.
        if (!ChangeDetection.current || pUpdateMode === UpdateMode.Capsuled) {
            this.mChangeDetection = new ChangeDetection('DefaultComponentZone');
        } else if (pUpdateMode === UpdateMode.Manual) {
            this.mChangeDetection = new ChangeDetection('Manual Zone', null, true);
        } else {
            this.mChangeDetection = ChangeDetection.currentNoneSilent;
        }

        // Create update listener as arrow function.
        // Add empty update function if update mode is manual.
        if (pUpdateMode === UpdateMode.Manual) {
            this.mUpdateListener = (_pReason: ChangeDetectionReason) => { return; };
        } else {
            this.mUpdateListener = (pReason: ChangeDetectionReason) => { this.updateComponent(pReason); };
        }

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
        if (pUpdateMode === UpdateMode.Manual) {
            // User class outside zone and not change registered.
            lUserClassObject = Injection.createObject(pUserClass, lLocalInjections);
        } else {
            this.changeDetection.execute(() => {
                lUserClassObject = Injection.createObject(pUserClass, lLocalInjections);
                (<Writeable<UserClassObject>>lUserClassObject).componentHandler = this;
                lUserClassObject = this.changeDetection.registerObject(lUserClassObject);
            });
        }
        this.mUserClassObject = lUserClassObject;

        // Create component values handler with watched user class object.
        const lComponentValues: ComponentValues = new ComponentValues(this.mUserClassObject);

        // Save html component.
        this.mComponent = pHtmlComponent;

        // Create component builder.
        this.mRootBuilder = new StaticBuilder(pTemplate, pAttributeModules, lComponentValues, this, false);

        // Initialize lists and default values.
        this.mUpdateWaiter = new List<() => void>();
        this.mFirstAttachment = true;

        // Create content shadow root.
        this.mContent = this.mComponent.attachShadow({ mode: 'open' });
    }

    /**
     * Create style element and prepend it to this component.
     * @param pStyle - Css style as string.
     */
    public addStyle(pStyle: string): void {
        const lStyleElement: Element = ElementCreator.createElement('style');
        lStyleElement.innerHTML = pStyle;
        this.content.prepend(lStyleElement);
    }

    /**
     * Deconstruct element.
     */
    public deconstruct(): void {
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
                    this.changeDetection.execute(()=>{
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
                throw new Exception('Component handler is already initialized.', this);
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
     * Update component parts that used the property.
     */
    public updateComponent(pReason: ChangeDetectionReason): void {
        // Dont update if component is not initialized or attached to document.
        if (!this.initialized && !this.isAttached) {
            return;
        }

        if (!this.mInsideUpdateCycle) {
            // Set component into update circle.
            this.mInsideUpdateCycle = true;

            // Create and expand update reason list
            if (!this.mCurrentUpdateChain) {
                this.mCurrentUpdateChain = new Array<ChangeDetectionReason>();
            }
            this.mCurrentUpdateChain.push(pReason);

            const lUpdateFunction = () => {
                // Call user class on update function.
                this.callOnPwbUpdate();

                // Set component to not updating so new changes doesn't get ignnored.
                this.mInsideUpdateCycle = false;
                const lLastLength: number = this.mCurrentUpdateChain.length;

                // Update component and get if any update was made.
                const lHasUpdated: boolean = this.mRootBuilder.updateBuild();

                // Clear update chain list if no other update in this cycle was triggered.
                if (lLastLength === this.mCurrentUpdateChain.length) {
                    this.mCurrentUpdateChain = null;
                } else if (this.mCurrentUpdateChain.length > 10) {
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
                    } catch (pException) {
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
    public async waitForUpdate(): Promise<boolean> {
        if (this.mInsideUpdateCycle) {
            // Add new callback to waiter line.
            return new Promise<boolean>((pResolve: (pValue: boolean) => void) => {
                this.mUpdateWaiter.push(() => {
                    // Is resolved when all data were updated.
                    pResolve(true);
                });
            });
        } else {
            return false;
        }
    }

    /**
     * Call onPwbInitialize of user class object.
     */
    private callAfterPwbInitialize(): void {
        // Call user class object onPwbInitialize.
        const lUserClassObject: UserClassObject = this.rootValues.userClassObject;
        if (typeof lUserClassObject.afterPwbInitialize === 'function') {
            try {
                lUserClassObject.afterPwbInitialize();
            } catch (pError) {
                this.sendError(pError);
                throw pError;
            }
        }

        this.callAfterPwbUpdate();
    }

    /**
     * Call onPwbInitialize of user class object.
     */
    private callAfterPwbUpdate(): void {
        // Call user class object onPwbInitialize.
        const lUserClassObject: UserClassObject = this.rootValues.userClassObject;
        if (typeof lUserClassObject.afterPwbUpdate === 'function') {
            try {
                lUserClassObject.afterPwbUpdate();
            } catch (pError) {
                this.sendError(pError);
                throw pError;
            }
        }
    }

    /**
     * Call onPwbInitialize of user class object.
     * @param pAttributeName - Name of updated attribute.
     */
    private callOnPwbAttributeChange(pAttributeName: string): void {
        // Call user class object onPwbAttributeChange.
        const lUserClassObject: UserClassObject = this.rootValues.userClassObject;
        if (typeof lUserClassObject.onPwbAttributeChange === 'function') {
            try {
                lUserClassObject.onPwbAttributeChange(pAttributeName);
            } catch (pError) {
                this.sendError(pError);
                throw pError;
            }
        }
    }

    /**
     * Call onPwbDeconstruct of user class object.
     */
    private callOnPwbDeconstruct(): void {
        // Call user class object onPwbDeconstruct.
        const lUserClassObject: UserClassObject = this.rootValues.userClassObject;
        if (typeof lUserClassObject.onPwbDeconstruct === 'function') {
            try {
                lUserClassObject.onPwbDeconstruct();
            } catch (pError) {
                this.sendError(pError);
                throw pError;
            }
        }
    }

    /**
     * Call onPwbInitialize of user class object.
     */
    private callOnPwbInitialize(): void {
        // Call user class object onPwbInitialize.
        const lUserClassObject: UserClassObject = this.rootValues.userClassObject;
        if (typeof lUserClassObject.onPwbInitialize === 'function') {
            try {
                lUserClassObject.onPwbInitialize();
            } catch (pError) {
                this.sendError(pError);
                throw pError;
            }
        }

        this.callOnPwbUpdate();
    }

    /**
     * Call onPwbInitialize of user class object.
     */
    private callOnPwbUpdate(): void {
        // Call user class object onPwbInitialize.
        const lUserClassObject: UserClassObject = this.rootValues.userClassObject;
        if (typeof lUserClassObject.onPwbUpdate === 'function') {
            try {
                // Call in silent mode.
                lUserClassObject.onPwbUpdate();
            } catch (pError) {
                this.sendError(pError);
                throw pError;
            }
        }
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
                lSelf.callOnPwbAttributeChange(lExportProperty);
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

export class LoopError {
    public readonly chain: Array<ChangeDetectionReason>;
    public readonly message: string;

    /**
     * Constructor.
     * Create loop error.
     * @param pMessage - Error Message.
     * @param pChain - Current update chain.
     */
    public constructor(pMessage: string, pChain: Array<ChangeDetectionReason>) {
        this.message = pMessage;
        this.chain = pChain;
    }
}
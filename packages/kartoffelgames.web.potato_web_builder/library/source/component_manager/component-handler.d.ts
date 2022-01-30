import { UserClassConstructor, UserClassObject } from '../interface/user-class';
import { ComponentModules } from './component-modules';
import { ComponentValues } from './component-values';
import { ChangeDetection } from '@kartoffelgames/web.change-detection';
import { BaseXmlNode } from '@kartoffelgames/core.xml';
import { ChangeDetectionReason } from '@kartoffelgames/web.change-detection';
import { UpdateMode } from '../enum/update-mode';
/**
 * Base component handler. Handles initialisation and update of components.
 */
export declare class ComponentHandler {
    private readonly mChangeDetection;
    private readonly mComponent;
    private readonly mContent;
    private mCurrentUpdateChain;
    private mFirstAttachment;
    private mInsideUpdateCycle;
    private mIsAttached;
    private mMutationObserver;
    private mNextUpdateCycle;
    private readonly mRootBuilder;
    private readonly mUpdateListener;
    private readonly mUpdateWaiter;
    private readonly mUserClassObject;
    /**
     * Get change detection of component.
     */
    get changeDetection(): ChangeDetection;
    /**
     * Content anchor for later appending build and initilised elements on this place.
     */
    get anchor(): Comment;
    /**
     * Component content.
     */
    get content(): ShadowRoot;
    /**
     * Get user class object.
     */
    get userClassObject(): UserClassObject;
    /**
     * Get component values of the root builder.
     */
    get rootValues(): ComponentValues;
    /**
     * If component is attached to an document.
     */
    get isAttached(): boolean;
    /**
     * Get if component is initialized.
     */
    private get initialized();
    /**
     * Constructor.
     * Initialized build parameter.
     * @param pUserClassObject - User class object.
     * @param pTemplate - Template content of component.
     * @param pAttributeModules - Attribute modules of component.
     */
    constructor(pUserClass: UserClassConstructor, pTemplate: Array<BaseXmlNode>, pAttributeModules: ComponentModules, pHtmlComponent: HTMLElement, pUpdateMode: UpdateMode);
    /**
     * Create style element and prepend it to this component.
     * @param pStyle - Css style as string.
     */
    addStyle(pStyle: string): void;
    /**
     * Deconstruct element.
     */
    deconstruct(): void;
    /**
     * Get Slotname for this element.
     * User can decide where the component gets append when any slot name was set.
     * If no slot was set an exception is thrown.
     * @param pTemplate - Template of node.
     */
    getElementsSlotname(pTemplate: BaseXmlNode): string;
    /**
     * Build html elements from templates and map any nessesary data.
     * Appends build element into the place that was marked by the content anchor.
     */
    initialize(): void;
    /**
     * Send error to all error listener and to the execution zone.
     * @param pError - Error.
     */
    sendError(pError: any): void;
    /**
     * Update component parts that used the property.
     */
    updateComponent(pReason: ChangeDetectionReason): void;
    /**
     * Wait for the component update.
     * Returns Promise<false> if there is currently no update cycle.
     */
    waitForUpdate(): Promise<boolean>;
    /**
     * Call onPwbInitialize of user class object.
     */
    private callAfterPwbInitialize;
    /**
     * Call onPwbInitialize of user class object.
     */
    private callAfterPwbUpdate;
    /**
     * Call onPwbInitialize of user class object.
     * @param pAttributeName - Name of updated attribute.
     */
    private callOnPwbAttributeChange;
    /**
     * Call onPwbDeconstruct of user class object.
     */
    private callOnPwbDeconstruct;
    /**
     * Call onPwbInitialize of user class object.
     */
    private callOnPwbInitialize;
    /**
     * Call onPwbInitialize of user class object.
     */
    private callOnPwbUpdate;
    /**
     * Export exported properties so that exported user class properties can be accessed from html element.
     */
    private exportPropertiesToHtmlElement;
    /**
     * Patch setAttribute and getAttribute to set and get exported values.
     */
    private patchHtmlAttributes;
}
export declare class LoopError {
    readonly chain: Array<ChangeDetectionReason>;
    readonly message: string;
    /**
     * Constructor.
     * Create loop error.
     * @param pMessage - Error Message.
     * @param pChain - Current update chain.
     */
    constructor(pMessage: string, pChain: Array<ChangeDetectionReason>);
}
//# sourceMappingURL=component-handler.d.ts.map
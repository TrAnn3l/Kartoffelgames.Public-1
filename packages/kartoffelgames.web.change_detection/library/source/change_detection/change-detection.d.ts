import { ObjectFieldPathPart } from '@kartoffelgames/core.data';
/**
 * Merges execution zone and proxy tracking.
 */
export declare class ChangeDetection {
    private static readonly CURRENT_CHANGE_DETECTION_ZONE_DATA_KEY;
    /**
     * Get current change detection.
     */
    static get current(): ChangeDetection;
    /**
     * Get current change detection.
     * Ignores all silent zones and returns next none silent zone.
     */
    static get currentNoneSilent(): ChangeDetection;
    private readonly mChangeListenerList;
    private readonly mErrorListenerList;
    private readonly mExecutionZone;
    private readonly mParent;
    private readonly mSilent;
    /**
     * If change detection is silent.
     */
    get isSilent(): boolean;
    /**
     * Get change detection name.
     */
    get name(): string;
    /**
     * Get change detection parent.
     */
    get parent(): ChangeDetection;
    /**
     * Constructor.
     * Creates new change detection. Detects all asynchron executions inside execution zone.
     * Except IndexDB calls.
     * Listens on changes and function calls on registered objects.
     * Child changes triggers parent change detection but parent doesn't trigger child.
     * @param pName - Name of change detection.
     * @param pOnChange - Callback function that executes on possible change.
     * @param pParentChangeDetection - Parent change detection.
     * @param pSilent - [Optinal] If change detection triggers any change events.
     */
    constructor(pName: string, pParentChangeDetection?: ChangeDetection | null, pSilent?: boolean);
    /**
     * Add listener for change events.
     * @param pListener - Listener.
     */
    addChangeListener(pListener: ChangeListener): void;
    /**
     * Add listener for error events.
     * @param pListener - Listener.
     */
    addErrorListener(pListener: ErrorListener): void;
    /**
     * Create child detection that does not notice changes from parent.
     * Parent will notice any change inside child.
     * @param pName
     * @returns
     */
    createChildDetection(pName: string): ChangeDetection;
    /**
     * Trigger all change event.
     */
    dispatchChangeEvent(pReason: ChangeDetectionReason): void;
    /**
     * Trigger all change event.
     */
    dispatchErrorEvent(pError: any): void;
    /**
     * Executes function in change detections execution zone.
     * Asynchron calls can only be detected if they are sheduled inside this zone.
     * Does not call change callback.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    execute<T>(pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T;
    /**
     * Get original object from InteractionDetectionProxy-Proxy.
     * @param pObject - Possible ChangeDetectionProxy object.
     * @returns original object.
     */
    getUntrackedObject<T extends object>(pObject: T): T;
    /**
     * Access data that has been add in this zone.
     * Can access data of parent zones.
     * @param pDataKey - Key of data.
     * @returns zone data.
     */
    getZoneData(pDataKey: string): any;
    /**
     * Register an object for change detection.
     * Returns proxy object that should be used to track changes.
     * @param pObject - Object or function.
     */
    registerObject<T extends object>(pObject: T): T;
    /**
     * Remove change event listener from change detection.
     * @param pListener - Listener.
     */
    removeChangeListener(pListener: ChangeListener): void;
    /**
     * Remove error event listener from error detection.
     * @param pListener - Listener.
     */
    removeErrorListener(pListener: ErrorListener): void;
    /**
     * Set data that can be only accessed in this zone.
     * @param pDataKey - Key of data.
     * @param pValue - Value.
     */
    setZoneData(pDataKey: string, pValue: any): void;
    /**
     * Creates new silent zone and executes function.
     * Does not call change callback.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    silentExecution<T>(pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T;
    /**
     * Call all registered change listener.
     */
    private callChangeListener;
    /**
     * Call all registered error listener.
     */
    private callErrorListener;
}
export declare type ChangeListener = (pReason: ChangeDetectionReason) => void;
export declare type ErrorListener = (pError: any) => void;
export declare type ChangeDetectionReason = {
    source: any;
    property: ObjectFieldPathPart | ((...pArgs: Array<any>) => any);
    stacktrace: string;
};
//# sourceMappingURL=change-detection.d.ts.map
import { List, ObjectFieldPathPart } from '@kartoffelgames/core.data';
import { ExecutionZone } from './execution_zone/execution-zone';
import { Patcher } from './execution_zone/patcher/patcher';
import { InteractionDetectionProxy } from './synchron_tracker/interaction-detection-proxy';

/**
 * Merges execution zone and proxy tracking.
 */
export class ChangeDetection {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly CURRENT_CHANGE_DETECTION_ZONE_DATA_KEY: symbol = Symbol('_CD_DATA_KEY');

    /**
     * Get current change detection.
     */
    public static get current(): ChangeDetection {
        return ExecutionZone.current.getZoneData(ChangeDetection.CURRENT_CHANGE_DETECTION_ZONE_DATA_KEY) ?? null;
    }

    /**
     * Get current change detection.
     * Ignores all silent zones and returns next none silent zone.
     */
    public static get currentNoneSilent(): ChangeDetection {
        let lCurrent: ChangeDetection = ExecutionZone.current.getZoneData(ChangeDetection.CURRENT_CHANGE_DETECTION_ZONE_DATA_KEY);

        while (lCurrent?.isSilent) {
            lCurrent = lCurrent.mParent;
        }

        return lCurrent ?? null;
    }

    /**
     * Get original object from InteractionDetectionProxy-Proxy.
     * @param pObject - Possible ChangeDetectionProxy object.
     * @returns original object.
     */
    public static getUntrackedObject<T extends object>(pObject: T): T {
        return InteractionDetectionProxy.getOriginal(pObject);
    }

    private readonly mChangeListenerList: List<ChangeListener>;
    private readonly mErrorListenerList: List<ErrorListener>;
    private readonly mExecutionZone: ExecutionZone;
    private readonly mParent: ChangeDetection;
    private readonly mSilent: boolean;

    /**
     * If change detection is silent.
     */
    public get isSilent(): boolean {
        return this.mSilent;
    }

    /**
     * Get change detection name.
     */
    public get name(): string {
        return this.mExecutionZone.name;
    }

    /**
     * Get change detection parent.
     */
    public get parent(): ChangeDetection {
        return this.mParent ?? null;
    }

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
    public constructor(pName: string, pParentChangeDetection?: ChangeDetection | null, pSilent?: boolean) {
        // Patch execution zone.
        ExecutionZone.initialize();

        // Initialize lists
        this.mChangeListenerList = new List<() => void>();
        this.mErrorListenerList = new List<() => void>();

        // Save parent.
        this.mParent = pParentChangeDetection ?? null;

        // Create new execution zone.
        this.mExecutionZone = new ExecutionZone(pName);
        this.mExecutionZone.onInteraction = (_pZoneName: string, pFunction, pStacktrace: string) => {
            this.dispatchChangeEvent({ source: pFunction, property: 'apply', stacktrace: pStacktrace });
        };
        this.mExecutionZone.onError = (pError: any) => {
            this.dispatchErrorEvent(pError);
        };
        this.mExecutionZone.setZoneData(ChangeDetection.CURRENT_CHANGE_DETECTION_ZONE_DATA_KEY, this);

        // Set silent state. Convert null to false.
        this.mSilent = !!pSilent;
    }

    /**
     * Add listener for change events.
     * @param pListener - Listener.
     */
    public addChangeListener(pListener: ChangeListener): void {
        this.mChangeListenerList.push(pListener);
    }

    /**
     * Add listener for error events.
     * @param pListener - Listener.
     */
    public addErrorListener(pListener: ErrorListener): void {
        this.mErrorListenerList.push(pListener);
    }

    /**
     * Create child detection that does not notice changes from parent.
     * Parent will notice any change inside child. 
     * @param pName 
     * @returns 
     */
    public createChildDetection(pName: string): ChangeDetection {
        return new ChangeDetection(pName, this);
    }

    /**
     * Trigger all change event.
     */
    public dispatchChangeEvent(pReason: ChangeDetectionReason): void {
        // One trigger if change detection is not silent.
        if (!this.mSilent) {
            // Get current executing zone.
            const lCurrentChangeDetection: ChangeDetection = ChangeDetection.current ?? this;

            // Execute all listener in event target zone.
            lCurrentChangeDetection.execute(() => {
                this.callChangeListener(pReason);

                // Pass through change event to parent.
                this.mParent?.dispatchChangeEvent(pReason);
            });
        }
    }

    /**
     * Trigger all change event.
     */
    public dispatchErrorEvent(pError: any): void {
        // Get current executing zone.
        const lCurrentChangeDetection: ChangeDetection = ChangeDetection.current ?? this;

        // Execute all listener in event target zone.
        lCurrentChangeDetection.execute(() => {
            this.callErrorListener(pError);

            // Pass through error event to parent.
            this.mParent?.dispatchErrorEvent(pError);
        });
    }

    /**
     * Executes function in change detections execution zone.
     * Asynchron calls can only be detected if they are sheduled inside this zone.
     * Does not call change callback.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    public execute<T>(pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T {
        return this.mExecutionZone.executeInZoneSilent(pFunction, ...pArgs);
    }

    /**
     * Access data that has been add in this zone.
     * Can access data of parent zones.
     * @param pDataKey - Key of data.
     * @returns zone data.
     */
    public getZoneData(pDataKey: string): any {
        const lValue: any = this.mExecutionZone.getZoneData(pDataKey);

        // Get data from parent if data is not found in this change detection.
        if (typeof lValue === 'undefined' && this.mParent !== null) {
            return this.mParent.getZoneData(pDataKey);
        }

        return lValue;
    }

    /**
     * Register an object for change detection.
     * Returns proxy object that should be used to track changes.
     * @param pObject - Object or function.
     */
    public registerObject<T extends object>(pObject: T): T {
        // Get change trigger on all events.
        if (pObject instanceof EventTarget) {
            Patcher.patchObject(pObject, this.mExecutionZone);
        }

        // Create interaction proxy and send change and error event to this change detection.
        const lProxy: InteractionDetectionProxy<T> = new InteractionDetectionProxy(pObject);
        lProxy.onChange = (pSource: object, pProperty, pStacktrace: string) => {
            this.dispatchChangeEvent({ source: pSource, property: pProperty, stacktrace: pStacktrace });
        };

        return lProxy.proxy;
    }

    /**
     * Remove change event listener from change detection.
     * @param pListener - Listener.
     */
    public removeChangeListener(pListener: ChangeListener): void {
        this.mChangeListenerList.remove(pListener);
    }

    /**
     * Remove error event listener from error detection.
     * @param pListener - Listener.
     */
    public removeErrorListener(pListener: ErrorListener): void {
        this.mErrorListenerList.remove(pListener);
    }

    /**
     * Set data that can be only accessed in this zone.
     * @param pDataKey - Key of data.
     * @param pValue - Value.
     */
    public setZoneData(pDataKey: string, pValue: any): void {
        this.mExecutionZone.setZoneData(pDataKey, pValue);
    }

    /**
     * Creates new silent zone and executes function.
     * Does not call change callback.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    public silentExecution<T>(pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T {
        return new ChangeDetection(`${this.name}-SilentCD`, this, true).execute(pFunction, ...pArgs);
    }

    /**
     * Call all registered change listener.
     */
    private callChangeListener(pReason: ChangeDetectionReason): void {
        // Dispatch change event.
        for (const lListener of this.mChangeListenerList) {
            lListener(pReason);
        }
    }

    /**
     * Call all registered error listener.
     */
    private callErrorListener(pError: any): void {
        // Dispatch error event.
        for (const lListener of this.mErrorListenerList) {
            lListener(pError);
        }
    }
}

export type ChangeListener = (pReason: ChangeDetectionReason) => void;
export type ErrorListener = (pError: any) => void;
export type ChangeDetectionReason = { source: any, property: ObjectFieldPathPart | ((...pArgs: Array<any>) => any), stacktrace: string; };
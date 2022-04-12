import { List, ObjectFieldPathPart, IDeconstructable } from '@kartoffelgames/core.data';
import { ErrorAllocation } from './execution_zone/error-allocation';
import { ExecutionZone } from './execution_zone/execution-zone';
import { Patcher } from './execution_zone/patcher/patcher';
import { InteractionDetectionProxy } from './synchron_tracker/interaction-detection-proxy';

/**
 * Merges execution zone and proxy tracking.
 */
export class ChangeDetection implements IDeconstructable {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly CURRENT_CHANGE_DETECTION_ZONE_DATA_KEY: symbol = Symbol('_CD_DATA_KEY');
    private static readonly mZoneConnectedChangeDetections: WeakMap<ExecutionZone, ChangeDetection> = new WeakMap<ExecutionZone, ChangeDetection>();

    /**
     * Get current change detection.
     */
    public static get current(): ChangeDetection {
        const lCurrentZone: ExecutionZone = ExecutionZone.current;
        let lCurrentChangeDetection: ChangeDetection = ChangeDetection.mZoneConnectedChangeDetections.get(lCurrentZone);

        // Initialize new change detection
        if (!lCurrentChangeDetection) {
            lCurrentChangeDetection = new ChangeDetection(lCurrentZone);
        }

        return lCurrentChangeDetection;
    }

    /**
     * Get current change detection.
     * Ignores all silent zones and returns next none silent zone.
     */
    public static get currentNoneSilent(): ChangeDetection | null {
        let lCurrent: ChangeDetection = ChangeDetection.current;

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
    private readonly mWindowErrorListener: (pEvent: ErrorEvent) => void;
    private readonly mWindowRejectionListener: (pEvent: PromiseRejectionEvent) => void;


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
     * @param pName - Name of change detection or the change detection.
     * @param pOnChange - Callback function that executes on possible change.
     * @param pParentChangeDetection - Parent change detection.
     * @param pSilent - [Optinal] If change detection triggers any change events.
     */
    public constructor(pChangeDetection: ExecutionZone);
    public constructor(pName: string, pParentChangeDetection?: ChangeDetection | null, pSilent?: boolean);
    public constructor(pName: string | ExecutionZone, pParentChangeDetection?: ChangeDetection | null, pSilent?: boolean) {
        // Patch for execution zone.
        Patcher.patch(globalThis);

        // Initialize lists
        this.mChangeListenerList = new List<ChangeListener>();
        this.mErrorListenerList = new List<ErrorListener>();

        // Save parent.
        this.mParent = pParentChangeDetection ?? null;

        // Create new execution zone or use old one.
        if (typeof pName === 'string') {
            this.mExecutionZone = new ExecutionZone(pName);
        } else {
            this.mExecutionZone = pName;
        }

        // Register interaction event and connect execution zone with change detection.
        this.mExecutionZone.onInteraction = (_pZoneName: string, pFunction, pStacktrace: string) => {
            this.dispatchChangeEvent({ source: pFunction, property: 'apply', stacktrace: pStacktrace });
        };
        ChangeDetection.mZoneConnectedChangeDetections.set(this.mExecutionZone, this);

        // Set silent state. Convert null to false.
        this.mSilent = !!pSilent;

        // Catch global error, check if allocated zone is child of this change detection and report the error.
        const lErrorHandler = (pErrorEvent: Event, pError: any) => {
            // Get change detection
            const lErrorZone: ExecutionZone = ErrorAllocation.getExecutionZoneOfError(pError);
            if (lErrorZone) {
                const lChangeDetection: ChangeDetection = ChangeDetection.mZoneConnectedChangeDetections.get(lErrorZone);

                // Check if error change detection is child of the change detection.
                if (lChangeDetection.isChildOf(this)) {
                    // Suppress console error message if error should be suppressed
                    const lSuppressError: boolean = this.dispatchErrorEvent(pError);
                    if (lSuppressError) {
                        pErrorEvent.preventDefault();
                    }
                }
            }
        };

        // Create error and rejection listener.
        this.mWindowErrorListener = (pEvent: ErrorEvent) => {
            lErrorHandler(pEvent, pEvent.error);
        };
        this.mWindowRejectionListener = (pEvent: PromiseRejectionEvent) => {
            const lPromise: Promise<any> = pEvent.promise;
            const lPromiseZone: ExecutionZone = Reflect.get(lPromise, Patcher.PATCHED_PROMISE_ZONE_KEY);
            ErrorAllocation.allocateError(pEvent.reason, lPromiseZone);

            lErrorHandler(pEvent, pEvent.reason);
        };

        // Register global error listener.
        window.addEventListener('error', this.mWindowErrorListener);
        window.addEventListener('unhandledrejection', this.mWindowRejectionListener);
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
     * Deconstruct change detection.
     */
    public deconstruct(): void {
        // Register global error listener.
        window.removeEventListener('error', this.mWindowErrorListener);
        window.removeEventListener('unhandledrejection', this.mWindowRejectionListener);
    }

    /**
     * Trigger all change event.
     */
    public dispatchChangeEvent(pReason: ChangeDetectionReason): void {
        // One trigger if change detection is not silent.
        if (!this.mSilent) {
            // Get current executing zone.
            const lCurrentChangeDetection: ChangeDetection = ChangeDetection.current;

            // Execute all listener in event target zone.
            lCurrentChangeDetection.execute(() => {
                this.callChangeListener(pReason);

                // Pass through change event to parent.
                this.mParent?.dispatchChangeEvent(pReason);
            });
        }
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
     * Creates new silent zone and executes function.
     * Does not call change callback.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    public silentExecution<T>(pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T {
        const lChangeDetection: ChangeDetection = new ChangeDetection(`${this.name}-SilentCD`, this, true);
        const lExecutionResult: any = lChangeDetection.execute(pFunction, ...pArgs);

        // Deconstruct change detection. Error events are not needed on temporary change detections.
        lChangeDetection.deconstruct();

        return lExecutionResult;
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
    private callErrorListener(pError: any): boolean {
        let lSuppressError: boolean = false;

        // Dispatch error event.
        for (const lListener of this.mErrorListenerList) {
            lSuppressError = lListener(pError) || lSuppressError;
        }

        return lSuppressError;
    }

    /**
     * Trigger all change event.
     */
    private dispatchErrorEvent(pError: any): boolean {
        // Get current executing zone.
        const lCurrentChangeDetection: ChangeDetection = ChangeDetection.current;

        // Execute all listener in event target zone.
        return lCurrentChangeDetection.execute(() => {
            return this.callErrorListener(pError);
        });
    }

    /**
     * Check if this change detection is a child of another change detection.
     * @param pChangeDetection - Possible parent change detection.
     */
    private isChildOf(pChangeDetection: ChangeDetection): boolean {
        if (pChangeDetection === this) {
            return true;
        }

        return !!this.parent?.isChildOf(pChangeDetection);
    }
}

export type ChangeListener = (pReason: ChangeDetectionReason) => void;
export type ErrorListener = (pError: any) => void | boolean;
export type ChangeDetectionReason = { source: any, property: ObjectFieldPathPart | ((...pArgs: Array<any>) => any), stacktrace: string; };
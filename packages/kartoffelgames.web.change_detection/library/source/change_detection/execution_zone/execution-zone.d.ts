/**
 * Detects if registered object has possibly changed or any asynchron function inside this zone was executed.
 * Can' check for async and await
 */
export declare class ExecutionZone {
    private static mCurrentZone;
    /**
     * Patch all asynchron functions.
     * Does not patch twice.
     */
    static initialize(): void;
    /**
     * Current execution zone.
     */
    static get current(): ExecutionZone;
    private readonly mAdditionalData;
    private mErrorCallback;
    private mInteractionCallback;
    private readonly mName;
    /**
     * Name of zone.
     */
    get name(): string;
    /**
     * Get error callback.
     */
    get onError(): ErrorCallback;
    /**
     * Set error callback.
     */
    set onError(pErrorCallback: ErrorCallback);
    /**
     * Get change callback.
     */
    get onInteraction(): InteractionCallback;
    /**
     * Set change callback.
     */
    set onInteraction(pInteractionCallback: InteractionCallback);
    /**
     * Constructor.
     * Create new zone.
     * @param pZoneName - Name of zone.
     * @param pZone
     */
    constructor(pZoneName: string);
    /**
     * Executes function in this execution zone.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    executeInZone<T>(pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T;
    /**
     * Executes function in this execution zone.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    executeInZoneSilent<T>(pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T;
    /**
     * Access data that has been add in this zone.
     * Can access data of parent zones.
     * @param pDataKey - Key of data.
     * @returns zone data.
     */
    getZoneData(pDataKey: string | symbol | number): any;
    /**
     * Set data that can be only accessed in this zone.
     * @param pDataKey - Key of data.
     * @param pValue - Value.
     */
    setZoneData(pDataKey: string | symbol | number, pValue: any): void;
    /**
     * Dispatch change event.
     * @param pZoneName - Zone name.
     */
    private dispatchChangeEvent;
    /**
     * Dispatch error event.
     * @param pZoneName - Zone name.
     */
    private dispatchErrorEvent;
}
declare type InteractionCallback = (pZoneName: string, pFunction: (...pArgs: Array<any>) => any, pStacktrace: string) => void;
declare type ErrorCallback = (pError: any) => void;
export {};
//# sourceMappingURL=execution-zone.d.ts.map
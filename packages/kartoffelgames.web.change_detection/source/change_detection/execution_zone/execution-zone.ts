import { Dictionary } from '@kartoffelgames/core.data';
import { ChangeDetection } from '../change-detection';
import { ErrorAllocation } from './error-allocation';
import { Patcher } from './patcher/patcher';

/**
 * Detects if registered object has possibly changed or any asynchron function inside this zone was executed.
 * Can' check for async and await
 */
export class ExecutionZone {
    private static mCurrentZone: ExecutionZone = new ExecutionZone('Default');

    /**
     * Patch all asynchron functions.
     * Does not patch twice.
     */
    public static initialize(): void {
        // Patch everything.
        Patcher.patch(globalThis);
    }

    /**
     * Current execution zone.
     */
    public static get current(): ExecutionZone {
        return ExecutionZone.mCurrentZone;
    }

    private readonly mAdditionalData: Dictionary<string | symbol | number, any>;
    private mInteractionCallback: InteractionCallback;
    private readonly mName: string;

    /**
     * Name of zone.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Get change callback.
     */
    public get onInteraction(): InteractionCallback {
        return this.mInteractionCallback ?? null;
    }

    /**
     * Set change callback.
     */
    public set onInteraction(pInteractionCallback: InteractionCallback) {
        this.mInteractionCallback = pInteractionCallback;
    }

    /**
     * Constructor.
     * Create new zone.
     * @param pZoneName - Name of zone.
     */
    public constructor(pZoneName: string) {
        this.mName = pZoneName;
        this.mAdditionalData = new Dictionary<string | symbol | number, any>();
    }

    /**
     * Executes function in this execution zone.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    public executeInZone<T>(pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T {
        // Save current executing zone.
        const lLastZone: ExecutionZone = ExecutionZone.current;

        // Set this zone as execution zone and execute function.
        ExecutionZone.mCurrentZone = this;
        let lResult: any;

        // Try to execute
        try {
            lResult = pFunction(...pArgs);
        } catch (pError) {
            ErrorAllocation.allocateError(pError, this);
            throw pError;
        } finally {
            // Dispach change event.
            this.dispatchChangeEvent(this.mName, pFunction, Error().stack);

            // Reset to last zone.
            ExecutionZone.mCurrentZone = lLastZone;
        }

        return lResult;
    }

    /**
     * Executes function in this execution zone.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    public executeInZoneSilent<T>(pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T {
        // Save current executing zone.
        const lLastZone: ExecutionZone = ExecutionZone.current;

        // Set this zone as execution zone and execute function.
        ExecutionZone.mCurrentZone = this;
        let lResult: any;

        // Try to execute
        try {
            lResult = pFunction(...pArgs);
        } catch (pError) {
            ErrorAllocation.allocateError(pError, this);
            throw pError;
        } finally {
            // Reset to last zone.
            ExecutionZone.mCurrentZone = lLastZone;
        }

        return lResult;
    }

    /**
     * Access data that has been add in this zone.
     * Can access data of parent zones.
     * @param pDataKey - Key of data.
     * @returns zone data.
     */
    public getZoneData(pDataKey: string | symbol | number): any {
        const lData: any = this.mAdditionalData.get(pDataKey);
        return lData;
    }

    /**
     * Set data that can be only accessed in this zone.
     * @param pDataKey - Key of data.
     * @param pValue - Value.
     */
    public setZoneData(pDataKey: string | symbol | number, pValue: any): void {
        this.mAdditionalData.set(pDataKey, pValue);
    }

    /**
     * Dispatch change event.
     * @param pZoneName - Zone name.
     */
    private dispatchChangeEvent(pZoneName: string, pFunction: (...pArgs: Array<any>) => any, pStacktrace: string): void {
        // Execute only inside none silent zones.
        if (!ChangeDetection.current?.isSilent) {
            // Call change callbacks.
            this.onInteraction?.(pZoneName, pFunction, pStacktrace);
        }
    }
}

type InteractionCallback = (pZoneName: string, pFunction: (...pArgs: Array<any>) => any, pStacktrace: string) => void;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionZone = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const change_detection_1 = require("../change-detection");
const patcher_1 = require("./patcher/patcher");
/**
 * Detects if registered object has possibly changed or any asynchron function inside this zone was executed.
 * Can' check for async and await
 */
class ExecutionZone {
    /**
     * Constructor.
     * Create new zone.
     * @param pZoneName - Name of zone.
     * @param pZone
     */
    constructor(pZoneName) {
        this.mName = pZoneName;
        this.mAdditionalData = new core_data_1.Dictionary();
    }
    /**
     * Patch all asynchron functions.
     * Does not patch twice.
     */
    static initialize() {
        // Patch everything.
        patcher_1.Patcher.patch(globalThis);
    }
    /**
     * Current execution zone.
     */
    static get current() {
        return ExecutionZone.mCurrentZone;
    }
    /**
     * Name of zone.
     */
    get name() {
        return this.mName;
    }
    /**
     * Get error callback.
     */
    get onError() {
        var _a;
        return (_a = this.mErrorCallback) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Set error callback.
     */
    set onError(pErrorCallback) {
        this.mErrorCallback = pErrorCallback;
    }
    /**
     * Get change callback.
     */
    get onInteraction() {
        var _a;
        return (_a = this.mInteractionCallback) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Set change callback.
     */
    set onInteraction(pInteractionCallback) {
        this.mInteractionCallback = pInteractionCallback;
    }
    /**
     * Executes function in this execution zone.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    executeInZone(pFunction, ...pArgs) {
        // Save current executing zone.
        const lLastZone = ExecutionZone.current;
        // Set this zone as execution zone and execute function.
        ExecutionZone.mCurrentZone = this;
        let lResult;
        // Try to execute
        try {
            lResult = pFunction(...pArgs);
        }
        catch (pError) {
            this.dispatchErrorEvent(pError);
            throw pError;
        }
        finally {
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
    executeInZoneSilent(pFunction, ...pArgs) {
        // Save current executing zone.
        const lLastZone = ExecutionZone.current;
        // Set this zone as execution zone and execute function.
        ExecutionZone.mCurrentZone = this;
        let lResult;
        // Try to execute
        try {
            lResult = pFunction(...pArgs);
        }
        catch (pError) {
            this.dispatchErrorEvent(pError);
            throw pError;
        }
        finally {
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
    getZoneData(pDataKey) {
        const lData = this.mAdditionalData.get(pDataKey);
        return lData;
    }
    /**
     * Set data that can be only accessed in this zone.
     * @param pDataKey - Key of data.
     * @param pValue - Value.
     */
    setZoneData(pDataKey, pValue) {
        this.mAdditionalData.set(pDataKey, pValue);
    }
    /**
     * Dispatch change event.
     * @param pZoneName - Zone name.
     */
    dispatchChangeEvent(pZoneName, pFunction, pStacktrace) {
        var _a, _b;
        // Execute only inside none silent zones.
        if (!((_a = change_detection_1.ChangeDetection.current) === null || _a === void 0 ? void 0 : _a.isSilent)) {
            // Call change callbacks.
            (_b = this.onInteraction) === null || _b === void 0 ? void 0 : _b.call(this, pZoneName, pFunction, pStacktrace);
        }
    }
    /**
     * Dispatch error event.
     * @param pZoneName - Zone name.
     */
    dispatchErrorEvent(pError) {
        var _a;
        // Call error callbacks.
        (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, pError);
    }
}
exports.ExecutionZone = ExecutionZone;
ExecutionZone.mCurrentZone = new ExecutionZone('Default');
//# sourceMappingURL=execution-zone.js.map
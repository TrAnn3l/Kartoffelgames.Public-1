"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeDetection = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const execution_zone_1 = require("./execution_zone/execution-zone");
const patcher_1 = require("./execution_zone/patcher/patcher");
const interaction_detection_proxy_1 = require("./synchron_tracker/interaction-detection-proxy");
/**
 * Merges execution zone and proxy tracking.
 */
class ChangeDetection {
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
    constructor(pName, pParentChangeDetection, pSilent) {
        // Patch execution zone.
        execution_zone_1.ExecutionZone.initialize();
        // Initialize lists
        this.mChangeListenerList = new core_data_1.List();
        this.mErrorListenerList = new core_data_1.List();
        // Save parent.
        this.mParent = pParentChangeDetection !== null && pParentChangeDetection !== void 0 ? pParentChangeDetection : null;
        // Create new execution zone.
        this.mExecutionZone = new execution_zone_1.ExecutionZone(pName);
        this.mExecutionZone.onInteraction = (_pZoneName, pFunction, pStacktrace) => {
            this.dispatchChangeEvent({ source: pFunction, property: 'apply', stacktrace: pStacktrace });
        };
        this.mExecutionZone.onError = (pError) => {
            this.dispatchErrorEvent(pError);
        };
        this.mExecutionZone.setZoneData(ChangeDetection.CURRENT_CHANGE_DETECTION_ZONE_DATA_KEY, this);
        // Set silent state. Convert null to false.
        this.mSilent = !!pSilent;
    }
    /**
     * Get current change detection.
     */
    static get current() {
        var _a;
        return (_a = execution_zone_1.ExecutionZone.current.getZoneData(ChangeDetection.CURRENT_CHANGE_DETECTION_ZONE_DATA_KEY)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Get current change detection.
     * Ignores all silent zones and returns next none silent zone.
     */
    static get currentNoneSilent() {
        let lCurrent = execution_zone_1.ExecutionZone.current.getZoneData(ChangeDetection.CURRENT_CHANGE_DETECTION_ZONE_DATA_KEY);
        while (lCurrent === null || lCurrent === void 0 ? void 0 : lCurrent.isSilent) {
            lCurrent = lCurrent.mParent;
        }
        return lCurrent !== null && lCurrent !== void 0 ? lCurrent : null;
    }
    /**
     * If change detection is silent.
     */
    get isSilent() {
        return this.mSilent;
    }
    /**
     * Get change detection name.
     */
    get name() {
        return this.mExecutionZone.name;
    }
    /**
     * Get change detection parent.
     */
    get parent() {
        var _a;
        return (_a = this.mParent) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Add listener for change events.
     * @param pListener - Listener.
     */
    addChangeListener(pListener) {
        this.mChangeListenerList.push(pListener);
    }
    /**
     * Add listener for error events.
     * @param pListener - Listener.
     */
    addErrorListener(pListener) {
        this.mErrorListenerList.push(pListener);
    }
    /**
     * Create child detection that does not notice changes from parent.
     * Parent will notice any change inside child.
     * @param pName
     * @returns
     */
    createChildDetection(pName) {
        return new ChangeDetection(pName, this);
    }
    /**
     * Trigger all change event.
     */
    dispatchChangeEvent(pReason) {
        var _a;
        // One trigger if change detection is not silent.
        if (!this.mSilent) {
            // Get current executing zone.
            const lCurrentChangeDetection = (_a = ChangeDetection.current) !== null && _a !== void 0 ? _a : this;
            // Execute all listener in event target zone.
            lCurrentChangeDetection.execute(() => {
                var _a;
                this.callChangeListener(pReason);
                // Pass through change event to parent.
                (_a = this.mParent) === null || _a === void 0 ? void 0 : _a.dispatchChangeEvent(pReason);
            });
        }
    }
    /**
     * Trigger all change event.
     */
    dispatchErrorEvent(pError) {
        var _a;
        // Get current executing zone.
        const lCurrentChangeDetection = (_a = ChangeDetection.current) !== null && _a !== void 0 ? _a : this;
        // Execute all listener in event target zone.
        lCurrentChangeDetection.execute(() => {
            var _a;
            this.callErrorListener(pError);
            // Pass through error event to parent.
            (_a = this.mParent) === null || _a === void 0 ? void 0 : _a.dispatchErrorEvent(pError);
        });
    }
    /**
     * Executes function in change detections execution zone.
     * Asynchron calls can only be detected if they are sheduled inside this zone.
     * Does not call change callback.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    execute(pFunction, ...pArgs) {
        return this.mExecutionZone.executeInZoneSilent(pFunction, ...pArgs);
    }
    /**
     * Get original object from InteractionDetectionProxy-Proxy.
     * @param pObject - Possible ChangeDetectionProxy object.
     * @returns original object.
     */
    getUntrackedObject(pObject) {
        return interaction_detection_proxy_1.InteractionDetectionProxy.getOriginal(pObject);
    }
    /**
     * Access data that has been add in this zone.
     * Can access data of parent zones.
     * @param pDataKey - Key of data.
     * @returns zone data.
     */
    getZoneData(pDataKey) {
        const lValue = this.mExecutionZone.getZoneData(pDataKey);
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
    registerObject(pObject) {
        // Get change trigger on all events.
        if (pObject instanceof EventTarget) {
            patcher_1.Patcher.patchObject(pObject, this.mExecutionZone);
        }
        // Create interaction proxy and send change and error event to this change detection.
        const lProxy = new interaction_detection_proxy_1.InteractionDetectionProxy(pObject);
        lProxy.onChange = (pSource, pProperty, pStacktrace) => {
            this.dispatchChangeEvent({ source: pSource, property: pProperty, stacktrace: pStacktrace });
        };
        return lProxy.proxy;
    }
    /**
     * Remove change event listener from change detection.
     * @param pListener - Listener.
     */
    removeChangeListener(pListener) {
        this.mChangeListenerList.remove(pListener);
    }
    /**
     * Remove error event listener from error detection.
     * @param pListener - Listener.
     */
    removeErrorListener(pListener) {
        this.mErrorListenerList.remove(pListener);
    }
    /**
     * Set data that can be only accessed in this zone.
     * @param pDataKey - Key of data.
     * @param pValue - Value.
     */
    setZoneData(pDataKey, pValue) {
        this.mExecutionZone.setZoneData(pDataKey, pValue);
    }
    /**
     * Creates new silent zone and executes function.
     * Does not call change callback.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    silentExecution(pFunction, ...pArgs) {
        return new ChangeDetection(`${this.name}-SilentCD`, this, true).execute(pFunction, ...pArgs);
    }
    /**
     * Call all registered change listener.
     */
    callChangeListener(pReason) {
        // Dispatch change event.
        for (const lListener of this.mChangeListenerList) {
            lListener(pReason);
        }
    }
    /**
     * Call all registered error listener.
     */
    callErrorListener(pError) {
        // Dispatch error event.
        for (const lListener of this.mErrorListenerList) {
            lListener(pError);
        }
    }
}
exports.ChangeDetection = ChangeDetection;
// eslint-disable-next-line @typescript-eslint/naming-convention
ChangeDetection.CURRENT_CHANGE_DETECTION_ZONE_DATA_KEY = Symbol('_CD_DATA_KEY');
//# sourceMappingURL=change-detection.js.map
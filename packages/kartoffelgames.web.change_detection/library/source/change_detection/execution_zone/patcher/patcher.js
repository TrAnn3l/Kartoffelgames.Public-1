"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patcher = void 0;
const execution_zone_1 = require("../execution-zone");
const event_names_1 = require("./event-names");
class Patcher {
    /**
     * Patches functions and objects in global scope to track asynchron calls.
     * @param pGlobalObject - Global enviroment object
     */
    static patch(pGlobalObject) {
        if (!Patcher.mIsPatched) {
            Patcher.mIsPatched = true;
            const lPatcher = new Patcher();
            lPatcher.patchGlobals(pGlobalObject);
        }
    }
    /**
     * Listen on all event.
     * @param pObject - EventTarget.
     * @param pZone - Zone.
     */
    static patchObject(pObject, pZone) {
        pZone.executeInZoneSilent(() => {
            if (!(Patcher.EVENT_TARGET_PATCHED_KEY in pObject)) {
                // Add all events without function.
                for (const lEventName of event_names_1.EventNames.changeCriticalEvents) {
                    pObject.addEventListener(lEventName, () => { return; });
                }
                pObject[Patcher.EVENT_TARGET_PATCHED_KEY] = true;
            }
        });
    }
    /**
     * Patch class and its methods.
     * @param pConstructor - Class constructor.
     */
    patchClass(pConstructor) {
        // Skip undefined or not found constructor.
        if (typeof pConstructor !== 'function') {
            return pConstructor;
        }
        const lSelf = this;
        const lPrototype = pConstructor.prototype;
        // For each prototype property.
        for (const lClassMemberName of Object.getOwnPropertyNames(lPrototype)) {
            // Skip constructor.
            if (lClassMemberName === 'constructor') {
                continue;
            }
            const lMemberValue = lPrototype[lClassMemberName];
            // Only try to patch methods.
            if (typeof lMemberValue === 'function') {
                lPrototype[lClassMemberName] = this.patchFunctionParameter(lMemberValue);
            }
        }
        // Save original promise.
        const lOriginalClass = pConstructor;
        // Extend class to path constructor.
        const lPatchedClass = class PatchedClass extends pConstructor {
            /**
             * Patch all arguments of constructor.
             * @param pArgs - Any argument.
             */
            constructor(...pArgs) {
                // Get zone.
                const lCurrentZone = execution_zone_1.ExecutionZone.current;
                for (let lArgIndex = 0; lArgIndex < pArgs.length; lArgIndex++) {
                    const lArgument = pArgs[lArgIndex];
                    // Patch all arguments that are function. 
                    if (typeof lArgument === 'function') {
                        const lOriginalParameterFunction = lArgument;
                        const lPatchedParameterFunction = lSelf.wrapFunctionInZone(lSelf.patchFunctionParameter(lArgument), lCurrentZone);
                        // Cross reference original and patched function.
                        lPatchedParameterFunction[Patcher.ORIGINAL_FUNCTION_KEY] = lOriginalParameterFunction;
                        lOriginalParameterFunction[Patcher.PATCHED_FUNCTION_KEY] = lPatchedParameterFunction;
                        pArgs[lArgIndex] = lPatchedParameterFunction;
                    }
                }
                super(...pArgs);
            }
        };
        // Add original class with symbol key.
        lPatchedClass[Patcher.ORIGINAL_CLASS_KEY] = lOriginalClass;
        return lPatchedClass;
    }
    /**
     * Patch EventTarget class for executing event listener in zone the listener was created.
     * Does not patch twice.
     * @param pGlobalObject - Global this object.
     */
    patchEventTarget(pGlobalObject) {
        const lProto = pGlobalObject.EventTarget.prototype;
        // Dont patch twice.
        if (!(Patcher.ORIGINAL_FUNCTION_KEY in lProto.addEventListener)) {
            // Add event
            lProto.addEventListener = this.patchFunctionParameter(lProto.addEventListener);
        }
        // Dont patch twice.
        if (!(Patcher.ORIGINAL_FUNCTION_KEY in lProto.removeEventListener)) {
            // Remove event.
            const lOriginalRemoveEventListener = lProto.removeEventListener;
            lProto.removeEventListener = function (pType, pCallback, pOptions) {
                const lPatchedCallback = pCallback[Patcher.PATCHED_FUNCTION_KEY];
                lOriginalRemoveEventListener.call(this, pType, lPatchedCallback, pOptions);
            };
            // Cross reference original and patched function.
            lProto.removeEventListener[Patcher.ORIGINAL_FUNCTION_KEY] = lOriginalRemoveEventListener;
            lOriginalRemoveEventListener[Patcher.PATCHED_FUNCTION_KEY] = lProto.removeEventListener;
        }
    }
    /**
     * Wrap function so all callbacks gets executed inside the zone the function was called.
     * Saves original function with ORIGINAL_FUNCTION_KEY inside patched function.
     * Saves patched function with PATCHED_FUNCTION_KEY inside original function.
     * @param pFunction - Function.
     */
    patchFunctionParameter(pFunction) {
        const lSelf = this;
        const lPatchedFunction = function (...pArgs) {
            // Get zone.
            const lCurrentZone = execution_zone_1.ExecutionZone.current;
            for (let lArgIndex = 0; lArgIndex < pArgs.length; lArgIndex++) {
                const lArgument = pArgs[lArgIndex];
                // Patch all arguments that are function. 
                if (typeof lArgument === 'function') {
                    const lOriginalParameterFunction = lArgument;
                    const lPatchedParameterFunction = lSelf.wrapFunctionInZone(lSelf.patchFunctionParameter(lArgument), lCurrentZone);
                    /// Cross reference original and patched function.
                    lPatchedParameterFunction[Patcher.ORIGINAL_FUNCTION_KEY] = lOriginalParameterFunction;
                    lOriginalParameterFunction[Patcher.PATCHED_FUNCTION_KEY] = lPatchedParameterFunction;
                    pArgs[lArgIndex] = lPatchedParameterFunction;
                }
            }
            return pFunction.call(this, ...pArgs);
        };
        // Cross reference original and patched function.
        lPatchedFunction[Patcher.ORIGINAL_FUNCTION_KEY] = pFunction;
        pFunction[Patcher.PATCHED_FUNCTION_KEY] = lPatchedFunction;
        return lPatchedFunction;
    }
    /**
     * Patches functions and objects in global scope to track asynchron calls.
     * @param pGlobalObject - Global enviroment object
     */
    patchGlobals(pGlobalObject) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        // Timer
        pGlobalObject.requestAnimationFrame = this.patchFunctionParameter(pGlobalObject.requestAnimationFrame);
        pGlobalObject.setInterval = this.patchFunctionParameter(pGlobalObject.setInterval);
        pGlobalObject.setTimeout = this.patchFunctionParameter(pGlobalObject.setTimeout);
        // Promise
        pGlobalObject.Promise = this.patchClass(pGlobalObject.Promise);
        // Observer
        pGlobalObject.ResizeObserver = this.patchClass(pGlobalObject.ResizeObserver);
        pGlobalObject.MutationObserver = this.patchClass(pGlobalObject.MutationObserver);
        pGlobalObject.IntersectionObserver = this.patchClass(pGlobalObject.IntersectionObserver);
        // Event target !!!before Pathing on events. 
        this.patchEventTarget(pGlobalObject);
        // Patch HTML elements
        /* istanbul ignore next */
        {
            this.patchOnProperties((_a = pGlobalObject.XMLHttpRequestEventTarget) === null || _a === void 0 ? void 0 : _a.prototype, event_names_1.EventNames.xmlHttpRequestEventNames);
            this.patchOnProperties((_b = pGlobalObject.XMLHttpRequest) === null || _b === void 0 ? void 0 : _b.prototype, event_names_1.EventNames.xmlHttpRequestEventNames);
            this.patchOnProperties(pGlobalObject, ['messageerror', ...event_names_1.EventNames.eventNames]);
            this.patchOnProperties((_c = pGlobalObject.Document) === null || _c === void 0 ? void 0 : _c.prototype, event_names_1.EventNames.eventNames);
            this.patchOnProperties((_d = pGlobalObject.SVGElement) === null || _d === void 0 ? void 0 : _d.prototype, event_names_1.EventNames.eventNames);
            this.patchOnProperties((_e = pGlobalObject.Element) === null || _e === void 0 ? void 0 : _e.prototype, event_names_1.EventNames.eventNames);
            this.patchOnProperties((_f = pGlobalObject.HTMLElement) === null || _f === void 0 ? void 0 : _f.prototype, event_names_1.EventNames.eventNames);
            this.patchOnProperties((_g = pGlobalObject.HTMLMediaElement) === null || _g === void 0 ? void 0 : _g.prototype, event_names_1.EventNames.mediaElementEventNames);
            this.patchOnProperties((_h = pGlobalObject.HTMLFrameSetElement) === null || _h === void 0 ? void 0 : _h.prototype, [...event_names_1.EventNames.windowEventNames, ...event_names_1.EventNames.frameSetEventNames]);
            this.patchOnProperties((_j = pGlobalObject.HTMLBodyElement) === null || _j === void 0 ? void 0 : _j.prototype, [...event_names_1.EventNames.windowEventNames, ...event_names_1.EventNames.frameSetEventNames]);
            this.patchOnProperties((_k = pGlobalObject.HTMLFrameElement) === null || _k === void 0 ? void 0 : _k.prototype, event_names_1.EventNames.frameEventNames);
            this.patchOnProperties((_l = pGlobalObject.HTMLIFrameElement) === null || _l === void 0 ? void 0 : _l.prototype, event_names_1.EventNames.frameEventNames);
            this.patchOnProperties((_m = pGlobalObject.HTMLMarqueeElement) === null || _m === void 0 ? void 0 : _m.prototype, event_names_1.EventNames.marqueeEventNames);
            // Worker.
            this.patchOnProperties(pGlobalObject.Worker && (Worker === null || Worker === void 0 ? void 0 : Worker.prototype), event_names_1.EventNames.workerEventNames);
            // Index DB.
            this.patchOnProperties((_o = pGlobalObject.IDBIndex) === null || _o === void 0 ? void 0 : _o.prototype, event_names_1.EventNames.idbIndexEventNames);
            this.patchOnProperties((_p = pGlobalObject.IDBRequest) === null || _p === void 0 ? void 0 : _p.prototype, event_names_1.EventNames.idbIndexEventNames);
            this.patchOnProperties((_q = pGlobalObject.IDBOpenDBRequest) === null || _q === void 0 ? void 0 : _q.prototype, event_names_1.EventNames.idbIndexEventNames);
            this.patchOnProperties((_r = pGlobalObject.IDBDatabase) === null || _r === void 0 ? void 0 : _r.prototype, event_names_1.EventNames.idbIndexEventNames);
            this.patchOnProperties((_s = pGlobalObject.IDBTransaction) === null || _s === void 0 ? void 0 : _s.prototype, event_names_1.EventNames.idbIndexEventNames);
            this.patchOnProperties((_t = pGlobalObject.IDBCursor) === null || _t === void 0 ? void 0 : _t.prototype, event_names_1.EventNames.idbIndexEventNames);
            // Websocket.
            this.patchOnProperties((_u = pGlobalObject.WebSocket) === null || _u === void 0 ? void 0 : _u.prototype, event_names_1.EventNames.websocketEventNames);
            // Filereader
            this.patchOnProperties((_v = pGlobalObject.FileReader) === null || _v === void 0 ? void 0 : _v.prototype, event_names_1.EventNames.xmlHttpRequestEventNames);
            // Notification
            this.patchOnProperties((_w = pGlobalObject.Notification) === null || _w === void 0 ? void 0 : _w.prototype, event_names_1.EventNames.notificationEventNames);
            // RTCPeerConnection
            this.patchOnProperties((_x = pGlobalObject.RTCPeerConnection) === null || _x === void 0 ? void 0 : _x.prototype, event_names_1.EventNames.rtcPeerConnectionEventNames);
        }
        // HTMLCanvasElement.toBlob
        pGlobalObject.HTMLCanvasElement.prototype.toBlob = this.patchFunctionParameter(pGlobalObject.HTMLCanvasElement.prototype.toBlob);
    }
    /**
     * Patch every onproperty of XHR.
     * Does not patch twice.
     */
    patchOnProperties(pObject, pEventNames) {
        const lSelf = this;
        // Check for correct object type.
        if (typeof pObject !== 'object' || pObject === null) {
            return;
        }
        // Patch every event.
        for (const lEventName of pEventNames) {
            const lPropertyName = `on${lEventName}`;
            const lStorageKey = Patcher.ON_PROPERTY_FUNCTION_KEY.toString() + lPropertyName;
            const lPatchedFlag = Patcher.IS_PATCHED_FLAG_KEY.toString() + lPropertyName;
            // Skip if already patched.
            if (pObject[lPatchedFlag]) {
                continue;
            }
            const lDescriptorInformation = Object.getOwnPropertyDescriptor(pObject, lPropertyName);
            // if the descriptor not exists or is not configurable skip the property patch.
            if (!lDescriptorInformation || !lDescriptorInformation.configurable) {
                continue;
            }
            // Remove set value and writable flag to be able to add set and get.
            delete lDescriptorInformation.writable;
            delete lDescriptorInformation.value;
            lDescriptorInformation.set = function (pEventListener) {
                // Remove current added listener.
                if (typeof this[lStorageKey] === 'function') {
                    this.removeEventListener(lEventName, this[lStorageKey]);
                }
                if (typeof pEventListener === 'function') {
                    // Save new listener
                    this[lStorageKey] = lSelf.wrapFunctionInZone(pEventListener, execution_zone_1.ExecutionZone.current);
                    // Add new listener if defined.
                    this.addEventListener(lEventName, this[lStorageKey]);
                }
                else {
                    // Save whatever value this is.
                    this[lStorageKey] = pEventListener;
                }
            };
            lDescriptorInformation.get = function (...pArgs) {
                const lPatchedFunction = this[lStorageKey];
                if (typeof lPatchedFunction === 'function') {
                    return lPatchedFunction[Patcher.ORIGINAL_FUNCTION_KEY];
                }
                else {
                    return lPatchedFunction;
                }
            };
            Object.defineProperty(pObject, lPropertyName, lDescriptorInformation);
            pObject[lPatchedFlag] = true;
        }
    }
    /**
     * Patch function, so function gets always executed inside specified zone.
     * Saves original function with ORIGINAL_FUNCTION_KEY inside patched function.
     * Saves patched function with PATCHED_FUNCTION_KEY inside original function.
     * @param pFunction - Function.
     * @param pZone - Zone.
     */
    wrapFunctionInZone(pFunction, pZone) {
        const lPatchedFunction = function (...pArgs) {
            return pZone.executeInZone(pFunction, ...pArgs);
        };
        // Save original function
        lPatchedFunction[Patcher.ORIGINAL_FUNCTION_KEY] = pFunction;
        pFunction[Patcher.PATCHED_FUNCTION_KEY] = lPatchedFunction;
        return lPatchedFunction;
    }
}
exports.Patcher = Patcher;
// eslint-disable-next-line @typescript-eslint/naming-convention
Patcher.EVENT_TARGET_PATCHED_KEY = Symbol('_Event_Target_Patched');
// eslint-disable-next-line @typescript-eslint/naming-convention
Patcher.IS_PATCHED_FLAG_KEY = Symbol('_ObjectIsPatched');
// eslint-disable-next-line @typescript-eslint/naming-convention
Patcher.ON_PROPERTY_FUNCTION_KEY = Symbol('_PatchedOnPropertyFunctionKey');
// eslint-disable-next-line @typescript-eslint/naming-convention
Patcher.ORIGINAL_CLASS_KEY = Symbol('_OriginalClassKey');
// eslint-disable-next-line @typescript-eslint/naming-convention
Patcher.ORIGINAL_FUNCTION_KEY = Symbol('_OriginalFunctionKey');
// eslint-disable-next-line @typescript-eslint/naming-convention
Patcher.PATCHED_FUNCTION_KEY = Symbol('_PatchedFunctionKey');
Patcher.mIsPatched = false;
//# sourceMappingURL=patcher.js.map
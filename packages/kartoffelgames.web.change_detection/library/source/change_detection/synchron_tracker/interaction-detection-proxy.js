"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionDetectionProxy = void 0;
const change_detection_1 = require("../change-detection");
const patcher_1 = require("../execution_zone/patcher/patcher");
class InteractionDetectionProxy {
    /**
     * Constructor.
     * Create observation
     * @param pTarget - Target object or function.
     * @param pChangeDetectionCallback
     */
    constructor(pTarget) {
        // Use already created wrapper if it exist.
        const lWrapper = InteractionDetectionProxy.getWrapper(pTarget);
        if (lWrapper) {
            return lWrapper;
        }
        // Create new wrapper.
        this.mOriginalObject = InteractionDetectionProxy.getOriginal(pTarget);
        // Create new proxy object.
        this.mProxyObject = this.createProxyObject(pTarget);
        // Create access to get the wrapper on the original object.
        const lSelf = this;
        Object.defineProperty(this.mOriginalObject, InteractionDetectionProxy.OBSERVER_ORIGINAL_KEY, {
            writable: false,
            value: lSelf,
            enumerable: false
        });
    }
    /**
     * Get original object from InteractionDetectionProxy-Proxy.
     * @param pProxy - Possible ChangeDetectionProxy object.
     */
    static getOriginal(pProxy) {
        let lOriginalValue;
        if (typeof pProxy === 'object' && pProxy !== null || typeof pProxy === 'function') {
            // Try to get Proxy wrapper.
            const lWrapper = InteractionDetectionProxy.getWrapper(pProxy);
            lOriginalValue = lWrapper?.mOriginalObject ?? pProxy;
        }
        else {
            // Value can't be a proxy object.
            lOriginalValue = pProxy;
        }
        return lOriginalValue;
    }
    /**
     * Get wrapper object of proxy.
     * @param pProxy - Proxy object.
     * @returns InteractionDetectionProxy or null if not a InteractionDetectionProxy-proxy.
     */
    static getWrapper(pProxy) {
        // Check if object is a InteractionDetectionProxy-proxy.
        const lDesciptor = Object.getOwnPropertyDescriptor(pProxy, InteractionDetectionProxy.OBSERVER_DESCRIPTOR_KEY);
        if (lDesciptor && lDesciptor.value instanceof InteractionDetectionProxy) {
            return lDesciptor.value;
        }
        // Check if object is the original but has the proxys information.
        const lWrapper = pProxy[InteractionDetectionProxy.OBSERVER_ORIGINAL_KEY];
        if (lWrapper) {
            return lWrapper;
        }
        return null;
    }
    /**
     * Get proxy object for target.
     */
    get proxy() {
        return this.mProxyObject;
    }
    /**
     * Get change callback.
     */
    get onChange() {
        return this.mChangeCallback ?? null;
    }
    /**
     * Set change callback.
     */
    set onChange(pChangeCallback) {
        this.mChangeCallback = pChangeCallback;
    }
    /**
     * Create change detection proxy from object.
     * @param pTarget - Target object.
     */
    createProxyObject(pTarget) {
        const lSelf = this;
        // Create proxy handler.
        const lProxyObject = new Proxy(pTarget, {
            /**
             * Add property to object.
             * Triggers change event.
             * @param pTargetObject - Target object.
             * @param pTarget - Original object.
             * @param pPropertyName - Name of property.
             */
            set(pTargetObject, pPropertyName, pNewPropertyValue) {
                const lResult = Reflect.set(pTargetObject, pPropertyName, pNewPropertyValue);
                lSelf.dispatchChangeEvent(pTargetObject, pPropertyName, Error().stack);
                return lResult;
            },
            /**
             * Get property from object.
             * Returns Proxy element on function or object type.
             * @param pTarget - The target object.
             * @param pProperty - The name or Symbol  of the property to get.
             * @param lReceiver - Either the proxy or an object that inherits from the proxy.
             */
            get(pTarget, pProperty, _pReceiver) {
                const lResult = Reflect.get(pTarget, pProperty);
                if (typeof lResult === 'object' && lResult !== null || typeof lResult === 'function') {
                    const lProxy = new InteractionDetectionProxy(lResult);
                    lProxy.onChange = (pSourceObject, pProperty) => {
                        lSelf.dispatchChangeEvent(pSourceObject, pProperty, Error().stack);
                    };
                    return lProxy.proxy;
                }
                else {
                    return lResult;
                }
            },
            /**
             * Remove property from object.
             * @param pTarget - Original object.
             * @param pPropertyName - Name of property.
             */
            deleteProperty(pTargetObject, pPropertyName) {
                delete pTargetObject[pPropertyName];
                lSelf.dispatchChangeEvent(pTargetObject, pPropertyName, Error().stack);
                return true;
            },
            /**
             * Called on function call.
             * @param pTargetObject - Function that was called.
             * @param pThisArgument - This argument of call.
             * @param pArgumentsList - All arguments of call.
             */
            apply(pTargetObject, pThisArgument, pArgumentsList) {
                const lOriginalThisObject = InteractionDetectionProxy.getOriginal(pThisArgument);
                let lResult;
                let lFunctionResult;
                // Execute function and dispatch change event on synchron exceptions.
                try {
                    lFunctionResult = pTargetObject.call(lOriginalThisObject, ...pArgumentsList);
                }
                catch (e) {
                    lSelf.dispatchChangeEvent(lOriginalThisObject, pTargetObject, Error().stack);
                    throw e;
                }
                // Get original promise constructor.
                let lPromiseConstructor = Promise;
                /* istanbul ignore next */
                while (patcher_1.Patcher.ORIGINAL_CLASS_KEY in lPromiseConstructor) {
                    lPromiseConstructor = lPromiseConstructor[patcher_1.Patcher.ORIGINAL_CLASS_KEY];
                }
                // Override possible system promise. 
                if (lFunctionResult instanceof lPromiseConstructor) {
                    lResult = new globalThis.Promise((pResolve, pReject) => {
                        // Can't call finally because wrong execution queue.
                        // Wrong: await THIS() -> Code after THIS() -> Dispatched Event.
                        // Right: await THIS() -> Dispatched Event -> Code after THIS().
                        lFunctionResult.then((pResult) => {
                            lSelf.dispatchChangeEvent(lOriginalThisObject, pTargetObject, Error().stack);
                            pResolve(pResult);
                        }).catch((pReason) => {
                            lSelf.dispatchChangeEvent(lOriginalThisObject, pTargetObject, Error().stack);
                            pReject(pReason);
                        });
                    });
                }
                else {
                    lSelf.dispatchChangeEvent(lOriginalThisObject, pTargetObject, Error().stack);
                    lResult = lFunctionResult;
                }
                return lResult;
            },
            /**
             * Get ObjectDescriptor from object.
             * @param pTargetObject - Original object.
             * @param pPropertyName - Name of property.
             */
            getOwnPropertyDescriptor(pTargetObject, pPropertyName) {
                // Get "fake" descriptor containing this observer.
                if (pPropertyName === InteractionDetectionProxy.OBSERVER_DESCRIPTOR_KEY) {
                    return { configurable: true, enumerable: true, value: lSelf };
                }
                // Get real object descriptor.
                return Object.getOwnPropertyDescriptor(pTargetObject, pPropertyName);
            }
        });
        return lProxyObject;
    }
    /**
     * Trigger change event.
     */
    dispatchChangeEvent(pSourceObject, pProperty, pStacktrace) {
        // Only trigger if current change detection is not silent.
        if (change_detection_1.ChangeDetection.current === null || !change_detection_1.ChangeDetection.current.isSilent) {
            this.onChange?.(pSourceObject, pProperty, pStacktrace);
        }
    }
}
exports.InteractionDetectionProxy = InteractionDetectionProxy;
// Descriptor key for the fake descriptor.
// eslint-disable-next-line @typescript-eslint/naming-convention
InteractionDetectionProxy.OBSERVER_DESCRIPTOR_KEY = Symbol('ChangeDetectionProxyDescriptor');
// eslint-disable-next-line @typescript-eslint/naming-convention
InteractionDetectionProxy.OBSERVER_ORIGINAL_KEY = Symbol('ChangeDetectionProxyWrapper');
//# sourceMappingURL=interaction-detection-proxy.js.map
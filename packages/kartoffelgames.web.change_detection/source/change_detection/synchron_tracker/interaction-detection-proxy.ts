import { ObjectFieldPathPart } from '@kartoffelgames/core.data';
import { ChangeDetection } from '../change-detection';
import { Patcher } from '../execution_zone/patcher/patcher';

export class InteractionDetectionProxy<T extends object> {
    // Descriptor key for the fake descriptor.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly OBSERVER_DESCRIPTOR_KEY: symbol = Symbol('ChangeDetectionProxyDescriptor');
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly OBSERVER_ORIGINAL_KEY: symbol = Symbol('ChangeDetectionProxyWrapper');

    /**
     * Get original object from InteractionDetectionProxy-Proxy.
     * @param pProxy - Possible ChangeDetectionProxy object.
     */
    public static getOriginal<TValue>(pProxy: TValue): TValue {
        let lOriginalValue: TValue;

        if (typeof pProxy === 'object' && pProxy !== null || typeof pProxy === 'function') {
            // Try to get Proxy wrapper.
            const lWrapper: InteractionDetectionProxy<any> = InteractionDetectionProxy.getWrapper(<any>pProxy);
            lOriginalValue = lWrapper?.mOriginalObject ?? pProxy;
        } else {
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
    private static getWrapper<TObject extends object>(pProxy: TObject): InteractionDetectionProxy<TObject> {
        // Check if object is a InteractionDetectionProxy-proxy.
        const lDesciptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(pProxy, InteractionDetectionProxy.OBSERVER_DESCRIPTOR_KEY);
        if (lDesciptor && lDesciptor.value instanceof InteractionDetectionProxy) {
            return <InteractionDetectionProxy<TObject>>lDesciptor.value;
        }

        // Check if object is the original but has the proxys information.
        const lWrapper: InteractionDetectionProxy<TObject> = (<any>pProxy)[InteractionDetectionProxy.OBSERVER_ORIGINAL_KEY];
        if (lWrapper) {
            return lWrapper;
        }

        return null;
    }

    private mChangeCallback: ChangeCallback;
    private readonly mOriginalObject: T;
    private readonly mProxyObject: T;

    /**
     * Get proxy object for target.
     */
    public get proxy(): T {
        return this.mProxyObject;
    }

    /**
     * Get change callback.
     */
    public get onChange(): ChangeCallback {
        return this.mChangeCallback ?? null;
    }

    /**
     * Set change callback.
     */
    public set onChange(pChangeCallback: ChangeCallback) {
        this.mChangeCallback = pChangeCallback;
    }

    /**
     * Constructor.
     * Create observation
     * @param pTarget - Target object or function.
     * @param pChangeDetectionCallback 
     */
    public constructor(pTarget: T) {
        // Use already created wrapper if it exist.
        const lWrapper: InteractionDetectionProxy<T> = InteractionDetectionProxy.getWrapper(pTarget);
        if (lWrapper) {
            return lWrapper;
        }

        // Create new wrapper.
        this.mOriginalObject = InteractionDetectionProxy.getOriginal(pTarget);

        // Create new proxy object.
        this.mProxyObject = this.createProxyObject(pTarget);

        // Create access to get the wrapper on the original object.
        const lSelf: this = this;
        Object.defineProperty(this.mOriginalObject, InteractionDetectionProxy.OBSERVER_ORIGINAL_KEY, {
            writable: false,
            value: lSelf,
            enumerable: false
        });
    }

    /**
     * Create change detection proxy from object.
     * @param pTarget - Target object.
     */
    private createProxyObject(pTarget: T): T {
        const lSelf: InteractionDetectionProxy<T> = this;

        // Create proxy handler.
        const lProxyObject: T = new Proxy(pTarget, {
            /**
             * Add property to object.
             * Triggers change event.
             * @param pTargetObject - Target object.
             * @param pTarget - Original object.
             * @param pPropertyName - Name of property.
             */
            set(pTargetObject: T, pPropertyName: ObjectFieldPathPart, pNewPropertyValue: any): boolean {
                const lResult: boolean = Reflect.set(pTargetObject, pPropertyName, pNewPropertyValue);
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
            get(pTarget, pProperty: ObjectFieldPathPart, _pReceiver) {
                const lResult: any = Reflect.get(pTarget, pProperty);

                if (typeof lResult === 'object' && lResult !== null || typeof lResult === 'function') {
                    const lProxy: InteractionDetectionProxy<any> = new InteractionDetectionProxy(lResult);
                    lProxy.onChange = (pSourceObject: object, pProperty: ObjectFieldPathPart | ((...pArgs: Array<any>) => any)) => {
                        lSelf.dispatchChangeEvent(pSourceObject, pProperty, Error().stack);
                    };

                    return lProxy.proxy;
                } else {
                    return lResult;
                }
            },

            /**
             * Remove property from object.
             * @param pTarget - Original object.
             * @param pPropertyName - Name of property.
             */
            deleteProperty(pTargetObject: T, pPropertyName: ObjectFieldPathPart): boolean {
                delete (<any>pTargetObject)[pPropertyName];
                lSelf.dispatchChangeEvent(pTargetObject, pPropertyName, Error().stack);
                return true;
            },

            /**
             * Called on function call.
             * @param pTargetObject - Function that was called.
             * @param pThisArgument - This argument of call.
             * @param pArgumentsList - All arguments of call.
             */
            apply(pTargetObject: T, pThisArgument: any, pArgumentsList: Array<any>) {
                const lOriginalThisObject: object = InteractionDetectionProxy.getOriginal(pThisArgument);
                let lResult: any;
                let lFunctionResult: any;

                // Execute function and dispatch change event on synchron exceptions.
                try {
                    lFunctionResult = (<(...args: Array<any>) => any>pTargetObject).call(lOriginalThisObject, ...pArgumentsList);
                } catch (e) {
                    lSelf.dispatchChangeEvent(lOriginalThisObject, <(...args: Array<any>) => any>pTargetObject, Error().stack);
                    throw e;
                }

                // Get original promise constructor.
                let lPromiseConstructor: typeof Promise = Promise;
                /* istanbul ignore next */
                while (Patcher.ORIGINAL_CLASS_KEY in lPromiseConstructor) {
                    lPromiseConstructor = (<any>lPromiseConstructor)[Patcher.ORIGINAL_CLASS_KEY];
                }

                // Override possible system promise. 
                if (lFunctionResult instanceof lPromiseConstructor) {
                    lResult = new globalThis.Promise<any>((pResolve, pReject) => {
                        // Can't call finally because wrong execution queue.
                        // Wrong: await THIS() -> Code after THIS() -> Dispatched Event.
                        // Right: await THIS() -> Dispatched Event -> Code after THIS().
                        lFunctionResult.then((pResult: any) => {
                            lSelf.dispatchChangeEvent(lOriginalThisObject, <(...args: Array<any>) => any>pTargetObject, Error().stack);
                            pResolve(pResult);
                        }).catch((pReason: any) => {
                            lSelf.dispatchChangeEvent(lOriginalThisObject, <(...args: Array<any>) => any>pTargetObject, Error().stack);
                            pReject(pReason);
                        });
                    });
                } else {
                    lSelf.dispatchChangeEvent(lOriginalThisObject, <(...args: Array<any>) => any>pTargetObject, Error().stack);
                    lResult = lFunctionResult;
                }

                return lResult;
            },

            /**
             * Get ObjectDescriptor from object.
             * @param pTargetObject - Original object.
             * @param pPropertyName - Name of property.
             */
            getOwnPropertyDescriptor(pTargetObject: T, pPropertyName: ObjectFieldPathPart): PropertyDescriptor {
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
    private dispatchChangeEvent(pSourceObject: object, pProperty: ObjectFieldPathPart | ((...pArgs: Array<any>) => any), pStacktrace: string) {
        // Only trigger if current change detection is not silent.
        if (ChangeDetection.current === null || !ChangeDetection.current.isSilent) {
            this.onChange?.(pSourceObject, pProperty, pStacktrace);
        }
    }
}

type ChangeCallback = (pSourceObject: object, pProperty: ObjectFieldPathPart | ((...pArgs: Array<any>) => any), pStacktrace: string) => void;
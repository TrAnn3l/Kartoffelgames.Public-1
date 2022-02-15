import { ExecutionZone } from '../execution-zone';
import { EventNames } from './event-names';

export class Patcher {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly EVENT_TARGET_PATCHED_KEY: symbol = Symbol('_Event_Target_Patched');
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly IS_PATCHED_FLAG_KEY: symbol = Symbol('_ObjectIsPatched');
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly ON_PROPERTY_FUNCTION_KEY: symbol = Symbol('_PatchedOnPropertyFunctionKey');
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly ORIGINAL_CLASS_KEY: symbol = Symbol('_OriginalClassKey');
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly ORIGINAL_FUNCTION_KEY: symbol = Symbol('_OriginalFunctionKey');
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly PATCHED_FUNCTION_KEY: symbol = Symbol('_PatchedFunctionKey');
    private static mIsPatched: boolean = false;

    /**
     * Patches functions and objects in global scope to track asynchron calls.
     * @param pGlobalObject - Global enviroment object
     */
    public static patch(pGlobalObject: typeof globalThis): void {
        if (!Patcher.mIsPatched) {
            Patcher.mIsPatched = true;

            const lPatcher: Patcher = new Patcher();
            lPatcher.patchGlobals(pGlobalObject);
        }
    }

    /**
     * Listen on all event.
     * @param pObject - EventTarget.
     * @param pZone - Zone.
     */
    public static patchObject(pObject: EventTarget, pZone: ExecutionZone): void {
        pZone.executeInZoneSilent(() => {
            if (!(Patcher.EVENT_TARGET_PATCHED_KEY in pObject)) {
                // Add all events without function.
                for (const lEventName of EventNames.changeCriticalEvents) {
                    pObject.addEventListener(lEventName, () => { return; });
                }

                Reflect.set(pObject, Patcher.EVENT_TARGET_PATCHED_KEY, true);
            }
        });
    }

    /**
     * Patch class and its methods.
     * @param pConstructor - Class constructor.
     */
    private patchClass(pConstructor: any): any {
        // Skip undefined or not found constructor.
        if (typeof pConstructor !== 'function') {
            return pConstructor;
        }

        const lSelf: this = this;
        const lPrototype = pConstructor.prototype;

        // For each prototype property.
        for (const lClassMemberName of Object.getOwnPropertyNames(lPrototype)) {
            // Skip constructor.
            if (lClassMemberName === 'constructor') {
                continue;
            }

            const lMemberValue: unknown = lPrototype[lClassMemberName];

            // Only try to patch methods.
            if (typeof lMemberValue === 'function') {
                lPrototype[lClassMemberName] = this.patchFunctionParameter(<any>lMemberValue);
            }
        }

        // Save original promise.
        const lOriginalClass: any = pConstructor;

        // Extend class to path constructor.
        const lPatchedClass = class PatchedClass extends pConstructor {
            /**
             * Patch all arguments of constructor.
             * @param pArgs - Any argument.
             */
            public constructor(...pArgs: Array<any>) {
                // Get zone.
                const lCurrentZone = ExecutionZone.current;

                for (let lArgIndex: number = 0; lArgIndex < pArgs.length; lArgIndex++) {
                    const lArgument: any = pArgs[lArgIndex];

                    // Patch all arguments that are function. 
                    if (typeof lArgument === 'function') {
                        const lOriginalParameterFunction: (...pArgs: Array<any>) => any = lArgument;
                        const lPatchedParameterFunction: (...pArgs: Array<any>) => any = lSelf.wrapFunctionInZone(lSelf.patchFunctionParameter(lArgument), lCurrentZone);

                        // Cross reference original and patched function.
                        Reflect.set(lPatchedParameterFunction, Patcher.ORIGINAL_FUNCTION_KEY, lOriginalParameterFunction);
                        Reflect.set(lOriginalParameterFunction, Patcher.PATCHED_FUNCTION_KEY, lPatchedParameterFunction);

                        pArgs[lArgIndex] = lPatchedParameterFunction;
                    }
                }

                super(...pArgs);
            }
        };

        // Add original class with symbol key.
        Reflect.set(lPatchedClass, Patcher.ORIGINAL_CLASS_KEY, lOriginalClass);

        return lPatchedClass;
    }

    /**
     * Patch EventTarget class for executing event listener in zone the listener was created.
     * Does not patch twice.
     * @param pGlobalObject - Global this object.
     */
    private patchEventTarget(pGlobalObject: typeof globalThis): void {
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
            lProto.removeEventListener = function (pType: string, pCallback: EventListenerOrEventListenerObject | null, pOptions?: EventListenerOptions | boolean): void {
                const lPatchedCallback: any = Reflect.get(pCallback, Patcher.PATCHED_FUNCTION_KEY);
                lOriginalRemoveEventListener.call(this, pType, lPatchedCallback, pOptions);
            };

            // Cross reference original and patched function.
            Reflect.set(lProto.removeEventListener, Patcher.ORIGINAL_FUNCTION_KEY, lOriginalRemoveEventListener);
            Reflect.set(lOriginalRemoveEventListener, Patcher.PATCHED_FUNCTION_KEY, lProto.removeEventListener);
        }
    }

    /**
     * Wrap function so all callbacks gets executed inside the zone the function was called.
     * Saves original function with ORIGINAL_FUNCTION_KEY inside patched function.
     * Saves patched function with PATCHED_FUNCTION_KEY inside original function.
     * @param pFunction - Function.
     */
    private patchFunctionParameter(pFunction: (...pArgs: Array<any>) => any): (...pArgs: Array<any>) => any {
        const lSelf: this = this;
        const lPatchedFunction = function (...pArgs: Array<any>) {
            // Get zone.
            const lCurrentZone = ExecutionZone.current;

            for (let lArgIndex: number = 0; lArgIndex < pArgs.length; lArgIndex++) {
                const lArgument: any = pArgs[lArgIndex];

                // Patch all arguments that are function. 
                if (typeof lArgument === 'function') {
                    const lOriginalParameterFunction: (...pArgs: Array<any>) => any = lArgument;
                    const lPatchedParameterFunction: (...pArgs: Array<any>) => any = lSelf.wrapFunctionInZone(lSelf.patchFunctionParameter(lArgument), lCurrentZone);

                    // Cross reference original and patched function.
                    Reflect.set(lPatchedParameterFunction, Patcher.ORIGINAL_FUNCTION_KEY, lOriginalParameterFunction);
                    Reflect.set(lOriginalParameterFunction, Patcher.PATCHED_FUNCTION_KEY, lPatchedParameterFunction);

                    pArgs[lArgIndex] = lPatchedParameterFunction;
                }
            }

            return pFunction.call(this, ...pArgs);
        };

        // Cross reference original and patched function.
        Reflect.set(lPatchedFunction, Patcher.ORIGINAL_FUNCTION_KEY, pFunction);
        Reflect.set(pFunction, Patcher.PATCHED_FUNCTION_KEY, lPatchedFunction);

        return lPatchedFunction;
    }

    /**
     * Patches functions and objects in global scope to track asynchron calls.
     * @param pGlobalObject - Global enviroment object
     */
    private patchGlobals(pGlobalObject: typeof globalThis): void {
        // Timer
        pGlobalObject.requestAnimationFrame = this.patchFunctionParameter(pGlobalObject.requestAnimationFrame);
        pGlobalObject.setInterval = <any>this.patchFunctionParameter(pGlobalObject.setInterval);
        pGlobalObject.setTimeout = <any>this.patchFunctionParameter(pGlobalObject.setTimeout);

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
            this.patchOnProperties(pGlobalObject.XMLHttpRequestEventTarget?.prototype, EventNames.xmlHttpRequestEventNames);
            this.patchOnProperties(pGlobalObject.XMLHttpRequest?.prototype, EventNames.xmlHttpRequestEventNames);
            this.patchOnProperties(pGlobalObject, ['messageerror', ...EventNames.eventNames]);
            this.patchOnProperties(pGlobalObject.Document?.prototype, EventNames.eventNames);
            this.patchOnProperties(pGlobalObject.SVGElement?.prototype, EventNames.eventNames);
            this.patchOnProperties(pGlobalObject.Element?.prototype, EventNames.eventNames);
            this.patchOnProperties(pGlobalObject.HTMLElement?.prototype, EventNames.eventNames);
            this.patchOnProperties(pGlobalObject.HTMLMediaElement?.prototype, EventNames.mediaElementEventNames);
            this.patchOnProperties(pGlobalObject.HTMLFrameSetElement?.prototype, [...EventNames.windowEventNames, ...EventNames.frameSetEventNames]);
            this.patchOnProperties(pGlobalObject.HTMLBodyElement?.prototype, [...EventNames.windowEventNames, ...EventNames.frameSetEventNames]);
            this.patchOnProperties(pGlobalObject.HTMLFrameElement?.prototype, EventNames.frameEventNames);
            this.patchOnProperties(pGlobalObject.HTMLIFrameElement?.prototype, EventNames.frameEventNames);
            this.patchOnProperties(pGlobalObject.HTMLMarqueeElement?.prototype, EventNames.marqueeEventNames);
            // Worker.
            this.patchOnProperties(pGlobalObject.Worker && Worker?.prototype, EventNames.workerEventNames);
            // Index DB.
            this.patchOnProperties(pGlobalObject.IDBIndex?.prototype, EventNames.idbIndexEventNames);
            this.patchOnProperties(pGlobalObject.IDBRequest?.prototype, EventNames.idbIndexEventNames);
            this.patchOnProperties(pGlobalObject.IDBOpenDBRequest?.prototype, EventNames.idbIndexEventNames);
            this.patchOnProperties(pGlobalObject.IDBDatabase?.prototype, EventNames.idbIndexEventNames);
            this.patchOnProperties(pGlobalObject.IDBTransaction?.prototype, EventNames.idbIndexEventNames);
            this.patchOnProperties(pGlobalObject.IDBCursor?.prototype, EventNames.idbIndexEventNames);
            // Websocket.
            this.patchOnProperties(pGlobalObject.WebSocket?.prototype, EventNames.websocketEventNames);
            // Filereader
            this.patchOnProperties(pGlobalObject.FileReader?.prototype, EventNames.xmlHttpRequestEventNames);
            // Notification
            this.patchOnProperties(pGlobalObject.Notification?.prototype, EventNames.notificationEventNames);
            // RTCPeerConnection
            this.patchOnProperties(pGlobalObject.RTCPeerConnection?.prototype, EventNames.rtcPeerConnectionEventNames);
        }

        // HTMLCanvasElement.toBlob
        pGlobalObject.HTMLCanvasElement.prototype.toBlob = this.patchFunctionParameter(pGlobalObject.HTMLCanvasElement.prototype.toBlob);
    }

    /**
     * Patch every onproperty of XHR.
     * Does not patch twice.
     */
    private patchOnProperties(pObject: any, pEventNames: Array<string>): void {
        const lSelf: this = this;

        // Check for correct object type.
        if (typeof pObject !== 'object' || pObject === null) {
            return;
        }

        // Patch every event.
        for (const lEventName of pEventNames) {
            const lPropertyName: string = `on${lEventName}`;
            const lStorageKey: string = Patcher.ON_PROPERTY_FUNCTION_KEY.toString() + lPropertyName;
            const lPatchedFlag: string = Patcher.IS_PATCHED_FLAG_KEY.toString() + lPropertyName;

            // Skip if already patched.
            if (pObject[lPatchedFlag]) {
                continue;
            }

            const lDescriptorInformation: PropertyDescriptor = Object.getOwnPropertyDescriptor(pObject, lPropertyName);

            // if the descriptor not exists or is not configurable skip the property patch.
            if (!lDescriptorInformation || !lDescriptorInformation.configurable) {
                continue;
            }

            // Remove set value and writable flag to be able to add set and get.
            delete lDescriptorInformation.writable;
            delete lDescriptorInformation.value;

            lDescriptorInformation.set = function (pEventListener: (...pArgs: Array<any>) => any): void {
                // Remove current added listener.
                if (typeof this[lStorageKey] === 'function') {
                    this.removeEventListener(lEventName, this[lStorageKey]);
                }

                if (typeof pEventListener === 'function') {
                    // Save new listener
                    this[lStorageKey] = lSelf.wrapFunctionInZone(pEventListener, ExecutionZone.current);

                    // Add new listener if defined.
                    this.addEventListener(lEventName, this[lStorageKey]);
                } else {
                    // Save whatever value this is.
                    this[lStorageKey] = pEventListener;
                }
            };

            lDescriptorInformation.get = function (...pArgs: Array<any>): any {
                const lPatchedFunction = this[lStorageKey];
                if (typeof lPatchedFunction === 'function') {
                    return lPatchedFunction[Patcher.ORIGINAL_FUNCTION_KEY];
                } else {
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
    private wrapFunctionInZone(pFunction: (...pArgs: Array<any>) => any, pZone: ExecutionZone): (...pArgs: Array<any>) => any {
        const lPatchedFunction = function (...pArgs: Array<any>) {
            return pZone.executeInZone(pFunction, ...pArgs);
        };

        // Save original function
        Reflect.set(lPatchedFunction, Patcher.ORIGINAL_FUNCTION_KEY, pFunction);
        Reflect.set(pFunction, Patcher.PATCHED_FUNCTION_KEY, lPatchedFunction);

        return lPatchedFunction;
    }
}
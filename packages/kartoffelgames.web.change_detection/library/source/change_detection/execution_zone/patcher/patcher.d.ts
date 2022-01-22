import { ExecutionZone } from '../execution-zone';
export declare class Patcher {
    static readonly EVENT_TARGET_PATCHED_KEY: symbol;
    static readonly IS_PATCHED_FLAG_KEY: symbol;
    static readonly ON_PROPERTY_FUNCTION_KEY: symbol;
    static readonly ORIGINAL_CLASS_KEY: symbol;
    static readonly ORIGINAL_FUNCTION_KEY: symbol;
    static readonly PATCHED_FUNCTION_KEY: symbol;
    private static mIsPatched;
    /**
     * Patches functions and objects in global scope to track asynchron calls.
     * @param pGlobalObject - Global enviroment object
     */
    static patch(pGlobalObject: typeof globalThis): void;
    /**
     * Listen on all event.
     * @param pObject - EventTarget.
     * @param pZone - Zone.
     */
    static patchObject(pObject: EventTarget, pZone: ExecutionZone): void;
    /**
     * Patch class and its methods.
     * @param pConstructor - Class constructor.
     */
    private patchClass;
    /**
     * Patch EventTarget class for executing event listener in zone the listener was created.
     * Does not patch twice.
     * @param pGlobalObject - Global this object.
     */
    private patchEventTarget;
    /**
     * Wrap function so all callbacks gets executed inside the zone the function was called.
     * Saves original function with ORIGINAL_FUNCTION_KEY inside patched function.
     * Saves patched function with PATCHED_FUNCTION_KEY inside original function.
     * @param pFunction - Function.
     */
    private patchFunctionParameter;
    /**
     * Patches functions and objects in global scope to track asynchron calls.
     * @param pGlobalObject - Global enviroment object
     */
    private patchGlobals;
    /**
     * Patch every onproperty of XHR.
     * Does not patch twice.
     */
    private patchOnProperties;
    /**
     * Patch function, so function gets always executed inside specified zone.
     * Saves original function with ORIGINAL_FUNCTION_KEY inside patched function.
     * Saves patched function with PATCHED_FUNCTION_KEY inside original function.
     * @param pFunction - Function.
     * @param pZone - Zone.
     */
    private wrapFunctionInZone;
}
//# sourceMappingURL=patcher.d.ts.map
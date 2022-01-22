import { ObjectFieldPathPart } from '@kartoffelgames/core.data';
export declare class InteractionDetectionProxy<T extends object> {
    private static readonly OBSERVER_DESCRIPTOR_KEY;
    private static readonly OBSERVER_ORIGINAL_KEY;
    /**
     * Get original object from InteractionDetectionProxy-Proxy.
     * @param pProxy - Possible ChangeDetectionProxy object.
     */
    static getOriginal<TValue>(pProxy: TValue): TValue;
    /**
     * Get wrapper object of proxy.
     * @param pProxy - Proxy object.
     * @returns InteractionDetectionProxy or null if not a InteractionDetectionProxy-proxy.
     */
    private static getWrapper;
    private mChangeCallback;
    private readonly mOriginalObject;
    private readonly mProxyObject;
    /**
     * Get proxy object for target.
     */
    get proxy(): T;
    /**
     * Get change callback.
     */
    get onChange(): ChangeCallback;
    /**
     * Set change callback.
     */
    set onChange(pChangeCallback: ChangeCallback);
    /**
     * Constructor.
     * Create observation
     * @param pTarget - Target object or function.
     * @param pChangeDetectionCallback
     */
    constructor(pTarget: T);
    /**
     * Create change detection proxy from object.
     * @param pTarget - Target object.
     */
    private createProxyObject;
    /**
     * Trigger change event.
     */
    private dispatchChangeEvent;
}
declare type ChangeCallback = (pSourceObject: object, pProperty: ObjectFieldPathPart | ((...pArgs: Array<any>) => any), pStacktrace: string) => void;
export {};
//# sourceMappingURL=interaction-detection-proxy.d.ts.map
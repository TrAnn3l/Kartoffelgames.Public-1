import { ComponentManager } from '../component-manager';
/**
 * Interface between persistent values directly from component and temporary values
 * that are not directly inside the component but attached to it.
 *
 * Simple access for all value types: TemporaryValue, IdChild and UserClassValue.
 * has-, get-, set-, remove-.
 */
export declare class LayerValues {
    private readonly mComponentManager;
    private readonly mParentLayer;
    private readonly mTemporaryValues;
    /**
     * Component manager connected with layer value.
     */
    get componentManager(): ComponentManager;
    /**
     * Get all keys of temorary values.
     */
    private get temporaryValuesList();
    /**
     * Constructor.
     * New component value layer.
     * @param pParentLayer - Parent layer. ComponentManager on root layer.
     */
    constructor(pParentLayer: LayerValues | ComponentManager);
    /**
     * Check for changes into two value handler.
     * @param pHandler - Handler two.
     */
    equal(pHandler: LayerValues): boolean;
    /**
     * Gets the html element specified temporary value.
     * @param pValueName - Name of value.
     */
    getValue<TValue>(pValueName: string): TValue;
    /**
     * Remove temporary value from this layer.
     * @param pValueName - Name of value.
     */
    removeLayerValue(pValueName: string): void;
    /**
     * Add or replaces temporary value in this manipulator scope.
     * @param pKey - Key of value.
     * @param pValue - Value.
     */
    setLayerValue<TValue>(pKey: string, pValue: TValue): void;
    /**
     * Set value to root. All child can access this value.
     * @param pKey - Value key.
     * @param pValue - Value.
     */
    setRootValue<TValue>(pKey: string, pValue: TValue): void;
}
//# sourceMappingURL=layer-values.d.ts.map
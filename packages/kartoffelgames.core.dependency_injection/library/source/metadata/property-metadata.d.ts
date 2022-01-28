import { InjectionConstructor } from '../type';
export declare class PropertyMetadata {
    private readonly mCustomMetadata;
    private mParameterTypes;
    private mReturnType;
    private mType;
    /**
     * Get parameter type information.
     */
    get parameterTypes(): Array<InjectionConstructor>;
    /**
     * Set parameter type information.
     */
    set parameterTypes(pParameterTypes: Array<InjectionConstructor>);
    /**
     * Get return type information.
     */
    get returnType(): InjectionConstructor;
    /**
     * Set return type information.
     */
    set returnType(pReturnType: InjectionConstructor);
    /**
     * Get property type information.
     */
    get type(): InjectionConstructor;
    /**
     * Set property type information.
     */
    set type(pReturnType: InjectionConstructor);
    /**
     * Constructor.
     * Initialize lists.
     */
    constructor();
    /**
     * Get metadata of constructor.
     * @param pMetadataKey - Metadata key.
     */
    getMetadata(pMetadataKey: string): unknown;
    /**
     * Set metadata of constructor.
     * @param pMetadataKey - Metadata key.
     * @param pMetadataValue - Metadata value.
     */
    setMetadata(pMetadataKey: string, pMetadataValue: any): void;
}
//# sourceMappingURL=property-metadata.d.ts.map
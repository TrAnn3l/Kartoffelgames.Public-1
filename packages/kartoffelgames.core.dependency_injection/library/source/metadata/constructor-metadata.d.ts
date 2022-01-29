import { InjectionConstructor } from '../type';
import { PropertyMetadata } from './property-metadata';
/**
 * Constructor metadata.
 */
export declare class ConstructorMetadata {
    private readonly mCustomMetadata;
    private mParameterTypes;
    private readonly mPropertyMetadata;
    /**
     * Get parameter type information.
     */
    get parameterTypeList(): Array<InjectionConstructor>;
    /**
     * Set parameter type information.
     */
    set parameterTypeList(pParameterTypes: Array<InjectionConstructor>);
    /**
     * Constructor.
     * Initialize lists.
     */
    constructor();
    /**
     * Get metadata of constructor.
     * @param pMetadataKey - Metadata key.
     */
    getMetadata<T>(pMetadataKey: string): T;
    /**
     * Get property by key.
     * Creates new property metadata if it not already exists.
     * @param pPropertyKey - Key of property.
     */
    getProperty(pPropertyKey: string | symbol): PropertyMetadata;
    /**
     * Set metadata of constructor.
     * @param pMetadataKey - Metadata key.
     * @param pMetadataValue - Metadata value.
     */
    setMetadata<T>(pMetadataKey: string, pMetadataValue: T): void;
}
//# sourceMappingURL=constructor-metadata.d.ts.map
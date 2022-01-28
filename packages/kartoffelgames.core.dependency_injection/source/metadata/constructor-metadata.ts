import { Dictionary, List } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '../type';
import { PropertyMetadata } from './property-metadata';

/**
 * Constructor metadata.
 */
export class ConstructorMetadata {
    private readonly mCustomMetadata: Dictionary<string, any>;
    private mParameterTypes: Array<InjectionConstructor>;
    private readonly mPropertyMetadata: Dictionary<string | symbol, PropertyMetadata>;

    /**
     * Get parameter type information.
     */
    public get parameterTypes(): Array<InjectionConstructor> {
        return this.mParameterTypes ?? null;
    }

    /**
     * Set parameter type information.
     */
    public set parameterTypes(pParameterTypes: Array<InjectionConstructor>) {
        // Copy array.
        this.mParameterTypes = List.newListWith(...pParameterTypes);
    }

    /**
     * Constructor.
     * Initialize lists.
     */
    public constructor() {
        this.mCustomMetadata = new Dictionary<string, any>();
        this.mPropertyMetadata = new Dictionary<string | symbol, PropertyMetadata>();
    }

    /**
     * Get metadata of constructor.
     * @param pMetadataKey - Metadata key.
     */
    public getMetadata(pMetadataKey: string): unknown {
        return this.mCustomMetadata.get(pMetadataKey);
    }

    /**
     * Get property by key.
     * Creates new property metadata if it not already exists.
     * @param pPropertyKey - Key of property.
     */
    public getProperty(pPropertyKey: string | symbol): PropertyMetadata {
        // Create if missing.
        if (!this.mPropertyMetadata.has(pPropertyKey)) {
            this.mPropertyMetadata.add(pPropertyKey, new PropertyMetadata());
        }

        return this.mPropertyMetadata.get(pPropertyKey);
    }

    /**
     * Set metadata of constructor.
     * @param pMetadataKey - Metadata key.
     * @param pMetadataValue - Metadata value.
     */
    public setMetadata(pMetadataKey: string, pMetadataValue: any): void {
        this.mCustomMetadata.set(pMetadataKey, pMetadataValue);
    }
}
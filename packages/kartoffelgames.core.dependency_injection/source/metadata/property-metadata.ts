import { Dictionary, List } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '../type';


export class PropertyMetadata {
    private readonly mCustomMetadata: Dictionary<string, any>;
    private mParameterTypes: Array<InjectionConstructor> | null;
    private mReturnType: InjectionConstructor | null;
    private mType: InjectionConstructor | null;

    /**
     * Get parameter type information.
     */
    public get parameterTypes(): Array<InjectionConstructor> | null {
        return this.mParameterTypes;
    }

    /**
     * Set parameter type information.
     */
    public set parameterTypes(pParameterTypes: Array<InjectionConstructor> | null) {
        // Copy array.
        if (pParameterTypes !== null) {
            this.mParameterTypes = List.newListWith(...pParameterTypes);
        } else {
            this.mParameterTypes = null;
        }
    }

    /**
     * Get return type information.
     */
    public get returnType(): InjectionConstructor | null {
        return this.mReturnType;
    }

    /**
     * Set return type information.
     */
    public set returnType(pReturnType: InjectionConstructor | null) {
        this.mReturnType = pReturnType;
    }

    /**
     * Get property type information.
     */
    public get type(): InjectionConstructor | null {
        return this.mType;
    }

    /**
     * Set property type information.
     */
    public set type(pReturnType: InjectionConstructor | null) {
        this.mType = pReturnType;
    }

    /**
     * Constructor.
     * Initialize lists.
     */
    public constructor() {
        this.mCustomMetadata = new Dictionary<string, any>();
        this.mParameterTypes = null;
        this.mType = null;
        this.mReturnType = null;
    }

    /**
     * Get metadata of constructor.
     * @param pMetadataKey - Metadata key.
     */
    public getMetadata<T>(pMetadataKey: string): T {
        return this.mCustomMetadata.get(pMetadataKey) ?? null;
    }

    /**
     * Set metadata of constructor.
     * @param pMetadataKey - Metadata key.
     * @param pMetadataValue - Metadata value.
     */
    public setMetadata<T>(pMetadataKey: string, pMetadataValue: T): void {
        this.mCustomMetadata.set(pMetadataKey, pMetadataValue);
    }
}
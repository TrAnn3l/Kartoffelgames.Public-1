import { Dictionary, List } from '@kartoffelgames/core.data';
import { InjectionConstructor } from '../type';


export class PropertyMetadata {
    private readonly mCustomMetadata: Dictionary<string, any>;
    private mParameterTypes: Array<InjectionConstructor>;
    private mReturnType: InjectionConstructor;
    private mType: InjectionConstructor;

    /**
     * Get parameter type information.
     */
    public get parameterTypeList(): Array<InjectionConstructor> {
        return this.mParameterTypes ?? null;
    }

    /**
     * Set parameter type information.
     */
    public set parameterTypeList(pParameterTypes: Array<InjectionConstructor>) {
        // Copy array.
        this.mParameterTypes = List.newListWith(...pParameterTypes);
    }

    /**
     * Get return type information.
     */
    public get returnType(): InjectionConstructor {
        return this.mReturnType ?? null;
    }

    /**
     * Set return type information.
     */
    public set returnType(pReturnType: InjectionConstructor) {
        this.mReturnType = pReturnType;
    }

    /**
     * Get property type information.
     */
    public get type(): InjectionConstructor {
        return this.mType ?? null;
    }

    /**
     * Set property type information.
     */
    public set type(pReturnType: InjectionConstructor) {
        this.mType = pReturnType;
    }

    /**
     * Constructor.
     * Initialize lists.
     */
    public constructor() {
        this.mCustomMetadata = new Dictionary<string, any>();
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
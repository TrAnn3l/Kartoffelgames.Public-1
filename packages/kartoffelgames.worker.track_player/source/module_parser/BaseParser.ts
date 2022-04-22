import { GenericModule } from '../generic_module/generic-module';

export abstract class BaseParser {
    private readonly mData: Uint8Array;

    /**
     * Get module byte data.
     */
    protected get data(): Uint8Array{
        return this.mData;
    }

    /**
     * Constructor.
     * @param pData - Byte data of module.
     */
    public constructor(pData: Uint8Array) {
        this.mData = pData;
    }

    /**
     * Parse data to a generic module.
     */
    public abstract parse(): GenericModule;
}
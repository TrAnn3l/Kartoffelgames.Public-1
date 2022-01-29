import { InjectableDecorator } from './decorator/injectable-decorator';
import { InjectableSingletonDecorator } from './decorator/injectable-singleton-decorator';
import { MetadataDecorator } from './decorator/metadata-decorator';
export declare class Injector {
    /**
     * AtScript.
     * Mark class to be injectable as an instanced object.
     * @param pConstructor - Constructor.
     */
    static readonly Injectable: typeof InjectableDecorator;
    /**
     * AtScript.
     * Mark class to be injectable as an singleton object.
     * @param pConstructor - Constructor.
     */
    static readonly InjectableSingleton: typeof InjectableSingletonDecorator;
    /**
     * AtScript.
     * Add metadata to class, method, accessor or property
     * @param pMetadataKey - Key of metadata.
     * @param pMetadataValue - Value of metadata.
     */
    static readonly Metadata: typeof MetadataDecorator;
}
//# sourceMappingURL=injector.d.ts.map
import { InjectableDecorator } from './decorator/injectable-decorator';
import { InjectableSingletonDecorator } from './decorator/injectable-singleton-decorator';
import { MetadataDecorator } from './decorator/metadata-decorator';

export class Injector {
    /**
     * AtScript.
     * Mark class to be injectable as an instanced object.
     * @param pConstructor - Constructor.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly Injectable = InjectableDecorator;

    /**
     * AtScript.
     * Mark class to be injectable as an singleton object.
     * @param pConstructor - Constructor.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly InjectableSingleton = InjectableSingletonDecorator;

    /**
     * AtScript.
     * Add metadata to class, method, accessor or property
     * @param pMetadataKey - Key of metadata.
     * @param pMetadataValue - Value of metadata.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly Metadata = MetadataDecorator;
}
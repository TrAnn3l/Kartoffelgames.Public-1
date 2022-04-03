import { Metadata } from '../metadata/metadata';
import { ReflectInitializer } from '../reflect/reflect-initializer';
import { InjectionConstructor } from '../type';

ReflectInitializer.initialize();

/**
 * AtScript.
 * Add metadata to class, method, accessor or property
 * @param pMetadataKey - Key of metadata.
 * @param pMetadataValue - Value of metadata.
 */
export function MetadataDecorator<T>(pMetadataKey: string, pMetadataValue: T) {
    return (pTarget: object | InjectionConstructor, pProperty?: string | symbol): void => {
        // Get constructor from prototype if is an instanced member.
        let lConstructor: InjectionConstructor;
        if (typeof pTarget !== 'function') {
            lConstructor = <InjectionConstructor>(<object>pTarget).constructor;
        } else {
            lConstructor = <InjectionConstructor>pTarget;
        }

        // Set metadata for property or class.
        if (pProperty) {
            Metadata.get(lConstructor).getProperty(pProperty).setMetadata(pMetadataKey, pMetadataValue);
        } else {
            Metadata.get(lConstructor).setMetadata(pMetadataKey, pMetadataValue);
        }
    };
}